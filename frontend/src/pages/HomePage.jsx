export function HomePage({ navigate }) {
  return (
    <main className="landing">
      <section>
        <p className="eyebrow">SEU PRÓXIMO FILME FAVORITO</p>
        <h1>
          Onde cada história <em>ganha vida.</em>
        </h1>
        <p className="lead">
          Organize, descubra e celebre os melhores filmes em um só lugar.
        </p>
        <button className="primary" onClick={() => navigate("register")}>
          Começar agora →
        </button>
        <button className="ghost" onClick={() => navigate("login")}>
          Já tenho uma conta
        </button>
      </section>
      <div className="wall">
        <b>
          LUMEN<small>UMA JORNADA ALÉM</small>
        </b>
        <b>
          NOIR<small>O SEGREDO ESTÁ NO ESCURO</small>
        </b>
        <b>
          WILD<small>HÁ ALGO LÁ FORA</small>
        </b>
      </div>
    </main>
  );
}
