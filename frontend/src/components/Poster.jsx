import { useState } from "react";

export function Poster({ x, big }) {
  const imagem = x?.imagem || x?.posterUrl || x?.poster_url || x?.imagem_url || "";
  const [falhou, setFalhou] = useState(false);
  const mostrarFallback = !imagem || falhou;

  return (
    <div className={"poster-wrap " + (big ? "big" : "")}>
      {!mostrarFallback && (
        <img
          className={"poster movie-image " + (big ? "big" : "")}
          src={imagem}
          alt={x?.nome || "Poster do filme"}
          referrerPolicy="no-referrer"
          onError={() => setFalhou(true)}
        />
      )}

      {mostrarFallback && (
        <div className={"poster fall " + (big ? "big" : "")}>
          <span>◉</span>
          <small>{x?.genero || "Filme"}</small>
          <b>{x?.nome || "Sem Título"}</b>
        </div>
      )}
    </div>
  );
}
