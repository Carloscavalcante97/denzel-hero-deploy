"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import FilterEvento from "./ui/selecionarEventos";



export default function Galeria() {
  const [highlightedMedia, setHighlightedMedia] = useState<highlighted[]>([]);
  const [verMais, setVerMais] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<evento | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const mediasFiltradas = selectedEvento
    ? highlightedMedia.filter((m) => m.evento === selectedEvento.title)
    : highlightedMedia;

 
  const extraMedia = mediasFiltradas.slice(7);
  
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? extraMedia.length - 1 : prev - 1
    );
  const nextSlide = () =>
    setCurrentSlide((prev) =>
      prev === extraMedia.length - 1 ? 0 : prev + 1
    );
  
      const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide(); // Swipe esquerda
    } else if (touchEndX - touchStartX > 50) {
      prevSlide(); // Swipe direita
    }
  };
  useEffect(() => {
    async function fetchHighlighted() {
      try {
        const res = await fetch(
          "https://denzel-hero-backend.onrender.com/highlighted"
        );
        const data: highlighted[] = await res.json();
        setHighlightedMedia(data);
        setSelectedEvento(data[0]?.evento ? { title: data[0].evento, date: data[0].created_at } : null);
        console.log(data)
      } catch (error) {
        console.error("Error fetching highlighted media:", error);
      }
    }
    fetchHighlighted();
  }, []);

  return (
    <div className="relative mt-4 max-w-md mx-auto">
      <div className="p-[2px] rounded-4xl bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]">
        <div className="relative bg-[#100D1E] rounded-[30px]">
          <div
            className={`p-4 transition-[max-height] duration-1000 ease-in-out overflow-hidden ${
              verMais ? "max-h-[2000px]" : "max-h-[320px]"
            }`}
          >
            {/* Botão de filtro */}
            <FilterEvento onSelect={(evento) => setSelectedEvento(evento)} />

            {/* Título dinâmico */}
            <div className="text-center mb-3 mt-6">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-lg font-bold">
                {selectedEvento ? selectedEvento.title : "Selecione um evento"}
              </h2>
              {selectedEvento && (
                <p className="text-gray-400 text-sm">
                  Postado em{' '}
                  {new Date(selectedEvento.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            {/* Galeria em mosaico com mediasFiltradas */}
            <div className="flex gap-2 mb-4">
              <div className="flex flex-col gap-2 w-[50%]">
                {mediasFiltradas.slice(0, 2).map((media, i) => (
                  <div key={media.id} className="relative w-full aspect-square rounded-md overflow-hidden">
                    <Image
                      src={media.filepath}
                      alt={`Destaque ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-2 left-2 bg-[#43A3D5] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {media.usuario_instagram}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 w-[40%]">
                <div className="flex gap-1">
                  {mediasFiltradas.slice(2, 4).map((media, i) => (
                    <div key={media.id} className="relative w-1/2 aspect-square rounded-md overflow-hidden">
                      <Image
                        src={media.filepath}
                        alt={`Destaque ${i + 3}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute bottom-1 left-1 bg-[#6E3CB2] text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full truncate max-w-[90%]">
                        @{media.usuario_instagram}
                      </div>
                    </div>
                  ))}
                </div>

                {mediasFiltradas[4] && (
                  <div className="relative aspect-square rounded-md overflow-hidden">
                    <Image
                      src={mediasFiltradas[4].filepath}
                      alt="Destaque central"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-1 left-1 bg-[#6E3CB2] text-white text-[10px] font-semibold px-2 py-[1px] rounded-full truncate max-w-[90%]">
                      @{mediasFiltradas[4].usuario_instagram}
                    </div>
                  </div>
                )}

                <div className="flex gap-1">
                  {mediasFiltradas.slice(5, 7).map((media) => (
                    <div key={media.id} className="relative w-1/2 aspect-square rounded-md overflow-hidden">
                      <Image
                        src={media.filepath}
                        alt="Destaque pequeno"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute bottom-1 left-1 bg-[#6E3CB2] text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full truncate max-w-[90%]">
                        @{media.usuario_instagram}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carrossel de extras com mediasFiltradas */}
            {verMais && extraMedia.length > 0 && (
  <div
    className="relative mt-4"
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <div className="overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extraMedia.map((media) => (
          <div
            key={media.id}
            className="relative flex-shrink-0 w-full h-[340px] overflow-hidden"
          >
            <Image
              src={media.filepath}
              alt={`@${media.usuario_instagram}`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-white text-xs px-2 py-0.5 rounded-full font-medium">
              @{media.usuario_instagram}
            </div>
          </div>
        ))}
      </div>
    </div>
    <button
      onClick={prevSlide}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#1A172A] text-white p-2 rounded-full shadow-lg"
    >
      ◀
    </button>
    <button
      onClick={nextSlide}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1A172A] text-white p-2 rounded-full shadow-lg"
    >
      ▶
    </button>
  </div>
)}
          </div>
        </div>
      </div>

      {/* Faixa gradiente */}
      <div className="relative bottom-19 -mx-4 -mb-6 z-0">
        <Image
          src="/divisaogaleria.svg"
          alt="divisao gradiente"
          width={390}
          height={85}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Botão Ver Mais */}
      <div className="relative z-10 bottom-13 flex justify-center -mt-10">
        <button
          onClick={() => setVerMais(!verMais)}
          className="bg-[#1A172A] text-white text-sm font-medium px-6 py-1.5 rounded-full border border-white/20"
        >
          {verMais ? "▲ Ver Menos" : "▼ Ver Mais"}
        </button>
      </div>
    </div>
  );
}
