"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import FilterEvento from "../../components/ui/filterEvento";
import ModalConfirmDelete from "@/components/modalDeletarImagem";
import HeaderAdm from "@/components/headerAdm";
import MobileMenuAdm from "@/components/menuAdm";


interface MediaItem {
  evento: string;
  usuario_instagram: string;
  filepath: string;
  highlight: boolean;
  id: number;
}

export default function GaleriaAdmin() {
  const router = useRouter();

  // dados e seleção
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [overlayPressedId, setOverlayPressedId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState<number[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  // busca inicial
  const fetchMedia = async () => {
    const res = await fetch("https://denzel-hero-deploy.onrender.com/media");
    const data: MediaItem[] = await res.json();
    setMedia(data);
  };
  useEffect(() => {
    fetchMedia();
  }, []);

  // acordeão
  const toggleAcordeon = (key: string) => {
    setAbertos(prev => {
      const nxt = new Set(prev);
      nxt.has(key) ? nxt.delete(key) : nxt.add(key);
      return nxt;
    });
  };

  // seleção individual e em lote
  const toggleSelecionado = (id: number) => {
    setSelecionados(prev => {
      const nxt = new Set(prev);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      return nxt;
    });
  };
  const toggleTodosDoUsuario = (ids: number[]) => {
    const all = ids.every(i => selecionados.has(i));
    setSelecionados(prev => {
      const nxt = new Set(prev);
      ids.forEach(i => (all ? nxt.delete(i) : nxt.add(i)));
      return nxt;
    });
  };

  // abre o modal de delete
  const openDeleteModal = () => {
    const ids = Array.from(selecionados);
    if (!ids.length) return;
    setToDeleteIds(ids);
    setConfirmOpen(true);
  };

  // após confirmação no modal, recarrega a lista
  const handleDeleteSuccess = async () => {
    setConfirmOpen(false);
    setSelecionados(new Set());
    await fetchMedia();
  };

  
  const definirDestaque = async () => {
    const ids = Array.from(selecionados);
    if (!ids.length) return;
    await fetch("https://denzel-hero-deploy.onrender.com/media/highlight", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ ids }),
    });
    setSelecionados(new Set());
    await fetchMedia();
  };

  // agrupa por evento
  const agrupado = media.reduce((acc, item) => {
    if (!acc[item.evento]) acc[item.evento] = {};
    if (!acc[item.evento][item.usuario_instagram]) acc[item.evento][item.usuario_instagram] = [];
    acc[item.evento][item.usuario_instagram].push(item);
    return acc;
  }, {} as Record<string, Record<string, MediaItem[]>>);

  return (
    <div className="p-4 bg-[#100D1E] min-h-screen pb-[90px]">
      <header className="fixed top-0 left-0 right-0 w-full bg-[#100D1E] z-50">
        <HeaderAdm
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen(prev => !prev)}
        />
      </header>
      <div className="max-w-6xl mt-4 mx-auto space-y-6">
        
        <div className="flex justify-center">
          <Image src="/galeriaUsuarios.svg" alt="galeria" width={250} height={30} />
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Buscar usuário"
            value={filtroUsuario}
            onChange={e => setFiltroUsuario(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1A172A] border border-[#2C2740] text-white placeholder-white w-full max-w-sm text-center"
          />
          <FilterEvento
            eventoSelecionado={eventoSelecionado}
            onSelect={ev => setEventoSelecionado(ev.title)}
          />
        </div>

        {Object.entries(agrupado)
          .filter(([evt]) => !eventoSelecionado || evt === eventoSelecionado)
          .map(([evt, users]) => (
            <div key={evt}>
              <h2 className="text-center text-lg font-bold mb-4 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-transparent bg-clip-text">
                {evt}
              </h2>
              {Object.entries(users)
                .filter(([usr]) => usr.toLowerCase().includes(filtroUsuario.toLowerCase()))
                .map(([usr, imgs]) => {
                  const ids = imgs.map(i => i.id);
                  const all = ids.every(i => selecionados.has(i));
                  const key = `${evt}::${usr}`;
                  const aberto = abertos.has(key);
                  return (
                    <div key={key} className="mb-3">
                      <div className={classNames(
                        "rounded-[10px] transition-all duration-300",
                        all
                          ? "border-[2px] border-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] p-[1px]"
                          : "border border-[#463C61] p-[1px]"
                      )}>
                        <div className="bg-[#100D1E] rounded-[10px]">
                          <div
  className="flex items-center justify-between px-4 py-[6px] cursor-pointer w-full max-w-sm mx-auto"
  onClick={() => toggleAcordeon(key)}
>
  {/* Checkbox à esquerda */}
  <input
    type="checkbox"
    checked={all}
    onChange={(e) => {
      e.stopPropagation();
      toggleTodosDoUsuario(ids);
    }}
    onClick={(e) => e.stopPropagation()}
    className="accent-[#9C60DA] mr-2"
  />

  {/* Nome centralizado */}
  <div className="flex-1 text-center">
    <span
      className={classNames(
        "text-sm font-medium",
        all
          ? "bg-clip-text text-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]"
          : "text-white"
      )}
    >
      @{usr}
    </span>
  </div>

  {/* Seta à direita */}
  <span className="text-white text-xs">{aberto ? "▲" : "▼"}</span>
</div>




                          {aberto && (
                            <div className="flex flex-wrap gap-2 mt-3 justify-start sm:justify-start px-2 pb-2">
                              {imgs.map(img => (
                                <div
                                  key={img.id}
                                  className={classNames(
                                    "relative w-[90px] sm:w-[120px] h-[113px] sm:h-[140px] rounded overflow-hidden border-2 transition duration-200 cursor-pointer group",
                                    selecionados.has(img.id)
                                      ? "border-[#9C60DA]"
                                      : img.highlight
                                        ? "border-[#43A3D5]"
                                        : "border-transparent"
                                  )}
                                  onClick={() => router.push(`/detalhe-imagem/${img.id}`)}
                                  onTouchStart={() => setOverlayPressedId(img.id)}
                                  onTouchEnd={() => setOverlayPressedId(null)}
                                >
                                  <Image src={img.filepath} alt="" fill className="object-cover" />
                                  <div className={classNames(
                                    "absolute inset-0 transition-opacity duration-300 z-10",
                                    overlayPressedId === img.id
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  )}>
                                    <Image src="/sobreporImagem.svg" alt="" fill className="object-cover" />
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={selecionados.has(img.id)}
                                    onChange={() => toggleSelecionado(img.id)}
                                    onClick={e => e.stopPropagation()}
                                    className="absolute top-1 left-1 z-20 w-4 h-4 accent-[#9C60DA]"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
      </div>

      <Image
        src="/linhaDivisoria.svg"
        alt=""
        width={390}
        height={3}
        className="w-full fixed bottom-22"
      />

      <div className="fixed bottom-0 left-0 right-0 bg-[#100D1E] px-4 py-4 flex justify-center items-center gap-4 z-[9999]">
        <button
          onClick={definirDestaque}
          className="p-2 "
        >
          <Image src="/atualizar.svg" alt="Destaque" width={195} height={40} />
        </button>
        <button
          onClick={openDeleteModal}
          className="p-2 "
        >
          <Image src="/excluir.svg" alt="Deletar" width={40} height={40} />
        </button>
      </div>

      <ModalConfirmDelete
        open={confirmOpen}
        ids={toDeleteIds}
        onCancel={() => setConfirmOpen(false)}
        onSuccessRefresh={handleDeleteSuccess}
      />
    <MobileMenuAdm open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
