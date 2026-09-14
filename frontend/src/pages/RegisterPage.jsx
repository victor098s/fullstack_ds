import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage({ navigate, flash, setErr }) {
  const { register } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(nome, email, senha);
      flash("Conta criada com sucesso. Faça login.");
      navigate("login");
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
        <h2>Sua sessão começa aqui.</h2>
        <p>Crie sua conta e organize seus filmes.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>
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
          <button className="primary">Criar minha conta</button>
        </form>
        <p>
          Já possui uma conta?{" "}
          <button className="link" onClick={() => navigate("login")}>
            Entrar
          </button>
        </p>
      </section>
    </main>
  );
}
