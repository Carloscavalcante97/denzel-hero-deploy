"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";

interface MediaItem {
  evento: string;
  usuario_instagram: string;
  filepath: string;
  highlight: boolean;
  id: number;
}

export default function GaleriaAdmin() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [filtroUsuario, setFiltroUsuario] = useState("");

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
      if (novo.has(chave)) novo.delete(chave);
      else novo.add(chave);
      return novo;
    });
  };

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  };

  const aoSelecionarTodosDoUsuario = (idsSelecionados: number[]) => {
    console.log("Imagens marcadas do usuário:", idsSelecionados);
  };

  const toggleTodosDoUsuario = (ids: number[]) => {
    const todosSelecionados = ids.every((id) => selecionados.has(id));
    setSelecionados((prev) => {
      const novo = new Set(prev);
      ids.forEach((id) => {
        if (todosSelecionados) novo.delete(id);
        else novo.add(id);
      });
      // Notifica com os IDs após atualizar
      const resultado = todosSelecionados
        ? Array.from(
            new Set(Array.from(prev).filter((id) => !ids.includes(id)))
          )
        : Array.from(new Set([...prev, ...ids]));
      aoSelecionarTodosDoUsuario(resultado);
      return novo;
    });
  };

  const agrupadoPorEvento = media.reduce((acc, item) => {
    if (!acc[item.evento]) acc[item.evento] = {};
    if (!acc[item.evento][item.usuario_instagram])
      acc[item.evento][item.usuario_instagram] = [];
    acc[item.evento][item.usuario_instagram].push(item);
    return acc;
  }, {} as Record<string, Record<string, MediaItem[]>>);

  const idsSelecionados = Array.from(selecionados);
  
  const deletarSelecionados = async () => {
  if (idsSelecionados.length === 0) return;

  try {
    const res = await fetch("https://denzel-hero-backend.onrender.com/media", {
      method: "DELETE",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json"
      },
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

  return (
    <div className="p-4 space-y-6 bg-[#100D1E] min-h-screen">
      <div className="flex justify-center">
        <Image
          src="/galeriaUsuarios.svg"
          alt="galeria"
          width={250}
          height={30}
        />
      </div>
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Buscar usuário"
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#1A172A] border border-[#2C2740] text-white placeholder:text-white w-full max-w-md text-center"
        />
      </div>

      {Object.entries(agrupadoPorEvento).map(([evento, usuarios]) => (
        <div key={evento}>
          <h2 className="text-center text-lg font-bold mb-4 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] text-transparent bg-clip-text ">
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
                      "rounded-[10px] p-[1px] transition-all duration-300 border border-[#463C61]",
                      todosSelecionados
                        ? "bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]"
                        : "bg-transparent"
                    )}
                  >
                    <div
                      className="flex items-center justify-between px-3 py-[6px] bg-[#100D1E] rounded-[10px] cursor-pointer"
                      onClick={() => toggleAcordeon(chaveUnica)}
                    >
                      <label className="flex items-center gap-2 text-white text-sm font-medium">
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
                  </div>

                  {aberto && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                      {imagens.map((img) => (
                        <label
                          key={img.id}
                          className={classNames(
                            "w-[90px] h-[113px] relative rounded overflow-hidden border-2 cursor-pointer",
                            selecionados.has(img.id)
                              ? "border-[#9C60DA]"
                              : img.highlight
                              ? "border-[#43A3D5]"
                              : "border-transparent"
                          )}
                        >
                          <input
                            type="checkbox"
                            className="absolute top-1 left-1 z-10 w-4 h-4"
                            checked={selecionados.has(img.id)}
                            onChange={() => toggleSelecionado(img.id)}
                          />
                          <Image
                            src={img.filepath}
                            alt={`img-${img.id}`}
                            fill
                            className="object-cover"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    <div className="fixed bottom-0 w-full bg-[#100D1E] border-t border-[#463C61] px-4 py-4 z-50">
  <div className="flex justify-center items-center gap-4">
    {/* Botão Atualizar */}
    <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-transparent hover:opacity-90 transition">
      <Image
        src="/atualizar.svg"
        alt="atualizar"
        width={195}
        height={40}
      />
    </button>

    {/* Botão Lixeira */}
    <button
  onClick={deletarSelecionados}
  className="w-10 h-10 flex items-center justify-center rounded-full text-[#43A3D5] hover:bg-[#1a1a2a] transition"
>
  <Image src="/excluir.svg" alt="lixeira" width={40} height={40} />
</button>

  </div>
</div>

    </div>
  );
}
