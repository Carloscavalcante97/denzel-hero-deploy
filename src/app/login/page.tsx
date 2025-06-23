"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!credentials) return;

    async function doLogin() {
      try {
        const res = await fetch(
          "https://denzel-hero-deploy.onrender.com/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const json = await res.json();

        if (!res.ok) {
          setLoginError(json.error || "Credenciais inválidas");
          setUser(null);
        } else {
          const { token: accessToken, user: loggedUser } = json;

          // Armazena o token (pode ser Context, Zustand, etc.)
          localStorage.setItem("access_token", accessToken);
          setToken(accessToken);

          setUser(loggedUser);
          setLoginError(null);

          router.push("/adm");
        }
      } catch (err: any) {
        setLoginError(err.message || "Erro de rede");
        setUser(null);
      }
    }

    doLogin();
  }, [credentials, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setCredentials({ email, password: senha });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#100D1E]"
      style={{
        backgroundImage: "url('/image 5.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Image
        src="/fundoLoginSuperior.svg"
        alt="Fundo Login Superior"
        width={1920}
        height={150}
        className="w-full h-[150px] object-cover fixed top-0 left-0 z-10"
      />

      <Image
        src="/gerenciadorGaleria.svg"
        alt="Gerenciador de Galeria"
        width={220}
        height={40}
        className="absolute top-[30px] left-1/2 -translate-x-1/2 z-20"
      />

      <div className="absolute inset-4 bg-[url('/loginBackground.svg')] bg-cover bg-center opacity-20 z-0"></div>

      <div className="relative z-10 w-full max-w-xs text-center space-y-4 px-4">
        <Image
          src="/denzelLogo.svg"
          alt="Denzel Logo"
          width={130}
          height={36}
          className="mx-auto mb-6 relative"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:border-[#43A3D5]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:border-[#43A3D5]"
            required
          />

          {loginError && <p className="text-red-400 text-sm">{loginError}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center hover:opacity-90 transition"
          >
            <Image src="/entrar.svg" alt="Entrar" width={134} height={40} />
          </button>
        </form>

        <button className="block mx-auto flex items-center justify-center gap-2 text-white/80 text-sm hover:underline mt-2">
          <Image src="/esqueciSenha.svg" alt="Chave" width={166} height={40} />
        </button>
      </div>

      <Image
        src="/fundoLoginInferior.svg"
        alt="Fundo Login Inferior"
        width={1920}
        height={150}
        className="w-full h-[150px] object-cover fixed bottom-0 left-0 z-10"
      />
    </div>
  );
}
