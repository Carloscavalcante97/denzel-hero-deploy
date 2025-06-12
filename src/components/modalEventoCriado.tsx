// components/ui/ModalSucesso.tsx
"use client";

import Image from "next/image";

interface ModalSucessoProps {
  open: boolean;
  onClose: () => void;

}

export default function ModalSucessoEvento({
  open,
  onClose,
}: ModalSucessoProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-[#1A172A] rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho com gradiente fino */}
        <div className="h-1 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]" />

        {/* Conteúdo */}
        <div className="p-6 text-center">
          {/* Ícone de check */}
          <div className="flex justify-center mb-4">
            <Image
              src="/eventoCriadoSucesso.svg"
              alt="Sucesso"
              width={160}
              height={88}
            />
          </div>

          

          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="w-full py-2 flex justify-center hover:bg-white/10 transition"
          >
            <Image
              src="/checkIcon.svg"
              alt="Sucesso"
              width={172}
              height={40}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
