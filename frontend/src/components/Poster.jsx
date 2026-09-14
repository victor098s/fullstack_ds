export function Poster({ x, big }) {
  const imagem = x?.imagem || x?.posterUrl || x?.poster_url || x?.imagem_url || "";

  if (imagem) {
    return (
      <img
        className={"poster movie-image " + (big ? "big" : "")}
        src={imagem}
        alt={x?.nome || "Poster do filme"}
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextSibling?.style && (e.currentTarget.nextSibling.style.display = "flex");
        }}
      />
    );
  }

  return (
    <div className={"poster fall " + (big ? "big" : "")}>
      <span>◉</span>
      <small>{x?.genero || "Filme"}</small>
      <b>{x?.nome || "Sem Título"}</b>
    </div>
  );
}
