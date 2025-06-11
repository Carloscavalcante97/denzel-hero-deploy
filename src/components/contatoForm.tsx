// components/ContactForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // aqui você envia os dados para o backend ou serviço de email
    console.log({ email, subject, message });
    alert("Mensagem enviada!");
  };

  return (
    <section className="flex justify-center py-12 bg-[#100D1E]">
      {/* Wrapper com borda em gradiente */}
      <div className="w-full max-w-md p-[2px] rounded-3xl bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]">
        <div className="bg-[#100D1E] rounded-3xl px-6 py-8 text-white">
          {/* Ícone e título */}
          <div className="flex flex-col items-center mb-6 relative bottom-21">
            <Image
              src={"/contatoTitle.svg"}
              alt="contato"
              width={203}
              height={69}
            />
          </div>

          {/* Seção "Pelo ZAP" */}
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex-grow border-t border-gray-600" />
            <span className="px-3">Pelo ZAP</span>
            <div className="flex-grow border-t border-gray-600" />
          </div>

          <div className="flex justify-center mb-6">
            {/* Wrapper do border-gradient */}
            <div className="rounded-full p-[1px] bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]">
              {/* Botão real com fundo escuro */}
              <a
                href="https://wa.me/55819XXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1D1933] rounded-full text-white text-sm hover:bg-[#2a263d]  transition-colors duration-200
              active:bg-gradient-to-r active:from-[#43A3D5] active:to-[#9C60DA]"
              >
                <Image
                  src="/whatsappIcon.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                />
                (81) 9 9555-5555
              </a>
            </div>
          </div>

          {/* Seção "ou por email" */}
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <div className="flex-grow border-t border-gray-600" />
            <span className="px-3">ou por email</span>
            <div className="flex-grow border-t border-gray-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <input
              type="email"
              placeholder="Seu Email"
              className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#43A3D5] text-center  "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Assunto */}
            <div className="relative">
              <input
                type="text"
                placeholder="▶︎ Assunto"
                className="w-full pl-10 pr-10 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#43A3D5] text-center  "
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

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
            <div className="flex justify-center mt-4 relative top-13">
              <button type="submit" className="">
                <Image
                  src="/enviarAnexo.svg"
                  alt="Enviar"
                  width={176}
                  height={40}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
