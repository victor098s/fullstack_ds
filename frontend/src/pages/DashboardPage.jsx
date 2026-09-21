import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MovieGrid } from "../components/MovieGrid";

const normalizeText = (str) =>
  (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function DashboardPage({ films = [], cats = [], navigate, onSelectMovie, onAddMovie }) {
  const { user, isAdmin } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const movieList = Array.isArray(films) ? films : [];
  const catList = Array.isArray(cats) ? cats : [];
  const totalStock = movieList.reduce((acc, f) => acc + Number(f.quantidade || 0), 0);

  const shownFilms = useMemo(() => {
    const search = normalizeText(q);
    const selectedCat = normalizeText(cat);

    return movieList.filter((x) => {
      if (!x) return false;

      const name = normalizeText(x.nome || x.titulo);
      const director = normalizeText(x.nome_do_diretor || x.diretor);
      const genre = normalizeText(x.genero || x.categoria);
      const year = normalizeText(x.ano);

      const matchesSearch =
        !search ||
        name.includes(search) ||
        director.includes(search) ||
        genre.includes(search) ||
        year.includes(search);

      const genreTokens = (x.genero || x.categoria || "")
        .toString()
        .split(/[\/,;]/)
        .map((g) => normalizeText(g))
        .filter(Boolean);

      const matchesCat =
        !selectedCat ||
        genreTokens.some((g) => g === selectedCat) ||
        genre === selectedCat;

      return matchesSearch && matchesCat;
    });
  }, [movieList, q, cat]);

  const clearFilters = () => {
    setQ("");
    setCat("");
  };

  const isFiltering = Boolean(q.trim() || cat);

  return (
    <main className="content">
      <div className="title">
        <section>
          <p className="eyebrow">BEM-VINDO, {user?.nome?.toUpperCase()}</p>
          <h1>O que vamos assistir hoje?</h1>
          <p>Seu acervo tem {movieList.length} histórias esperando por você.</p>
        </section>
        {isAdmin && (
          <button className="primary" onClick={onAddMovie}>
            + Adicionar filme
          </button>
        )}
      </div>
      <div className="stats">
        <b>
          <small>FILMES NO CATÁLOGO</small>
          {movieList.length}
        </b>
        <b>
          <small>GÊNEROS</small>
          {catList.length}
        </b>
        <b>
          <small>TOTAL EM ESTOQUE</small>
          {totalStock}
        </b>
      </div>

      <div className="title" style={{ marginTop: "2rem" }}>
        <section>
          <p className="eyebrow">PESQUISA & NAVEGAÇÃO</p>
          <h2>{isFiltering ? `Filmes filtrados (${shownFilms.length})` : "Adicionados recentemente"}</h2>
        </section>
        <button className="link" onClick={() => navigate("movies")}>
          Ver catálogo completo →
        </button>
      </div>

      <div className="filters" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por título, diretor, gênero ou ano..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: "1 1 240px" }}
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ flex: "0 1 200px" }}
        >
          <option value="">Todos os gêneros</option>
          {catList.map((item, index) => {
            const val = typeof item === "object" && item !== null ? item.nome || item.id || String(index) : String(item);
            const label = typeof item === "object" && item !== null ? item.nome || item.id || String(index) : String(item);
            return (
              <option key={val + "-" + index} value={val}>
                {label}
              </option>
            );
          })}
        </select>
        {isFiltering && (
          <button
            className="ghost mini"
            onClick={clearFilters}
            style={{ padding: "8px 14px", height: "auto" }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <MovieGrid films={isFiltering ? shownFilms : shownFilms.slice(0, 6)} onSelect={onSelectMovie} />
    </main>
  );
}
