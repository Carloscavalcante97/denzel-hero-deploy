// components/SuccessModal.tsx
"use client";

import Image from "next/image";
import { useEffect } from "react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  // fecha no ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 bg-[#100D1E] rounded-2xl overflow-hidden">
        {/* borda superior em gradiente */}
        <div className="h-1 w-full bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]" />

        <div className="px-6 py-8 flex flex-col items-center">
          {/* ícone de success */}
          <Image
            src="/sucesso.svg"      
            alt="Sucesso"
            width={254}
            height={158}
          />


          {/* botão Ok */}
          <button
            onClick={onClose}
            className="
              mt-6 w-full py-2 text-white text-sm rounded-full border border-white
              transition-colors duration-200
              active:bg-gradient-to-r active:from-[#9C60DA] active:to-[#43A3D5]
            "
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
