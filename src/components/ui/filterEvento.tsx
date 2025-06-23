"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Evento {
  title: string;
}

interface FilterEventoProps {
  onSelect: (evento: Evento) => void;
  eventoSelecionado: string | null;
}

export default function FilterEvento({ onSelect, eventoSelecionado }: FilterEventoProps) {
  const [open, setOpen] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    if (!open) return;

    async function fetchEventos() {
      try {
        const res = await fetch("https://denzel-hero-deploy.onrender.com/eventos");
        const data: Evento[] = await res.json();
        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      }
    }

    fetchEventos();
  }, [open]);

  return (
    <div className="relative w-full max-w-sm">
      <button
  onClick={() => setOpen((prev) => !prev)}
  className="w-full px-4 py-2 bg-[#1A172A] text-white text-center border border-[#2C2740] rounded-lg"
>
  {eventoSelecionado ? (
    ` ${eventoSelecionado}`
  ) : (
    <>
      <Image src="/play.svg" alt="Filtrar Evento" width={13} height={14} />
      <span className="ml-2">Escolher Evento</span>
    </>
  )}
</button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-[#1A172A] border border-[#2C2740] rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto">
          <ul className="space-y-1">
            {eventos.map((ev) => (
              <li key={ev.title}>
                <button
                  onClick={() => {
                    onSelect(ev);
                    setOpen(false);
                  }}
                  className="w-full text-left text-white hover:bg-[#2C2740] px-3 py-1 rounded"
                >
                  {ev.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
