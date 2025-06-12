// components/MobileMenu.tsx
"use client";

import Image from "next/image";
import { useEffect } from "react";
import Header from "./header";

interface MobileMenuAdmProps {
  open: boolean;
  onClose: () => void;
}

const items = [
  { href: "/adm-eventos", icon: "/menuEventos.svg", label: "Eventos" },
  { href: "/adm", icon: "/menuGaleriaUsuarios.svg", label: "Compartilhe" },
  { href: "/adm-denzel", icon: "/menuDenzel.svg", label: "A DENZEL" },
];

export default function MobileMenuAdm({ open, onClose }: MobileMenuAdmProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#100D1E]">
      {/* Header interno com ícone de fechar */}
      <Header menuOpen={open} onMenuClick={onClose} />

      {/* Links do menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {items.map(({ href, icon, label }) => (
            <li key={href} className="border-b border-white/10">
              <a
                href={href}
                onClick={onClose}
                className="block p-[1px]"
              >
                <div
                  className="
                    bg-[#1A172A] rounded-[inherit] flex items-center justify-center gap-2 py-5 px-4
                    transition 
                    active:bg-gradient-to-r active:from-[#9C60DA] active:to-[#43A3D5]
                  "
                >
                  <Image src={icon} alt={label} width={360} height={110} />
                 
                </div>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
