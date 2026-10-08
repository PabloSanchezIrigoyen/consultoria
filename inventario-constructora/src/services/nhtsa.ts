import { apiFetch } from "@/utils/api";

export type NhtsaMake = {
  Make_ID: number;
  Make_Name: string;
};

export type NhtsaModel = {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
};

type MakesResponse = {
  Count: number;
  Results: NhtsaMake[];
};

type ModelsResponse = {
  Count: number;
  Results: NhtsaModel[];
};

export async function getMakes(): Promise<NhtsaMake[]> {
  const data = await apiFetch<MakesResponse>("/api/nhtsa/makes", {
    cache: "no-store",
  });

  return data.Results ?? [];
}

export async function getModels(
  make: string,
  year: string
): Promise<NhtsaModel[]> {
  if (!make || !year) return [];

  const data = await apiFetch<ModelsResponse>(
    `/api/nhtsa/models/${encodeURIComponent(make)}/${encodeURIComponent(year)}`,
    {
      cache: "no-store",
    }
  );

  return data.Results ?? [];
}