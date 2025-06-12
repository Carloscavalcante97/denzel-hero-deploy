"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface QuemSomosItem {
  id: number;
  image_path: string;
}

export default function QuemSomosCarousel() {
  const [images, setImages] = useState<QuemSomosItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const fetchImages = async () => {
    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/denzelmedia", {
        credentials: "include"
      });
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Erro ao carregar imagens:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => next(), 5000);
    return () => clearInterval(timer);
  }, [current, images.length]);

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) next();
    else if (touchEndX - touchStartX > 50) prev();
  };

  if (images.length === 0) return null;

  return (
    <section className="relative w-full bg-[#100D1E] py-8 overflow-hidden">
      <div className="max-w-[420px] mx-auto px-4">
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full pt-[150%]">
            <Image
              src={images[current].image_path}
              alt={`Imagem ${images[current].id}`}
              fill
              className="object-contain rounded-xl"
            />
          </div>

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
