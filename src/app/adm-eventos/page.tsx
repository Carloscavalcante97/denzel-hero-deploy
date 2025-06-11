"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";

interface MediaItem {
  evento: string;
  usuario_instagram: string;
  filepath: string;
  highlight: boolean;
  id: number;
}

export default function AdmEvento() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [filtroEvento, setFiltroEvento] = useState("");

  useEffect(() => {
    async function fetchMedia() {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media");
      const data = await res.json();
      setMedia(data);
    }
    fetchMedia();
  }, []);

  const toggleAcordeon = (evento: string) => {
    setAbertos((prev) => {
      const novo = new Set(prev);
      novo.has(evento) ? novo.delete(evento) : novo.add(evento);
      return novo;
    });
  };

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  };

  const toggleTodosDoEvento = (ids: number[]) => {
    const todosSelecionados = ids.every((id) => selecionados.has(id));
    setSelecionados((prev) => {
      const novo = new Set(prev);
      ids.forEach((id) => {
        todosSelecionados ? novo.delete(id) : novo.add(id);
      });
      return novo;
    });
  };

  const agrupadoPorEvento = media.reduce((acc, item) => {
    if (!acc[item.evento]) acc[item.evento] = [];
    acc[item.evento].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  return (
    <div className="p-4 space-y-6 bg-[#100D1E] min-h-screen pb-[80px]">
      <div className="flex justify-center">
        <Image src="/galeriaEventos.svg" alt="galeria" width={250} height={30} />
      </div>

      <div className="flex justify-center my-2">
        <input
          type="text"
          placeholder="Buscar evento"
          value={filtroEvento}
          onChange={(e) => setFiltroEvento(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#1A172A] border border-[#2C2740] text-white placeholder:text-white w-full max-w-md text-center"
        />
      </div>

      {Object.entries(agrupadoPorEvento)
        .filter(([evento]) =>
          evento.toLowerCase().includes(filtroEvento.toLowerCase())
        )
        .map(([evento, imagens]) => {
          const aberto = abertos.has(evento);
          const ids = imagens.map((img) => img.id);
          const todosSelecionados = ids.every((id) => selecionados.has(id));

          return (
            <div key={evento} className="mb-3">
              <div
                className={classNames(
                  "rounded-[10px] transition-all duration-300",
                  todosSelecionados
                    ? "border-[2px] border-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] p-[1px]"
                    : "border border-[#463C61] p-[1px]"
                )}
              >
                <div className="bg-[#100D1E] rounded-[10px]">
                  <div
                    className="flex items-center justify-between px-3 py-[6px] cursor-pointer"
                    onClick={() => toggleAcordeon(evento)}
                  >
                    <label
                      className={classNames(
                        "flex items-center gap-2 text-sm font-medium",
                        todosSelecionados
                          ? "bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] bg-clip-text text-transparent"
                          : "text-white"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={todosSelecionados}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleTodosDoEvento(ids);
                        }}
                        className="accent-[#9C60DA]"
                      />
                      {evento}
                    </label>
                    <span className="text-white text-xs">
                      {aberto ? "▲" : "▼"}
                    </span>
                  </div>

                  {aberto && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-start px-2 pb-2">
                      {imagens.map((img) => (
                        <div
                          key={img.id}
                          className={classNames(
                            "relative w-[90px] h-[113px] rounded overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                            selecionados.has(img.id)
                              ? "border-[#9C60DA]"
                              : img.highlight
                              ? "border-[#43A3D5]"
                              : "border-transparent"
                          )}
                        >
                          <Image
                            src={img.filepath}
                            alt={`img-${img.id}`}
                            fill
                            className="object-cover"
                          />
                          <input
                            type="checkbox"
                            checked={selecionados.has(img.id)}
                            onChange={() => toggleSelecionado(img.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-1 left-1 z-20 w-4 h-4 accent-[#9C60DA]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
