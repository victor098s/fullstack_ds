import { useAuth } from "../context/AuthContext";
import { Poster } from "../components/Poster";

export function MovieDetailPage({ movie, navigate, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  if (!movie) return null;

  return (
    <main className="content">
      <button className="back" onClick={() => navigate("movies")}>
        ← Voltar ao catálogo
      </button>
      <div className="detail">
        <Poster x={movie} big />
        <section>
          <p className="eyebrow">{movie.genero}</p>
          <h1>{movie.nome}</h1>
          <p className="meta">
            {movie.ano} · {movie.duracao} · Classificação Indicativa:{" "}
            {movie.quantidade}
          </p>
          <p className="synopsis">
            <strong>Diretor:</strong> {movie.nome_do_diretor}
          </p>
          {isAdmin && (
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button className="primary" onClick={() => onEdit(movie)}>
                Editar filme
              </button>
              <button className="danger" onClick={() => onDelete(movie)}>
                Excluir
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
