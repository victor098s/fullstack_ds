import { Poster } from "./Poster";

export function MovieGrid({ films, onSelect }) {
  return (
    <div className="grid">
      {films.length ? (
        films.map((x, index) => (
          <article key={(x.id || 0) + "-" + index} onClick={() => onSelect(x)}>
            <Poster x={x} />
            <section>
              <small>
                {x.genero} · {x.ano}
              </small>
              <h3>{x.nome}</h3>
              <small>
                {x.duracao} · Classificação Indicativa: {x.quantidade}
              </small>
              <small
                style={{ display: "block", opacity: 0.8, marginTop: "4px" }}
              >
                Diretor: {x.nome_do_diretor}
              </small>
            </section>
          </article>
        ))
      ) : (
        <p>Nenhum filme encontrado.</p>
      )}
    </div>
  );
}
