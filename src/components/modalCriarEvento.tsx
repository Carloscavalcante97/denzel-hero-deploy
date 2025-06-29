// components/ui/ModalCriarEvento.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ModalSucessoEvento from "./modalEventoCriado";

interface ModalCriarEventoProps {
  open: boolean;
  onClose: () => void;
  onSuccessRefresh?: () => void;
}

export default function ModalCriarEvento({
  open,
  onClose,
  onSuccessRefresh,
}: ModalCriarEventoProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  useEffect(() => {
    if (open) {
      setTitle("");
      setError(null);
      setSuccessOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleCreate = async () => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(
      "https://denzel-hero-deploy.onrender.com/eventos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: title.trim() }),
      }
    );

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Resposta inválida do servidor:\n${text}`);
    }

    if (!res.ok) {
      throw new Error(json.error || "Falha ao criar evento");
    }

    setSuccessOpen(true);
    onSuccessRefresh?.();
  } catch (err: any) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* só o modal de criação */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-[#1A172A] rounded-xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]" />
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="/criarEvento.svg"
                  alt="Criar Evento"
                  width={140}
                  height={72}
                />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Nome do Evento"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-2 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none"
                disabled={loading}
              />
              {error && (
                <p className="text-red-400 text-sm mb-2">{error}</p>
              )}
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={() => {
                    setTitle("");
                    setError(null);
                    onClose();
                  }}
                  disabled={loading}
                  className="flex-1 py-2 hover:bg-white/10 transition rounded-full"
                >
                  <Image
                    src="/cancelar.svg"
                    alt="Cancelar"
                    width={133}
                    height={40}
                  />
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 py-2 text-white hover:opacity-90 transition rounded-full disabled:opacity-50"
                >
                  <Image
                    src="/criarEventoButton.svg"
                    alt="Criar Evento"
                    width={137}
                    height={40}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* só o modal de sucesso */}
      {successOpen && (
        <ModalSucessoEvento
          open={successOpen}
          onClose={() => {
            setSuccessOpen(false);
            onClose(); // fecha também o modal de criação
          }}
        />
      )}
    </>
  );
}
