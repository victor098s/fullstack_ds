import { useState } from "react";
import { blankMovie } from "../api/api";

export function MovieFormPage({ selectedMovie, onSave, navigate }) {
  const [f, setF] = useState(() => selectedMovie || blankMovie);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(f);
  };

  return (
    <main className="content">
      <button className="back" onClick={() => navigate("movies")}>
        ← Cancelar
      </button>
      <section className="editor">

        <h1>{selectedMovie ? "Editar filme" : "Novo filme"}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nome do filme *
            <input
              required
              value={f.nome}
              onChange={(e) => setF({ ...f, nome: e.target.value })}
              placeholder="Ex: O Poderoso Chefão"
            />
          </label>
          <label>
            Duração *
            <input
              required
              value={f.duracao}
              onChange={(e) => setF({ ...f, duracao: e.target.value })}
              placeholder="Ex: 175 min"
            />
          </label>
          <label>
            Classificação etária: Ex: 12
            <input
              required
              type="number"
              min="1"
              value={f.quantidade}
              onChange={(e) => setF({ ...f, quantidade: e.target.value })}
            />
          </label>
          <label>
            Ano *
            <input
              required
              type="number"
              min="1888"
              value={f.ano}
              onChange={(e) => setF({ ...f, ano: e.target.value })}
              placeholder="Ex: 1972"
            />
          </label>
          <label>
            Gênero *
            <input
              required
              value={f.genero}
              onChange={(e) => setF({ ...f, genero: e.target.value })}
              placeholder="Ex: Drama"
            />
          </label>
          <label>
            Nome do diretor *
            <input
              required
              value={f.nome_do_diretor}
              onChange={(e) => setF({ ...f, nome_do_diretor: e.target.value })}
              placeholder="Ex: Francis Ford Coppola"
            />
          </label>
          <button className="primary">
            {selectedMovie ? "Salvar alterações" : "Cadastrar filme"}
          </button>
        </form>
      </section>
    </main>
  );
}
