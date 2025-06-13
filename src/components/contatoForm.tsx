// components/ContactForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import SuccessContactModal from "./modalSucessoContato";

export default function ContactForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://denzel-hero-backend.onrender.com/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro desconhecido");

      setModalSucesso(true);
      setSubject("");
      setMessage("");
    } catch (err: any) {
      alert(`Falha ao enviar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center py-12 bg-[#100D1E]">
      <div className="w-full max-w-md p-[2px] rounded-3xl bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]">
        <div className="bg-[#100D1E] rounded-3xl px-6 py-8 text-white">
          {/* Título */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/contatoTitle.svg"
              alt="contato"
              width={203}
              height={69}
            />
          </div>

          {/* WhatsApp */}
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex-grow border-t border-gray-600" />
            <span className="px-3">Pelo ZAP</span>
            <div className="flex-grow border-t border-gray-600" />
          </div>
          <div className="flex justify-center mb-6">
            <div className="rounded-full p-[1px] bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]">
              <a
                href="https://wa.me/5581996569571"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1D1933] rounded-full text-white text-sm hover:bg-[#2a263d] transition-colors duration-200 active:bg-gradient-to-r active:from-[#43A3D5] active:to-[#9C60DA]"
              >
                <Image
                  src="/whatsappIcon.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                />
                (81) 9 9656-9571
              </a>
            </div>
          </div>

          {/* “ou por email” */}
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex-grow border-t border-gray-600" />
            <span className="px-3">ou por email</span>
            <div className="flex-grow border-t border-gray-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Assunto */}
            <input
              type="text"
              placeholder="▶︎ Assunto"
              className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#43A3D5] text-center"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            {/* Mensagem */}
            <textarea
              placeholder="Mensagem"
              rows={4}
              className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#43A3D5]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            {/* Botão Enviar */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="relative"
              >
                <Image
                  src="/enviarAnexo.svg"
                  alt={loading ? "Enviando..." : "Enviar"}
                  width={176}
                  height={40}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessContactModal open={modalSucesso} onClose={() => setModalSucesso(false)} />
    </section>
  );
}
