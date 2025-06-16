"use client";

import { useState, useEffect } from "react";
import Image from "next/image";


interface EscolherFestaProps {
  onSelect: (evento: evento) => void;
}

export default function EscolherFesta({ onSelect }: EscolherFestaProps) {
  const [open, setOpen] = useState(false);
  const [eventos, setEventos] = useState<evento[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    async function fetchEventos() {
      try {
        const res = await fetch("https://denzel-hero-backend.onrender.com/eventos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data: evento[] = await res.json();
        console.log("Eventos recebidos:", data);
        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      }
    }

    fetchEventos();
  }, [open]);

  return (
    <div >
     <button
  onClick={() => setOpen((o) => !o)}
  className="w-full h-[40px] flex items-center gap-2 justify-center mb-3 px-4 py-2 border border-white/30 rounded-md text-white text-sm bg-transparent relative"
>
  {eventoSelecionado ? (
    <span className="text-sm">{eventoSelecionado}</span>
  ) : (
    <>
      <Image src="/play.svg" alt="Filtrar Evento" width={13} height={14} />
      <span className="text-sm">Escolher Festa</span>
    </>
  )}
</button>

      {open && (
        <div className="mt-2 bg-[#1A172A] rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {eventos.map((ev) => (
              <li key={ev.title}>
                <button
                  onClick={() => {
                    onSelect(ev);
                    setEventoSelecionado(ev.title);
                    setOpen(false);
                  }}
                  className="w-full text-left text-white hover:bg-[#333] rounded px-2 py-1"
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