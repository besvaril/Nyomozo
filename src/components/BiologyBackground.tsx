import React from 'react';
import labBgImage from '../assets/images/biology_lab_bg_1787840733818.jpg';

export const BiologyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Biology Laboratory Wallpaper with Dark Atmosphere Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen scale-105 transform-gpu transition-opacity duration-1000">
        <img
          src={labBgImage}
          alt="Biological Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter saturate-150 contrast-125"
        />
      </div>

      {/* 2. Radial Vignette Gradient for Content Readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#05070a]/70 to-[#05070a]/95" />

      {/* 3. Deep Ambient Color Glows (Animals=Blue, Plants=Green, Fungi=Purple/Amber) */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/05 rounded-full blur-[100px]" />

      {/* 4. Biology Vector Schematics / Scientific Blueprints */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Scientific Grid Pattern */}
          <pattern
            id="bio-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(6, 182, 212, 0.07)"
              strokeWidth="0.8"
            />
            <circle cx="60" cy="0" r="1" fill="rgba(6, 182, 212, 0.25)" />
            <circle cx="0" cy="60" r="1" fill="rgba(6, 182, 212, 0.25)" />
          </pattern>

          {/* DNA Gradient */}
          <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
          </linearGradient>

          {/* Plant Gradient */}
          <linearGradient id="plantGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
          </linearGradient>

          {/* Fungi Gradient */}
          <linearGradient id="fungiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Global Blueprint Grid */}
        <rect width="100%" height="100%" fill="url(#bio-grid)" />

        {/* LEFT SIDE: DNA Double Helix Blueprint */}
        <g transform="translate(40, 120)" className="hidden lg:block opacity-60">
          <path
            d="M 15 0 Q 35 40 15 80 T 15 160 T 15 240 T 15 320 T 15 400 T 15 480"
            fill="none"
            stroke="url(#dnaGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 45 0 Q 25 40 45 80 T 45 160 T 45 240 T 45 320 T 45 400 T 45 480"
            fill="none"
            stroke="url(#dnaGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Base pairs rungs */}
          {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460].map(
            (y, i) => (
              <line
                key={`dna-rung-${i}`}
                x1={15 + Math.sin(i) * 8}
                y1={y}
                x2={45 - Math.sin(i) * 8}
                y2={y}
                stroke="#06b6d4"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            )
          )}
          <text
            x="0"
            y="-10"
            fill="#06b6d4"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="2"
            opacity="0.8"
          >
            GENOMIKUS DNS STRUKTÚRA
          </text>
        </g>

        {/* TOP RIGHT: Eukaryotic Plant Cell & Chloroplast schematic */}
        <g
          transform="translate(1100, 60)"
          className="hidden xl:block opacity-50"
        >
          {/* Plant Cell Wall */}
          <polygon
            points="60,10 140,10 180,70 140,130 60,130 20,70"
            fill="none"
            stroke="url(#plantGrad)"
            strokeWidth="2"
          />
          <polygon
            points="65,18 135,18 170,70 135,122 65,122 30,70"
            fill="rgba(16, 185, 129, 0.03)"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Large Central Vacuole */}
          <ellipse
            cx="95"
            cy="70"
            rx="35"
            ry="25"
            fill="none"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1"
          />
          {/* Chloroplasts */}
          <ellipse
            cx="55"
            cy="45"
            rx="10"
            ry="6"
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10b981"
            strokeWidth="1"
          />
          <ellipse
            cx="140"
            cy="50"
            rx="9"
            ry="5"
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10b981"
            strokeWidth="1"
          />
          <ellipse
            cx="70"
            cy="100"
            rx="11"
            ry="6"
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10b981"
            strokeWidth="1"
          />
          {/* Nucleus */}
          <circle
            cx="135"
            cy="90"
            r="12"
            fill="rgba(168, 85, 247, 0.15)"
            stroke="#a855f7"
            strokeWidth="1"
          />
          <circle cx="135" cy="90" r="4" fill="#a855f7" opacity="0.6" />
          <text
            x="25"
            y="155"
            fill="#10b981"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="1.5"
            opacity="0.8"
          >
            NÖVÉNYI SEJTSZERKEZET (SEJTFAL + KLOROPLASZTISZ)
          </text>
        </g>

        {/* BOTTOM RIGHT: Fungal Hyphae & Spore Network Schematic */}
        <g
          transform="translate(1080, 560)"
          className="hidden lg:block opacity-55"
        >
          {/* Mushroom / Fungal Spores cap contour */}
          <path
            d="M 50 80 Q 90 20 130 80 Z"
            fill="rgba(192, 132, 252, 0.08)"
            stroke="url(#fungiGrad)"
            strokeWidth="1.5"
          />
          {/* Stem */}
          <path
            d="M 82 80 L 80 120 M 98 80 L 100 120"
            stroke="#c084fc"
            strokeWidth="1.2"
          />
          {/* Branching Hyphae Mycelium */}
          <path
            d="M 80 120 Q 50 140 20 150 M 90 120 Q 100 150 120 170 M 100 120 Q 140 135 170 140 M 50 140 Q 30 170 10 180"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          {/* Spores floating */}
          <circle cx="65" cy="40" r="2.5" fill="#c084fc" opacity="0.7" />
          <circle cx="85" cy="30" r="2" fill="#fbbf24" opacity="0.8" />
          <circle cx="110" cy="45" r="3" fill="#c084fc" opacity="0.7" />
          <circle cx="140" cy="65" r="1.5" fill="#fbbf24" opacity="0.9" />
          <circle cx="150" cy="50" r="2" fill="#c084fc" opacity="0.6" />
          <text
            x="20"
            y="200"
            fill="#c084fc"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="1.5"
            opacity="0.8"
          >
            GOMBÁK: MICÉLIUM ÉS KITIN SEJTFAL
          </text>
        </g>

        {/* BOTTOM LEFT: Animal Cell & Neuron / Muscle fiber schematic */}
        <g
          transform="translate(40, 680)"
          className="hidden md:block opacity-50"
        >
          {/* Animal Cell Membrane (Flexible, no cell wall) */}
          <path
            d="M 40 40 Q 80 10 120 40 T 160 80 T 120 120 T 40 110 T 20 70 Z"
            fill="rgba(6, 182, 212, 0.04)"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Nucleus with DNA */}
          <circle
            cx="90"
            cy="75"
            r="16"
            fill="rgba(6, 182, 212, 0.15)"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />
          <circle cx="90" cy="75" r="5" fill="#38bdf8" opacity="0.7" />
          {/* Mitochondria */}
          <ellipse
            cx="50"
            cy="60"
            rx="8"
            ry="4"
            fill="rgba(244, 63, 94, 0.2)"
            stroke="#f43f5e"
            strokeWidth="1"
          />
          <ellipse
            cx="130"
            cy="90"
            rx="9"
            ry="4"
            fill="rgba(244, 63, 94, 0.2)"
            stroke="#f43f5e"
            strokeWidth="1"
          />
          <text
            x="0"
            y="145"
            fill="#38bdf8"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="1.5"
            opacity="0.8"
          >
            ÁLLATI SEJT: SEJTFAL NÉLKÜL • HETEROTRÓF
          </text>
        </g>

        {/* Floating Reticles / Microscopic Crosshairs */}
        <g className="opacity-30">
          {/* Top Center Crosshair */}
          <circle
            cx="50%"
            cy="15%"
            r="28"
            fill="none"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="0.8"
          />
          <line
            x1="49%"
            y1="15%"
            x2="51%"
            y2="15%"
            stroke="#06b6d4"
            strokeWidth="0.8"
          />
          <line
            x1="50%"
            y1="13%"
            x2="50%"
            y2="17%"
            stroke="#06b6d4"
            strokeWidth="0.8"
          />

          {/* Right Center Microscope Target */}
          <circle
            cx="88%"
            cy="45%"
            r="40"
            fill="none"
            stroke="rgba(16, 185, 129, 0.25)"
            strokeWidth="0.8"
            strokeDasharray="6 3"
          />
          <circle
            cx="88%"
            cy="45%"
            r="20"
            fill="none"
            stroke="rgba(16, 185, 129, 0.35)"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
};
