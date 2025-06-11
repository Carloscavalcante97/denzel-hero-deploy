"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function QuemSomosCarousel() {
  const images = [
    { src: "/teste.png", alt: "Nossa equipe reunida" },
    { src: "/teste.png", alt: "Nosso escritório" },
  ];

  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const length = images.length;

  const prev = () => setCurrent(c => (c === 0 ? length - 1 : c - 1));
  const next = () => setCurrent(c => (c === length - 1 ? 0 : c + 1));

  // Auto-slide a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => next(), 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) next(); // esquerda
    else if (touchEndX - touchStartX > 50) prev(); // direita
  };

  return (
    <section className="relative w-full bg-[#100D1E] py-8 overflow-hidden">
      <div className="max-w-[420px] mx-auto px-4">
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Apenas a imagem atual visível */}
          <div className="relative w-full pt-[150%]">
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-contain rounded-xl"
            />
          </div>

          {/* Setas */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full"
          >
            ›
          </button>
        </div>

        {/* Indicadores */}
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
      </div>
    </section>
  );
}
