"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import FilterEvento from "../../components/ui/filterEvento";

interface MediaItem {
  evento: string;
  usuario_instagram: string;
  filepath: string;
  highlight: boolean;
  id: number;
}

export default function GaleriaAdmin() {
  const router = useRouter();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [isPressingUpdate, setIsPressingUpdate] = useState(false);
  const [isPressingDelete, setIsPressingDelete] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media");
      const data = await res.json();
      setMedia(data);
    }
    fetchMedia();
  }, []);

  const toggleAcordeon = (chave: string) => {
    setAbertos((prev) => {
      const novo = new Set(prev);
      novo.has(chave) ? novo.delete(chave) : novo.add(chave);
      return novo;
    });
  };

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  };

  const toggleTodosDoUsuario = (ids: number[]) => {
    const todosSelecionados = ids.every((id) => selecionados.has(id));
    setSelecionados((prev) => {
      const novo = new Set(prev);
      ids.forEach((id) => {
        todosSelecionados ? novo.delete(id) : novo.add(id);
      });
      return novo;
    });
  };

  const deletarSelecionados = async () => {
    const idsSelecionados = Array.from(selecionados);
    if (idsSelecionados.length === 0) return;

    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsSelecionados }),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Erro ao deletar:", result.error || result);
        return;
      }

      setMedia((prev) => prev.filter((m) => !idsSelecionados.includes(m.id)));
      setSelecionados(new Set());
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const definirDestaque = async () => {
    const idsSelecionados = Array.from(selecionados);
    if (idsSelecionados.length === 0) return;

    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/media/highlight", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsSelecionados }),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Erro ao atualizar destaque:", result.error || result);
        return;
      }

      setMedia((prev) =>
        prev.map((m) =>
          idsSelecionados.includes(m.id) ? { ...m, highlight: true } : m
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar destaque:", error);
    }
  };

  const agrupadoPorEvento = media.reduce((acc, item) => {
    if (!acc[item.evento]) acc[item.evento] = {};
    if (!acc[item.evento][item.usuario_instagram])
      acc[item.evento][item.usuario_instagram] = [];
    acc[item.evento][item.usuario_instagram].push(item);
    return acc;
  }, {} as Record<string, Record<string, MediaItem[]>>);

  return (
    <div className="p-4 space-y-6 bg-[#100D1E] min-h-screen pb-[80px]">
      <div className="flex justify-center">
        <Image src="/galeriaUsuarios.svg" alt="galeria" width={250} height={30} />
      </div>

      <div className="flex justify-center my-2">
        <input
          type="text"
          placeholder="Buscar usuário"
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#1A172A] border border-[#2C2740] text-white placeholder:text-white w-full max-w-md text-center"
        />
      </div>

      <div className="flex justify-center">
       <FilterEvento
  eventoSelecionado={eventoSelecionado}
  onSelect={(evento) => setEventoSelecionado(evento.title)}
/>
      </div>

      {Object.entries(agrupadoPorEvento)
        .filter(([evento]) => !eventoSelecionado || evento === eventoSelecionado)
        .map(([evento, usuarios]) => (
          <div key={evento}>
            <h2 className="text-center text-lg font-bold mb-4 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-transparent bg-clip-text">
              {evento}
            </h2>

            {Object.entries(usuarios)
              .filter(([usuario]) =>
                usuario.toLowerCase().includes(filtroUsuario.toLowerCase())
              )
              .map(([usuario, imagens]) => {
                const ids = imagens.map((img) => img.id);
                const todosSelecionados = ids.every((id) => selecionados.has(id));
                const chaveUnica = `${evento}::${usuario}`;
                const aberto = abertos.has(chaveUnica);

                return (
                  <div key={chaveUnica} className="mb-3">
                    <div
                      className={classNames(
                        "rounded-[10px] transition-all duration-300",
                        todosSelecionados
                          ? "border-[2px] border-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] p-[1px]"
                          : "border border-[#463C61] p-[1px]"
                      )}
                    >
                      <div className="bg-[#100D1E] rounded-[10px]">
                        <div
                          className="flex items-center justify-between px-3 py-[6px] cursor-pointer"
                          onClick={() => toggleAcordeon(chaveUnica)}
                        >
                          <label
                            className={classNames(
                              "flex items-center gap-2 text-sm font-medium",
                              todosSelecionados
                                ? "bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] bg-clip-text text-transparent"
                                : "text-white"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={todosSelecionados}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleTodosDoUsuario(ids);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-[#9C60DA]"
                            />
                            @{usuario}
                          </label>
                          <span className="text-white text-xs">
                            {aberto ? "▲" : "▼"}
                          </span>
                        </div>

                        {aberto && (
                          <div className="flex flex-wrap gap-2 mt-3 justify-start px-2 pb-2">
                            {imagens.map((img) => (
                              <div
                                key={img.id}
                                className={classNames(
                                  "relative w-[90px] h-[113px] rounded overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                                  selecionados.has(img.id)
                                    ? "border-[#9C60DA]"
                                    : img.highlight
                                    ? "border-[#43A3D5]"
                                    : "border-transparent"
                                )}
                                onClick={() =>
                                  window.innerWidth < 768
                                    ? router.push(`/detalhe-imagem/${img.id}`)
                                    : null
                                }
                              >
                                <Image
                                  src={img.filepath}
                                  alt={`img-${img.id}`}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition duration-300 z-10">
                                  <Image
                                    src="/sobreporImagem.svg"
                                    alt="overlay"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selecionados.has(img.id)}
                                  onChange={() => toggleSelecionado(img.id)}
                                  onClick={(e) => e.stopPropagation()}
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

      <Image
        src="/linhaDivisoria.svg"
        alt="linha inferior"
        width={1000}
        height={1}
        className="w-full fixed bottom-14"
      />
      <div className="fixed bottom-0 left-0 right-0 bg-[#100D1E] px-4 py-4 z-[9999]">
        <div className="flex justify-center items-center gap-4">
          <button
            type="button"
            onClick={definirDestaque}
            onPointerDown={() => setIsPressingUpdate(true)}
            onPointerUp={() => setIsPressingUpdate(false)}
            onPointerLeave={() => setIsPressingUpdate(false)}
            className="relative flex items-center justify-center w-[240px] h-[48px] rounded-full hover:opacity-90 transition"
          >
            <Image
              src={
                isPressingUpdate
                  ? "/atualizarGradiente.svg"
                  : "/atualizar.svg"
              }
              alt="atualizar"
              width={160}
              height={32}
              className="pointer-events-none"
            />
          </button>

          <button
            type="button"
            onClick={deletarSelecionados}
            onPointerDown={() => setIsPressingDelete(true)}
            onPointerUp={() => setIsPressingDelete(false)}
            onPointerLeave={() => setIsPressingDelete(false)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-[#1a1a2a] transition"
          >
            <Image
              src={
                isPressingDelete
                  ? "/excluirGradiente.svg"
                  : "/excluir.svg"
              }
              alt="lixeira"
              width={30}
              height={30}
              className="pointer-events-none"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
