// src/app/quem-somos/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import ModalConfirmDeleteDenzel from "../../components/modalConfirmeDeleteDenzel";
import HeaderAdm from "@/components/headerAdm";
import MobileMenuAdm from "@/components/menuAdm";

interface QuemSomosItem {
  id: number;
  image_path: string;
}

export default function QuemSomosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<QuemSomosItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [overlayPressed, setOverlayPressed] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const load = async () => {
    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/denzelmedia", {
        credentials: "include"
      });
      const data: QuemSomosItem[] = await res.json();
      setItems(data);
      setSelected(new Set());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleOne = (id: number) => {
    setSelected(prev => {
      const nxt = new Set(prev);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      return nxt;
    });
  };

  const handleDeleteSuccess = () => {
    setConfirmOpen(false);
    load();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append(file.name, file);
    });

    setUploading(true);
    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/denzelmedia", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Erro ao enviar imagem:", result);
      } else {
        await load();
      }
    } catch (err) {
      console.error("Erro no upload:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#100D1E] p-4 pb-32">
      <header className="fixed top-0 left-0 right-0 w-full bg-[#100D1E] z-50">
        <HeaderAdm menuOpen={menuOpen} onMenuClick={() => setMenuOpen(prev => !prev)} />
      </header>

      <Image src={"/quemSomos.svg"} alt="Quem Somos" width={132} height={30} className="mb-4" />

      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map(item => (
          <div
            key={item.id}
            className="relative w-full aspect-square rounded overflow-hidden border-2 border-transparent cursor-pointer group"
            onTouchStart={() => setOverlayPressed(item.id)}
            onTouchEnd={() => setOverlayPressed(null)}
          >
            <Image
              src={item.image_path}
              alt={`Imagem ${item.id}`}
              onClick={() => router.push(`/detalhe-imagem/${item.id}`)}
              fill
              style={{ objectFit: 'contain' }}
              className="bg-black/10"
            />
            <input
              type="checkbox"
              checked={selected.has(item.id)}
              onChange={e => {
                e.stopPropagation();
                toggleOne(item.id);
              }}
              className="absolute top-1 left-1 z-20 w-5 h-5 accent-[#9C60DA]"
            />
          </div>
        ))}
      </div>

      {/* Botões fixos */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#100D1E] px-4 py-4 flex justify-center gap-4 z-50 border-t border-[#463C61]">
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Image
            src="/anexarImagemDenzel.svg"
            alt="Adicionar Imagem"
            width={197}
            height={40}
            className="p-2"
          />
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="p-2"
          disabled={selected.size === 0}
        >
          <Image src="/excluir.svg" alt="Deletar" width={40} height={40} />
        </button>
      </div>

      {/* Input oculto para envio de arquivos */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        hidden
      />

      <ModalConfirmDeleteDenzel
        open={confirmOpen}
        ids={Array.from(selected)}
        onCancel={() => setConfirmOpen(false)}
        onSuccessRefresh={handleDeleteSuccess}
      />
      <MobileMenuAdm open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
