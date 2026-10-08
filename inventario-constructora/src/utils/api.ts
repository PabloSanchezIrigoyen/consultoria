import Swal from "sweetalert2";

type Opts = RequestInit & {
  json?: any;
  /** Por defecto TRUE. Pon withAuth:false si NO quieres enviar el token. */
  withAuth?: boolean;
  /** Si TRUE, no muestra el SweetAlert ni redirige en 401. */
  suppress401Redirect?: boolean;
};

const LS_KEY = "auth:user";
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiUrl(path: string): string {
  return `${API_ORIGIN}/${path.replace(/^\/+/, "")}`;
}

/** Evita mostrar múltiples alerts si llegan varios 401 simultáneos */
let showing401Alert = false;

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

/**
 * Centraliza llamadas a la API:
 * - Adjunta Authorization: Bearer <token> (salvo withAuth:false)
 * - Maneja errores y 401 con SweetAlert (salvo suppress401Redirect:true)
 */
export async function apiFetch<T = any>(url: string, opts: Opts = {}): Promise<T> {
  // Usamos Record<string,string> en lugar de HeadersInit
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string> || {}) };

  // Body JSON
  if (opts.json !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  // Token (por defecto sí se envía)
  const token = getToken();
  if (token && opts.withAuth !== false) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(url), {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  });

  // Errores HTTP
  if (!res.ok) {
    if (res.status === 401 && !opts.suppress401Redirect) {
      try { localStorage.removeItem(LS_KEY); } catch {}

      if (!showing401Alert) {
        showing401Alert = true;
        try {
          await Swal.fire({
            icon: "warning",
            title: "Sesión expirada",
            text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            confirmButtonColor: "#c70000",
            confirmButtonText: "Ir al inicio de sesión",
          });
        } finally {
          showing401Alert = false;
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
      throw new Error("No autorizado (401)");
    }

    const body = await res.text();
    let data: { message?: string; error?: string } = {};
    try {
      data = body ? JSON.parse(body) : {};
    } catch {
      // Use the response body as a plain-text error below.
    }
    let msg = data.message || data.error || body;

    if (msg.includes("<!DOCTYPE") || msg.trim() === "") {
      msg = `HTTP ${res.status}`;
    }

    throw new ApiError(msg, res.status);
  }

  if (res.status === 204) return undefined as unknown as T;
  const body = await res.text();
  if (!body.trim()) {
    throw new ApiError("El servidor devolvió una respuesta vacía.", 502);
  }
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ApiError("El servidor devolvió una respuesta no válida.", 502);
  }
}
