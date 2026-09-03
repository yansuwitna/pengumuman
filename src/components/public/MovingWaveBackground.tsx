"use client";

import React from "react";

export default function MovingWaveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-white to-blue-50/60" />

      {/* 2. Top Glowing Floating Orbs */}
      <div className="absolute -top-32 left-1/4 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-tr from-sky-400/25 via-blue-300/20 to-indigo-300/20 blur-[100px] sm:blur-[130px] animate-float-gentle" />
      <div className="absolute top-1/3 -right-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-bl from-purple-300/25 via-pink-300/20 to-rose-200/20 blur-[110px] sm:blur-[140px] animate-float-gentle" />

      {/* 3. Layer Gelombang Bergerak (Multi-Layer Animated SVG Waves) */}
      <div className="absolute inset-0 flex flex-col justify-end overflow-hidden opacity-70">
        {/* Gelombang Layer 1 - Cyan to Royal Blue (Paling Belakang) */}
        <div className="absolute -bottom-10 left-0 w-[200%] sm:w-[300%] h-72 sm:h-96 animate-wave-1">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full preserve-3d"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave-grad-1)"
              d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,154.7C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Gelombang Layer 2 - Ungu Lavender & Pink Peach (Lapisan Tengah) */}
        <div className="absolute -bottom-6 left-0 w-[220%] sm:w-[320%] h-64 sm:h-88 animate-wave-2">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="wave-grad-2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f472b6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave-grad-2)"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,117.3C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Gelombang Layer 3 - Mint Emerald & Sky Blue (Lapisan Depan) */}
        <div className="absolute bottom-0 left-0 w-[250%] sm:w-[350%] h-56 sm:h-80 animate-wave-3">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wave-grad-3)"
              d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,192C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* 4. Subtle Ambient Texture Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-25" />
    </div>
  );
}
