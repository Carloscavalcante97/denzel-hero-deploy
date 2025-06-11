"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import ModalCriarEvento from "@/components/modalCriarEvento";

interface MediaItem {
  evento: string;
  usuario_instagram: string;
  filepath: string;
  highlight: boolean;
  id: number;
}

function ImagemCard({
  img,
  selecionado,
  onSelecionar,
  onAbrirDetalhe,
}: {
  img: MediaItem;
  selecionado: boolean;
  onSelecionar: () => void;
  onAbrirDetalhe: () => void;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={classNames(
        "relative w-[90px] sm:w-[120px] h-[113px] sm:h-[140px] rounded overflow-hidden border-2 transition-all duration-200 cursor-pointer",
        selecionado
          ? "border-[#9C60DA]"
          : img.highlight
          ? "border-[#43A3D5]"
          : "border-transparent"
      )}
      onClick={onAbrirDetalhe}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      <Image
        src={img.filepath}
        alt={`img-${img.id}`}
        fill
        className="object-cover"
      />
      <div
        className={classNames(
          "absolute top-0 left-0 w-full h-full transition duration-300 z-10",
          isPressed ? "opacity-100" : "opacity-0 hover:opacity-100"
        )}
      >
        <Image
          src="/sobreporImagem.svg"
          alt="overlay"
          fill
          className="object-cover"
        />
      </div>
      <input
        type="checkbox"
        checked={selecionado}
        onChange={onSelecionar}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1 left-1 z-20 w-4 h-4 accent-[#9C60DA]"
      />
    </div>
  );
}

export default function AdmEvento() {
  const router = useRouter();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [filtroEvento, setFiltroEvento] = useState("");
  const [isPressingUpdate, setIsPressingUpdate] = useState(false);
  const [isPressingDelete, setIsPressingDelete] = useState(false);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  // fetch media list
  const fetchMedia = async () => {
    const res = await fetch("https://denzel-hero-backend.onrender.com/media");
    const data: MediaItem[] = await res.json();
    setMedia(data);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const toggleAcordeon = (evento: string) => {
    setAbertos(prev => {
      const novo = new Set(prev);
      novo.has(evento) ? novo.delete(evento) : novo.add(evento);
      return novo;
    });
  };

  const toggleSelecionado = (id: number) => {
    setSelecionados(prev => {
      const novo = new Set(prev);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  };

  const toggleTodosDoEvento = (ids: number[]) => {
    const all = ids.every(id => selecionados.has(id));
    setSelecionados(prev => {
      const novo = new Set(prev);
      ids.forEach(id => (all ? novo.delete(id) : novo.add(id)));
      return novo;
    });
  };

  

  const deletarSelecionados = async () => {
    const ids = Array.from(selecionados);
    if (!ids.length) return;
    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      setSelecionados(new Set());
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar imagens");
    }
  };

  const definirDestaque = async () => {
    const ids = Array.from(selecionados);
    if (!ids.length) return;
    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media/highlight", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Erro ao destacar");
      setSelecionados(new Set());
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert("Erro ao definir destaque");
    }
  };

  const agrupadoPorEvento = media.reduce((acc, item) => {
    if (!acc[item.evento]) acc[item.evento] = [];
    acc[item.evento].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);
  
  const recarregarMedia = () => fetchMedia();

  return (
    <div className="p-4 bg-[#100D1E] min-h-screen pb-[120px]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-center">
          <Image src="/galeriaEventos.svg" alt="galeria" width={269} height={30} />
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Buscar evento"
            value={filtroEvento}
            onChange={e => setFiltroEvento(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1A172A] border border-[#2C2740] text-white placeholder-white w-full max-w-md text-center"
          />
        </div>

        {Object.entries(agrupadoPorEvento)
          .filter(([evt]) => evt.toLowerCase().includes(filtroEvento.toLowerCase()))
          .map(([evt, imgs]) => {
            const aberto = abertos.has(evt);
            const ids = imgs.map(i => i.id);
            const allSel = ids.every(id => selecionados.has(id));
            return (
              <div key={evt}>
                <h2 className="text-center text-lg font-bold mb-4 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-transparent bg-clip-text">
                  {evt}
                </h2>
                <div
                  className={classNames(
                    "rounded-[10px] transition-all duration-300",
                    allSel
                      ? "border-[2px] border-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] p-[1px]"
                      : "border border-[#463C61] p-[1px]"
                  )}
                >
                  <div className="bg-[#100D1E] rounded-[10px]">
                    <div
                      className="flex items-center justify-between px-3 py-[6px] cursor-pointer"
                      onClick={() => toggleAcordeon(evt)}
                    >
                      <label
                        className={classNames(
                          "flex items-center gap-2 text-sm font-medium",
                          allSel
                            ? "bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] bg-clip-text text-transparent"
                            : "text-white"
                        )}
                        onClick={e => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={allSel}
                          onChange={e => {
                            e.stopPropagation(); toggleTodosDoEvento(ids);
                          }}
                          className="accent-[#9C60DA]"
                        />
                        {evt}
                      </label>
                      <span className="text-white text-xs">{aberto ? "▲" : "▼"}</span>
                    </div>

                    {aberto && (
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start px-2 pb-2">
                        {imgs.map(img => (
                          <ImagemCard
                            key={img.id}
                            img={img}
                            selecionado={selecionados.has(img.id)}
                            onSelecionar={() => toggleSelecionado(img.id)}
                            onAbrirDetalhe={() => router.push(`/detalhe-imagem/${img.id}`)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* footer actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#100D1E] px-4 py-4 flex justify-center items-center gap-4 z-50">
        <button
          onClick={() => setModalCriarOpen(true)}
          className="px-6 py-2  text-white"
        >
          <Image src="/criarEventoBotao.svg" alt="Criar Evento" width={193} height={40} />
        </button>
        <button
          onClick={deletarSelecionados}
          className="p-1 "
        >
          <Image src="/excluir.svg" alt="Deletar" width={40} height={40} />
        </button>
        <button
          onClick={definirDestaque}
          
        >
          <Image src="/atualizar2.svg" alt="Destaque" width={40} height={40} />
        </button>
      </div>
       <ModalCriarEvento
        open={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onSuccess={recarregarMedia}
      />
    </div>
  );
}
