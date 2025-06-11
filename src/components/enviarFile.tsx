// components/EnviarFile.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import EscolherFesta from "./ui/definirEvento";
import SuccessModal from "./modalSucesso";
import ModalUso from "./modalRegras";

export default function EnviarFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [usuarioInstagram, setUsuarioInstagram] = useState("");
  const [resposta, setResposta] = useState<string | null>(null);
  const [selectedEvento, setSelectedEvento] = useState<evento | null>(null);
  const [enviandoAtivo, setEnviandoAtivo] = useState(false);
  const [modal, setModal] = useState(false);
  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const total = [...files, ...selected];
    if (total.length > 15) {
      alert("Máx. 15 imagens. Remova algumas.");
      return;
    }
    setFiles(total);
    setPreviewUrls((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removerImagem = (i: number) => {
    setFiles((f) => f.filter((_, idx) => idx !== i));
    setPreviewUrls((u) => u.filter((_, idx) => idx !== i));
  };

  const enviarImagens = async () => {
    if (!usuarioInstagram || files.length === 0) {
      alert("Informe @ e selecione ao menos 1 imagem.");
      return;
    }
    if (!selectedEvento) {
      alert("Escolha uma festa.");
      return;
    }
    const formData = new FormData();
    files.forEach((f, i) => formData.append(`file${i + 1}`, f));
    formData.append(
      "data",
      JSON.stringify({
        usuario_instagram: usuarioInstagram,
        evento: selectedEvento.title,
      })
    );
    try {
      const res = await fetch(
        "https://denzel-hero-backend.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await res.json();
      setResposta(JSON.stringify(json, null, 2));
      if (!res.ok) alert(`Erro: ${json.error}`);
      setModal(true);
    } catch {
      alert("Erro de rede ao enviar.");
    }
  };

  return (
    <div className="max-w-md px-4 py-6">
      <div className="mx-auto  max-w-md p-1 rounded-2xl bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]">
        <div className="bg-[#100D1E] rounded-2xl p-6 sm:p-12">
          {/* Título */}
          <div className="flex justify-center mb-6 relative bottom-15">
            <Image
              src="/compartilhe.svg"
              alt="Compartilhe"
              width={156}
              height={71}
            />
          </div>

          {/* @ do Instagram */}
          <input
            type="text"
            placeholder="Digite aqui seu @"
            className="block w-full mx-auto h-10 mb-4 px-4 bg-transparent border border-white/30 text-white text-sm rounded focus:outline-none"
            value={usuarioInstagram}
            onChange={(e) => setUsuarioInstagram(e.target.value)}
          />

          {/* Escolher Festa */}

          <EscolherFesta onSelect={setSelectedEvento} />

          {/* Botões de anexar */}
          <div className="flex flex-row items-center justify-between gap-4 mb-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Image
                src="/anexarImagem.svg"
                alt="Anexar"
                width={230}
                height={40}
              />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <label htmlFor="camera-upload" className="cursor-pointer ">
              <div className=" flex items-center justify-start">
                <Image src="/camera.svg" alt="Câmera" width={32} height={32} />
              </div>
              <input
                id="camera-upload"
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Termos */}
          <div className="flex items-center text-white text-sm mb-4">
            <input type="checkbox" id="aceite" className="mr-2" />
            <label htmlFor="aceite">
              Eu aceito as{" "}
              <span
                onClick={() => setMostrarRegras(true)}
                className="underline cursor-pointer text-white font-bold"
              >
                Regras
              </span>{" "}
              e{" "}
              <span
                onClick={() => setMostrarTermos(true)}
                className="underline cursor-pointer text-white font-bold"
              >
                Termos de Uso
              </span>
            </label>
          </div>

          {/* Prévia */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative w-full aspect-square">
                <Image
                  fill
                  src={url}
                  alt={`Preview ${i + 1}`}
                  className="object-cover rounded"
                />
                <button
                  onClick={() => removerImagem(i)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Enviar */}
          <button
            onMouseDown={() => setEnviandoAtivo(true)}
            onMouseUp={() => setEnviandoAtivo(false)}
            onMouseLeave={() => setEnviandoAtivo(false)}
            onTouchStart={() => setEnviandoAtivo(true)}
            onTouchEnd={() => setEnviandoAtivo(false)}
            onClick={enviarImagens}
            className="w-full flex justify-center mt-2"
          >
            <Image
              src={
                enviandoAtivo ? "/enviarAnexoGradient.svg" : "/enviarAnexo.svg"
              }
              alt="Enviar"
              width={174}
              height={40}
            />
          </button>
        </div>
      </div>
      <SuccessModal open={modal} onClose={() => setModal(false)} />
      {mostrarRegras && (
        <ModalUso
          titulo="REGRAS"
          subtitulo="de uso"
          texto="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco."
          icone="/regrasDeUso.svg"
          onClose={() => setMostrarRegras(false)}
        />
      )}

      {mostrarTermos && (
        <ModalUso
          titulo="TERMOS"
          subtitulo="de uso"
          texto="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco."
          icone="/termosDeUso.svg"
          onClose={() => setMostrarTermos(false)}
        />
      )}
    </div>
  );
}
