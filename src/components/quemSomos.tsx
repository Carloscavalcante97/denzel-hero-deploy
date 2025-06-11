// components/QuemSomosCarousel.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function QuemSomosCarousel() {
  const images = [
    { src: "/teste.png", alt: "Nossa equipe reunida" },
    { src: "/teste.png", alt: "Nosso escritório" },
  ];

  const [current, setCurrent] = useState(0);
  const length = images.length;
  const prev = () => setCurrent(c => (c === 0 ? length - 1 : c - 1));
  const next = () => setCurrent(c => (c === length - 1 ? 0 : c + 1));

  return (
    <section className="relative w-screen bg-[#100D1E] py-8 overflow-hidden">
      {/* títulos ou outros elementos aqui, se quiser */}
      
      {/* carrossel */}
      <div className="relative">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${current * 100}vw)` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-screen relative"
              style={{ paddingTop: '150%' }} // 16:9 responsivo
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* setas */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
        >‹</button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
        >›</button>
      </div>

      {/* indicadores */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current ? "bg-[#9C60DA]" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
