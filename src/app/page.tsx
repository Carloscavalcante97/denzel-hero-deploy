"use client";

import Galeria from "../components/galeria";
import EnviarFile from "../components/enviarFile";
import QuemSomosCarousel from "../components/quemSomos";
import QuerSaberMais from "../components/querSaberMais";
import ContactForm from "../components/contatoForm";
import Footer from "../components/footer";
import Header from "../components/header";
import MobileMenu from "../components/menu";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    // 1) Container raiz com bg e sem min-h-screen aqui
    <div className="bg-[#100D1E]">
      <Header menuOpen={menuOpen} onMenuClick={() => setMenuOpen(prev => !prev)} />
      {/* 2) Esse mantém o seu min-h-screen para "encher" a tela */}
      <div className="min-h-screen flex flex-col items-center px-4 py-6">
        {/* Título com gradiente */}
        <div className="w-full text-center mb-6">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] font-bold text-xl leading-snug">
            <strong>POSTE SEUS MELHORES</strong> <br /> MOMENTOS!!
          </h1>
        </div>

        {/* Galeria Centralizada */}
        <div className="w-full mt-6" id="galeria-container">
          <Galeria />
        </div>

        {/* Envio de Imagens */}
        <div className="w-full mx-auto " id="enviar-file-container">
          <EnviarFile />
        </div>
      </div>

      {/* 3) Carrossel “Quem Somos” agora imediatamente abaixo, mas no mesmo bg */}
      <div id="quem-somos-carousel" >

      <QuemSomosCarousel />
      </div>
      <div >
        <div id="quer-saber-mais" >

      <QuerSaberMais />
        </div>
      <div className="w-[90%] mx-auto" id="contato-container"> 

      <ContactForm />
      </div>
      <Footer/>
      </div>
       <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
