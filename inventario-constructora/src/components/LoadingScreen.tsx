// src/pages/LoadingScreen.tsx
import React from "react";
import "@/styles/loading.css";

const LoadingScreen: React.FC = () => {
  return (
    <div className="splash">
      <div className="splash-backdrop" />

      <div className="splash-logo">
        {/* Isotipo rojo */}
        <div className="icon">
          <svg
            className="splash-logo-svg"
            viewBox="0 0 340 300"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Isotipo BRUN & FER"
          >
            <path
              className="red"
              d="
                M18 18
                H286
                C315 18 334 39 334 66
                C334 90 321 109 299 118
                C323 126 337 146 337 171
                C337 201 316 222 282 222
                H84
                L23 298
                L35 170
                H247
                C260 170 270 161 270 148
                C270 135 260 126 247 126
                H86
                L106 86
                H246
                C259 86 269 78 269 65
                C269 52 259 43 246 43
                H60
                L18 18
                Z
              "
            />
          </svg>
        </div>

        {/* Texto */}
        <div className="text">
          <div className="main">
            <span>BRUN</span>
            <span>&amp;</span>
            <span>FER</span>
          </div>
          <div className="subtitle">
            Proyectos y Desarrollos Arquitectónicos S.A. de C.V.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;