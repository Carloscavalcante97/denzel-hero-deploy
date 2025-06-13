// components/QuerSaberMais.tsx
"use client";

import Image from "next/image";

export default function QuerSaberMais() {
  return (
    <section className="py-12 bg-[#100D1E] flex justify-center">
      <div className="w-[320px] h-[144px] mx-auto bg-[#1A172A] rounded-full px-6 py-8">
        {/* Título */}
        <h2 className="text-center text-[16px] font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]">
            Quer saber mais?
          </span>
        </h2>

        {/* Botão Instagram */}
        <div className="flex justify-center mt-6">
          <a
            href="https://instagram.com/denzeleventos"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2 px-5 py-3 
              bg-[#1D1933] rounded-full text-white text-sm font-medium 
              hover:opacity-90 
              transition-colors duration-200
              active:bg-gradient-to-r active:from-[#43A3D5] active:to-[#9C60DA]
            "
          >
            <Image
              src="/instagram.svg"
              alt="Instagram"
              width={20}
              height={20}
            />
            Segue a gente!
          </a>
        </div>
      </div>
    </section>
  );
}
