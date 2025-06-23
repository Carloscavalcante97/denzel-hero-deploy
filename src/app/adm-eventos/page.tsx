"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import FilterEvento from "../../components/ui/filterEvento";
import ModalCriarEvento from "../../components/modalCriarEvento";
import ModalConfirmDelete from "../../components/modalDeletarImagem";
import HeaderAdm from "../../components/headerAdm";
import MobileMenuAdm from "../../components/menuAdm";

interface MediaItem {
  evento: string;
  usuario_instagram: string;
  filepath: string;
  highlight: boolean;
  id: number;
}
interface Evento {
  title: string;
  date: string;
}

export default function GaleriaAdmin() {
  const router = useRouter();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [overlayPressedId, setOverlayPressedId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteIds, setToDeleteIds] = useState<number[]>([]);
  const [successDeleteOpen, setSuccessDeleteOpen] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // carrega media + eventos
  const fetchAll = async () => {
    const [mRes, eRes] = await Promise.all([
      fetch("https://denzel-hero-deploy.onrender.com/media"),
      fetch("https://denzel-hero-deploy.onrender.com/eventos"),
    ]);
    setMedia(await mRes.json());
    setEventos(await eRes.json());
  };
  useEffect(() => {
    fetchAll();
  }, []);

  // acordeão e seleção
  const toggleAcordeon = (key: string) => {
    setAbertos((prev) => {
      const nxt = new Set(prev);
      nxt.has(key) ? nxt.delete(key) : nxt.add(key);
      return nxt;
    });
  };
  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) => {
      const nxt = new Set(prev);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      return nxt;
    });
  };
  const toggleTodos = (ids: number[]) => {
    const all = ids.every((i) => selecionados.has(i));
    setSelecionados((prev) => {
      const nxt = new Set(prev);
      ids.forEach((i) => (all ? nxt.delete(i) : nxt.add(i)));
      return nxt;
    });
  };

  // destacar
  const definirDestaque = async () => {
    const ids = Array.from(selecionados);
    if (!ids.length) return;
    await fetch("https://denzel-hero-deploy.onrender.com/media/highlight", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
    setSelecionados(new Set());
    await fetchAll();
  };

  // abrir modal de delete
  const abrirConfirmDelete = () => {
    const ids = Array.from(selecionados);
    if (!ids.length) return;
    setToDeleteIds(ids);
    setConfirmOpen(true);
  };
  // callback após confirmação
  const handleDeleteSuccess = async () => {
    setConfirmOpen(false);
    setSelecionados(new Set());
    setSuccessDeleteOpen(true);
    await fetchAll();
  };

  // agrupamento
  const agrupado = media.reduce((acc, item) => {
    if (!acc[item.evento]) acc[item.evento] = {};
    if (!acc[item.evento][item.usuario_instagram])
      acc[item.evento][item.usuario_instagram] = [];
    acc[item.evento][item.usuario_instagram].push(item);
    return acc;
  }, {} as Record<string, Record<string, MediaItem[]>>);

  return (
    <div className="p-4 bg-[#100D1E] min-h-screen pb-[120px]">
      <header className="fixed top-0 left-0 right-0 w-full bg-[#100D1E] z-50 ">
        <HeaderAdm
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen((prev) => !prev)}
        />
      </header>

      <div className="max-w-6xl mt-4 mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-center">
          <Image
            src="/galeriaUsuarios.svg"
            alt="galeria"
            width={250}
            height={30}
          />
        </div>

        {/* Filtros */}
        <div className="flex justify-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Buscar usuário"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1A172A] border border-[#2C2740] text-white placeholder-white w-full max-w-sm text-center"
          />
          <FilterEvento
            eventoSelecionado={eventoSelecionado}
            onSelect={(ev) => setEventoSelecionado(ev.title)}
          />
        </div>

        {/* Listagem por eventos */}
        {eventos.map((ev) => {
          const imgs = media.filter((m) => m.evento === ev.title);
          const key = ev.title;
          const aberto = abertos.has(key);
          const ids = imgs.map((i) => i.id);
          const all = ids.length > 0 && ids.every((i) => selecionados.has(i));

          return (
            <div key={key}>
              <h2 className="text-center text-lg font-bold mb-4 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-transparent bg-clip-text">
                {ev.title}
              </h2>
              <div
                className={classNames(
                  "rounded-[10px] p-[1px] transition-all duration-300",
                  all
                    ? "bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]"
                    : "border border-[#463C61]"
                )}
              >
                <div
                  className="bg-[#100D1E] rounded-[10px] flex items-center justify-between px-3 py-2 cursor-pointer"
                  onClick={() => toggleAcordeon(key)}
                >
                  <label
                    className={classNames(
                      "flex items-center gap-2 text-white",
                      all
                        ? "bg-clip-text text-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]"
                        : ""
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={all}
                      className="accent-[#9C60DA]"
                      onChange={() => toggleTodos(ids)}
                    />
                    {key}
                  </label>
                  <span className="text-white text-xs">
                    {aberto ? "▲" : "▼"}
                  </span>
                </div>

                {aberto && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center px-2 pb-2">
                    {imgs.length === 0 && (
                      <p className="text-white/50 italic">
                        Sem imagens neste evento
                      </p>
                    )}
                    {imgs.map((img) => (
                      <div
                        key={img.id}
                        className={classNames(
                          "relative w-[90px] sm:w-[120px] h-[113px] sm:h-[140px] rounded overflow-hidden border-2 transition duration-200 group",
                          selecionados.has(img.id)
                            ? "border-[#9C60DA]"
                            : img.highlight
                            ? "border-[#43A3D5]"
                            : "border-transparent"
                        )}
                        onTouchStart={() => setOverlayPressedId(img.id)}
                        onTouchEnd={() => setOverlayPressedId(null)}
                      >
                        {/* botão invisível atrás para navegação */}
                        <button
                          className="absolute inset-0 z-0"
                          onClick={() =>
                            router.push(`/detalhe-imagem/${img.id}`)
                          }
                          aria-label="Ver detalhe"
                          onMouseDown={(e) => e.stopPropagation()}
                        />

                        {/* imagem */}
                        <Image
                          src={img.filepath}
                          alt=""
                          fill
                          className="object-cover pointer-events-none"
                        />

                        {/* overlay */}
                        <div
                          className={classNames(
                            "absolute inset-0 transition-opacity duration-300 z-10 pointer-events-none",
                            overlayPressedId === img.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <Image
                            src="/sobreporImagem.svg"
                            alt=""
                            fill
                            className="object-cover pointer-events-none"
                          />
                        </div>

                        {/* checkbox */}
                        <input
                          type="checkbox"
                          checked={selecionados.has(img.id)}
                          onChange={() => toggleSelecionado(img.id)}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="absolute top-1 left-1 z-20 w-4 h-4 accent-[#9C60DA] pointer-events-auto"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <Image
        src="/linhaDivisoria.svg"
        alt=""
        width={390}
        height={3}
        className="w-full fixed bottom-24"
      />

      {/* Botões fixos */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#100D1E] px-4 py-4 flex justify-center items-center gap-4 z-[9999]">
        <button onClick={() => setModalCriarOpen(true)} className="p-2">
          <Image
            src="/criarEventoBotao.svg"
            alt="Criar Evento"
            width={193}
            height={40}
          />
        </button>
        <button onClick={abrirConfirmDelete} className="p-2">
          <Image src="/excluir.svg" alt="Deletar" width={40} height={40} />
        </button>
        <button onClick={definirDestaque} className="p-2">
          <Image
            src="/atualizar2.svg"
            alt="Destaque"
            width={40}
            height={40}
          />
        </button>
      </div>

      {/* Modal de criar evento */}
      <ModalCriarEvento
        open={modalCriarOpen}
        onClose={() => setModalCriarOpen(false)}
        onSuccessRefresh={fetchAll}
      />

      {/* Modal de confirmação de delete */}
      <ModalConfirmDelete
        open={confirmOpen}
        ids={toDeleteIds}
        onCancel={() => setConfirmOpen(false)}
        onSuccessRefresh={handleDeleteSuccess}
      />

      <MobileMenuAdm
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}
