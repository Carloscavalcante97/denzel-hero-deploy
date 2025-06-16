"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import EscolherFesta from "./ui/definirEvento";
import SuccessModal from "./modalSucesso";
import ModalUso from "./modalRegras";

export default function EnviarFile() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [usuarioInstagram, setUsuarioInstagram] = useState("");
  const [selectedEvento, setSelectedEvento] = useState<evento | null>(null);

  const [termosAceitos, setTermosAceitos] = useState(false);
  const [erroInstagram, setErroInstagram] = useState(false);
  const [erroImagens, setErroImagens] = useState(false);
  const [erroTermos, setErroTermos] = useState(false);

  const [mostrarRegras, setMostrarRegras] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [enviandoAtivo, setEnviandoAtivo] = useState(false);

  // for forcing EscolherFesta to reset
  const [childKey, setChildKey] = useState(0);

  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const total = [...files, ...selected];
    if (total.length > 15) {
      alert("Máx. 15 imagens. Remova algumas.");
      return;
    }
    setFiles(total);
    setPreviewUrls(prev => [
      ...prev,
      ...selected.map(f => URL.createObjectURL(f)),
    ]);
  };

  const removerImagem = (i: number) => {
    setFiles(f => f.filter((_, idx) => idx !== i));
    setPreviewUrls(u => u.filter((_, idx) => idx !== i));
  };

  const limparTudo = () => {
    setFiles([]);
    setPreviewUrls([]);
    setUsuarioInstagram("");
    setSelectedEvento(null);
    setTermosAceitos(false);
    if (checkboxRef.current) checkboxRef.current.checked = false;
    setErroInstagram(false);
    setErroImagens(false);
    setErroTermos(false);
    setChildKey(k => k + 1);
  };

  const enviarImagens = async () => {
    // validação
    const instaOK = !!usuarioInstagram.trim();
    const imgsOK = files.length > 0;
    const termosOK = termosAceitos;
    const eventoOK = !!selectedEvento;
    setErroInstagram(!instaOK);
    setErroImagens(!imgsOK);
    setErroTermos(!termosOK);
    if (!instaOK || !imgsOK || !termosOK || !eventoOK) return;

    setEnviando(true);
    try {
      const formData = new FormData();
      files.forEach((f, i) => formData.append(`file${i+1}`, f));
      formData.append("data", JSON.stringify({
        usuario_instagram: usuarioInstagram,
        evento: selectedEvento!.title,
      }));

      const res = await fetch("https://denzel-hero-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        alert(`Erro: ${json.error}`);
      } else {
        setModalSucesso(true);
        limparTudo();
      }
    } catch {
      alert("Erro de rede ao enviar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      <div className="w-full p-[2px] rounded-2xl bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]">
        <div className="bg-[#100D1E] rounded-2xl p-6 sm:p-10">
          <div className="flex justify-center mb-6">
            <Image src="/compartilhe.svg" alt="Compartilhe" width={156} height={71} className="relative bottom-18" />
          </div>

          {/* @ Instagram */}
          {erroInstagram && <p className="text-red-400 text-sm mb-1">Informe seu @</p>}
          <input
            type="text"
            placeholder="Digite aqui seu @"
            value={usuarioInstagram}
            onChange={e => setUsuarioInstagram(e.target.value)}
            className="w-full h-10 mb-4 px-4 bg-transparent border border-white/30 text-white text-sm rounded focus:outline-none text-center"
          />

          {/* Selecionar Evento */}
          <EscolherFesta key={childKey} onSelect={setSelectedEvento} />

          {/* Anexar imagens */}
          {erroImagens && <p className="text-red-400 text-sm mb-1">Selecione ao menos 1 imagem</p>}
          <div className="flex items-center justify-between gap-4 mt-4 mb-6">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Image src="/anexarImagem.svg" alt="Anexar" width={230} height={40} />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <label htmlFor="camera-upload" className="cursor-pointer">
              <Image src="/camera.svg" alt="Câmera" width={32} height={32} />
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

          {/* Termos de uso */}
          {erroTermos && <p className="text-red-400 text-sm mb-1">Você precisa aceitar os termos de uso</p>}
          <div className="flex items-center text-white text-sm mb-4">
            <input
              type="checkbox"
              id="aceite"
              ref={checkboxRef}
              className="mr-2"
              onChange={e => setTermosAceitos(e.target.checked)}
            />
            <label htmlFor="aceite">
              Eu aceito as{" "}
              <span onClick={() => setMostrarRegras(true)} className="underline cursor-pointer font-bold">Regras</span>{" "}
              e{" "}
              <span onClick={() => setMostrarTermos(true)} className="underline cursor-pointer font-bold">Termos de Uso</span>
            </label>
          </div>

          {/* Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative w-full aspect-square">
                <Image fill src={url} alt={`Preview ${i+1}`} className="object-cover rounded" />
                <button
                  onClick={() => removerImagem(i)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                >&times;</button>
              </div>
            ))}
          </div>

          {/* Botão Enviar */}
          <button
            onMouseDown={() => setEnviandoAtivo(true)}
            onMouseUp={() => setEnviandoAtivo(false)}
            onMouseLeave={() => setEnviandoAtivo(false)}
            onTouchStart={() => setEnviandoAtivo(true)}
            onTouchEnd={() => setEnviandoAtivo(false)}
            onClick={enviarImagens}
            disabled={enviando}
            className="w-full flex justify-center mt-2 disabled:opacity-50 relative top-11"
          >
            <Image
              src={enviandoAtivo ? "/enviarAnexoGradiente.svg" : "/enviarAnexo.svg"}
              alt="Enviar"
              width={174}
              height={40}
              className="pointer-events-none"
            />
          </button>
        </div>
      </div>

      <SuccessModal open={modalSucesso} onClose={() => setModalSucesso(false)} />
      {mostrarRegras && <ModalUso titulo="REGRAS" subtitulo="de uso" texto="..." icone="/regrasDeUso.svg" onClose={() => setMostrarRegras(false)} />}
      {mostrarTermos && <ModalUso titulo="TERMOS" subtitulo="de uso" texto="..." icone="/termosDeUso.svg" onClose={() => setMostrarTermos(false)} />}
    </div>
  );
}
