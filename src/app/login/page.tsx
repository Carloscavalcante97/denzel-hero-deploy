"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  // Credenciais para disparar o login
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const [user, setUser] = useState<any>(null);
  const [loginError, setLoginError] = useState<string | null>(null);



  /**
   * 2) Sempre que `credentials` mudar (cliente clicar em Entrar),
   *    dispara o fetch para /login.
   */
  useEffect(() => {
    if (!credentials) return;

    async function doLogin() {
      try {
        const res = await fetch(
          "https://denzel-hero-backend.onrender.com/login",
          {
            method: "POST",
            credentials: "include", // garante envio do cookie HTTP-only
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email ?? "",
              password: credentials?.password ?? "",
            }),
          }
        );

        const json = await res.json();
        if (!res.ok) {
          setLoginError(json.error || "Credenciais inválidas");
          setUser(null);
        } else {
          // login ok: backend setou cookie, pegamos user do corpo
          setUser(json.user);
          setLoginError(null);
          router.push("/adm");
        
        }
      } catch (err: any) {
        setLoginError(err.message || "Erro de rede");
        setUser(null);
      }
    }

    doLogin();
  }, [credentials]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setCredentials({ email, password: senha });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Login"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 bg-transparent border rounded text-white placeholder-white/60 focus:outline-none focus:border-[#43A3D5]"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="w-full px-4 py-2 bg-transparent border rounded text-white placeholder-white/60 focus:outline-none focus:border-[#43A3D5]"
        required
      />

      {loginError && <p className="text-red-400 text-sm">{loginError}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] rounded text-white font-medium transition-opacity hover:opacity-90"
      >
        Entrar
      </button>

     {user ? (
  <div className="p-3 border border-green-500 rounded text-green-300 text-sm bg-green-500/10">
    ✅ Sessão ativa como <strong>{user.email}</strong>.<br />
    Você está autenticado via cookie.
  </div>
) : (
  <div className="p-3 border border-yellow-500 rounded text-yellow-300 text-sm bg-yellow-500/10">
    ⚠️ Nenhuma sessão ativa detectada.<br />
    Faça login para continuar.
  </div>
)}

    </form>
  );
}
