// components/Header.tsx
"use client";

import Image from "next/image";

interface HeaderProps {
  menuOpen: boolean;
  onMenuClick: () => void;
}

export default function HeaderAdm({ menuOpen, onMenuClick }: HeaderProps) {

return (
<header className="sticky top-0 z-50 bg-[#100D1E] w-full">
      {/* Top gradient line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]" />

      {/* Main header bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu toggle */}
        <button className="p-1" onClick={onMenuClick}>
          <Image
            src={menuOpen ? "/close.svg" : "/menu.svg"}
            alt={menuOpen ? "Fechar menu" : "Abrir menu"}
            width={24}
            height={24}
          />
        </button>

        {/* Logo */}
        <Image
          src="/denzelLogo.svg"
          alt="Denzel Iluminação"
          width={100}
          height={32}
          priority
        />

        {/* Instagram icon */}
        <a
          href="https://instagram.com/denzeleventos"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1"
        >
          <Image
            src="/instagramIcon.svg"
            alt="Instagram"
            width={24}
            height={24}
          />
        </a>
      </div>

      {/* Bottom gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]" />
    </header>
  );
}
