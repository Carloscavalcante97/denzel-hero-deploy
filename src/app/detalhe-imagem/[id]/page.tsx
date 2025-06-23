"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface MediaDetail {
  id: number;
  usuario_instagram: string;
  filepath: string;
  date?: string;
  full_address?: string;
}

export default function DetalheImagemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPressingBack, setIsPressingBack] = useState(false);
  const [imagem, setImagem] = useState<MediaDetail | null>(null);

  useEffect(() => {
    async function fetchImagem() {
      try {
        const res = await fetch(`https://denzel-hero-deploy.onrender.com/media/${id}`);
        const data = await res.json();
        setImagem(data);
      } catch (error) {
        console.error("Erro ao carregar imagem:", error);
      }
    }

    fetchImagem();
  }, [id]);

  if (!imagem) {
    return <div className="text-center text-white mt-10">Carregando imagem...</div>;
  }

  return (
    <div className="min-h-screen bg-[#100D1E] text-white pb-12">
      {/* Header */}
      <Image src={"/linhaInferior.svg"} className="w-full" alt="linhainferior" width={200} height={5} />
      <header className="flex justify-between items-center px-4 py-3 border-b border-[#2C2740]">
        <button
          onClick={() => router.back()}
          onPointerDown={() => setIsPressingBack(true)}
          onPointerUp={() => setIsPressingBack(false)}
          onPointerLeave={() => setIsPressingBack(false)}
        >
          <Image
            src={isPressingBack ? "/voltarGradiente.svg" : "/voltar.svg"}
            alt="Voltar"
            width={24}
            height={24}
          />
        </button>

        <Image src="/denzelLogo.svg" alt="Logo" width={66} height={24} />

        <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
        
      </header>
<Image src={"/linhaInferior.svg"} className="w-full" alt="linhainferior" width={200} height={1} />
      {/* Imagem com usuário sobreposto */}
      <div className="relative w-full h-[520px]">
        {/* Usuário sobreposto */}
        <span className="absolute top-3 left-[-10px] bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] px-4 py-1 rounded-r-full rounded-l-none text-white font-bold text-sm z-10 ">

          @{imagem.usuario_instagram}
        </span>

        <Image
          src={imagem.filepath}
          alt={`Imagem ${imagem.id}`}
          fill
          className="object-cover "
        />
      </div>

      {/* Metadados */}
        <Image src={"/linhaInferior.svg"} className="mx-auto mb-10" alt="linhainferior" width={200} height={2} />
      <div className="mt-[40px] px-6 text-center">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] bg-clip-text text-transparent">
          Meta dados da Imagem
        </h2>

        <p className="text-sm mt-2">
          <span className="text-[#9C60DA] font-semibold">Data:</span>{" "}
          {imagem.date ?? "13/06/2025"}
        </p>
        <p className="text-sm mt-1">
          <span className="text-[#9C60DA] font-semibold">Endereço:</span>{" "}
          {imagem.full_address ?? "Sem informação de endereço nos metadados."}
        </p>
      </div>
      <Image src={"/linhaInferior.svg"} className="w-full fixed bottom-0 mt-[80px]" alt="linhainferior" width={200} height={2} />
    </div>
  );
}
