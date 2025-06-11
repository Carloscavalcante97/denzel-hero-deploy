import Image from "next/image";
import { ReactNode } from "react";

interface ModalUsoProps {
  titulo: string;
  subtitulo: string;
  texto: string;
  icone: string; // caminho do SVG
  onClose: () => void;
}

export default function ModalUso({ titulo, subtitulo, texto, icone, onClose }: ModalUsoProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-[#1D1933] w-full max-w-md rounded-lg p-6 border-t-4 border-[#9C60DA] shadow-xl relative">
        
        {/* Botão de fechar */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg font-bold">
          ×
        </button>

        {/* Ícone e título */}
        <div className="flex flex-col items-center text-center mb-4 relative top-9">
          <Image src={icone} alt="ícone" width={98.57} height={71} />
          
        </div>

        {/* Texto de conteúdo */}
        <div className="border border-[#43A3D5] rounded-lg p-4 pt-10 text-sm text-white max-h-[300px] overflow-y-auto">
          {texto}
        </div>
      </div>
    </div>
  );
}
