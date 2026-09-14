import { useAuth } from "../context/AuthContext";
import { MovieGrid } from "../components/MovieGrid";

export function DashboardPage({ films, cats, navigate, onSelectMovie, onAddMovie }) {
  const { user, isAdmin } = useAuth();
  const totalStock = films.reduce((acc, f) => acc + Number(f.quantidade || 0), 0);

  return (
    <main className="content">
      <div className="title">
        <section>
          <p className="eyebrow">BEM-VINDO, {user?.nome?.toUpperCase()}</p>
          <h1>O que vamos assistir hoje?</h1>
          <p>Seu acervo tem {films.length} histórias esperando por você.</p>
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
          {films.length}
        </b>
        <b>
          <small>GÊNEROS</small>
          {cats.length}
        </b>
        <b>
          <small>TOTAL EM ESTOQUE</small>
          {totalStock}
        </b>
      </div>
      <div className="title">
        <section>
          <p className="eyebrow">SELEÇÃO ESPECIAL</p>
          <h2>Adicionados recentemente</h2>
        </section>
        <button className="link" onClick={() => navigate("movies")}>
          Ver catálogo →
        </button>
      </div>
      <MovieGrid films={films.slice(0, 3)} onSelect={onSelectMovie} />
    </main>
  );
}
