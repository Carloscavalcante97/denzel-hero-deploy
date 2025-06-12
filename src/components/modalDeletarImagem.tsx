// components/ui/ModalConfirmDelete.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SuccessDeleteModal from "./modalSucessoDelete";

interface ModalConfirmDeleteProps {
  open: boolean;
  ids: number[];
  onCancel: () => void;
  onSuccessRefresh: () => void;
}

export default function ModalConfirmDelete({
  open,
  ids,
  onCancel,
  onSuccessRefresh,
}: ModalConfirmDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // limpa estado de erro / success quando reabre
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccessOpen(false);
    }
  }, [open]);

  // se nem confirm nem success devem estar visíveis, nada é renderizado
  if (!open && !successOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao excluir");
      }
      onSuccessRefresh();       // recarrega lista no pai
      setSuccessOpen(true);     // abre o modal de sucesso
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha ao excluir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* só o diálogo de confirmação quando open for true */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-[#1A172A] rounded-xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]" />
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image src="/warning.svg" alt="Atenção" width={274} height={163} />
              </div>
              
              {error && <p className="text-red-400 mb-2">{error}</p>}
              <div className="flex justify-between gap-4">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1  text-white hover:bg-white/10 transition"
                >
                  <Image
                    src="/cancelar.svg"
                    alt="Cancelar"
                    width={134}
                    height={40}
                    className="inline-block mr-2"
                  />
                 
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1  text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  
                    <>
                      <Image
                        src="/excluirDoModal.svg"
                        alt="Excluir"
                        width={133}
                        height={40}
                        className="inline-block mr-2"
                      />
                    
                    </>
                  
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* o modal de sucesso fica sempre montado enquanto successOpen for true */}
      <SuccessDeleteModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          onCancel();
        }}
      />
    </>
  );
}
