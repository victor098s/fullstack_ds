export function Poster({ x, big }) {
  return (
    <div className={"poster fall " + (big ? "big" : "")}>
      <span>◉</span>
      <small>{x?.genero || "Filme"}</small>
      <b>{x?.nome || "Sem Título"}</b>
    </div>
  );
}
