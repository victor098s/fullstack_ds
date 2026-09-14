import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MovieGrid } from "../components/MovieGrid";

export function CatalogPage({ films, cats, onSelectMovie, onAddMovie }) {
  const { isAdmin } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const shownFilms = useMemo(
    () =>
      films.filter(
        (x) =>
          (!q || x.nome.toLowerCase().includes(q.toLowerCase())) &&
          (!cat || x.genero === cat),
      ),
    [films, q, cat],
  );

  return (
    <main className="content">
      <div className="title">
        <section>
          <p className="eyebrow">ACERVO CINEVAULT</p>
          <h1>Catálogo de filmes</h1>
        </section>
        {isAdmin && (
          <button className="primary" onClick={onAddMovie}>
            + Adicionar filme
          </button>
        )}
      </div>
      <div className="filters">
        <input
          placeholder="Buscar por título..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todos os gêneros</option>
          {cats.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
      </div>
      <MovieGrid films={shownFilms} onSelect={onSelectMovie} />
    </main>
  );
}
