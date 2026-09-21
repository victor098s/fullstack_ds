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

export function CatalogPage({ films = [], cats = [], onSelectMovie, onAddMovie }) {
  const { isAdmin } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const movieList = Array.isArray(films) ? films : [];
  const catList = Array.isArray(cats) ? cats : [];

  const shownFilms = useMemo(() => {
    const search = normalizeText(q);
    const selectedCat = normalizeText(cat);

    return movieList.filter((x) => {
      if (!x) return false;

      const name = normalizeText(x.nome || x.titulo);
      const director = normalizeText(x.nome_do_diretor || x.diretor);
      const genre = normalizeText(x.genero || x.categoria);
      const year = normalizeText(x.ano);

      // Search match across name, director, genre, year
      const matchesSearch =
        !search ||
        name.includes(search) ||
        director.includes(search) ||
        genre.includes(search) ||
        year.includes(search);

      // Exact genre token match (split by /, ;, comma)
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
          <p className="eyebrow">ACERVO CINEVAULT</p>
          <h1>Catálogo de filmes</h1>
          <p style={{ marginTop: "4px", fontSize: "0.9rem", color: "var(--muted, #888)" }}>
            Exibindo {shownFilms.length} de {movieList.length} filmes
          </p>
        </section>
        {isAdmin && (
          <button className="primary" onClick={onAddMovie}>
            + Adicionar filme
          </button>
        )}
      </div>

      <div className="filters" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
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

      <MovieGrid films={shownFilms} onSelect={onSelectMovie} />
    </main>
  );
}
