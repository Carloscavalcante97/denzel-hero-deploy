"use client";
import Image from "next/image";
import { useState, useEffect } from "react";



interface FilterEventoProps {
  onSelect: (evento: evento) => void;
}

export default function FilterEvento({ onSelect }: FilterEventoProps) {
  const [open, setOpen] = useState(false);
  const [eventos, setEventos] = useState<evento[]>([]);

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
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[220px] z-30">
      <div className="p-[1.5px] rounded-full bg-gradient-to-r w-[224px]  from-[#9C60DA] to-[#43A3D5]">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-center gap-2 w-[220px] px-4 py-1 text-sm text-white bg-[#1A172A] rounded-full"
        >
          <Image src="/play.svg" alt="Filtrar Evento" width={13} height={14} />
          {eventos.length > 0 ? "Filtrar Evento" : "Carregando eventos..."}
        </button>
      </div>

      {open && (
        <div className="mt-2 bg-[#1A172A] rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {eventos.map((ev) => (
              <li key={ev.title}>
                <button
                  onClick={() => {
                    onSelect(ev);
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
