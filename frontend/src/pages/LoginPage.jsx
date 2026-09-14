import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function LoginPage({ navigate, flash, setErr }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, senha);
      flash("Bem-vindo ao CineVault!");
      navigate("dash");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <main className="auth">
      <section>
        <button className="brand" onClick={() => navigate("home")}>
          ◉ CINEVAULT
        </button>
        <h2>Que bom ter você de volta.</h2>
        <p>Entre para acessar seu catálogo.</p>
        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Senha
            <input
              required
              minLength="6"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>
          <button className="primary">Entrar no CineVault</button>
        </form>
        <p>
          Ainda não tem conta?{" "}
          <button className="link" onClick={() => navigate("register")}>
            Criar conta
          </button>
        </p>
        <small>Demo admin: admin@cinevault.com / 123456</small>
      </section>
    </main>
  );
}
