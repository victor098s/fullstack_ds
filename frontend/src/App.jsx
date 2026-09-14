import { useEffect, useMemo, useState } from "react";
// Estilos globais da interface e regras para imagens dos cards.
import "./index.css";
import "./CardImages.css";

// Endereço padrão da API e estrutura vazia usada no formulário de filmes.
const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  blank = {
    titulo: "",
    sinopse: "",
    ano: "",
    duracao: "",
    classificacao: "Livre",
    categoriaId: "1",
    posterUrl: "",
    destaque: false,
  };

const request = async (path, opt = {}, token = "") => {
  const response = await fetch(API + path, {
    ...opt,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...opt.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Error(data.erro || "Erro na operação");
  return data;
};

export default function App() {
  // Estados da sessão, navegação, catálogo, formulários e mensagens da interface.
  const [t, setT] = useState(localStorage.cv_token || ""),
    [u, setU] = useState(JSON.parse(localStorage.cv_user || "null")),
    [p, setP] = useState(t ? "dash" : "home"),
    [films, setFilms] = useState([]),
    [cats, setCats] = useState([]),
    [sel, setSel] = useState(null),
    [f, setF] = useState(blank),
    [q, setQ] = useState(""),
    [cat, setCat] = useState(""),
    [msg, setMsg] = useState(""),
    [err, setErr] = useState(""),
    [a, setA] = useState({ nome: "", email: "", senha: "" }),
    admin = u?.papel === "admin";
  // Centraliza as chamadas à API e inclui o token JWT quando o usuário está logado.
  const call = (path, opt = {}, token = t) => request(path, opt, token);
  // Busca filmes e categorias para preencher o catálogo e os filtros.
  const load = async (token = t) => {
    try {
      let [x, y] = await Promise.all([
        call("/filmes", {}, token),
        call("/categorias", {}, token),
      ]);
      setFilms(x);
      setCats(y);
    } catch (e) {
      setErr(e.message);
    }
  };
  useEffect(() => {
    if (!t) return;
    let active = true;
    const loadSessionCatalog = async () => {
      try {
        const [movies, categories] = await Promise.all([
          request("/filmes", {}, t),
          request("/categorias", {}, t),
        ]);
        if (active) {
          setFilms(movies);
          setCats(categories);
        }
      } catch (e) {
        if (active) setErr(e.message);
      }
    };
    loadSessionCatalog();
    return () => {
      active = false;
    };
  }, [t]);
  // Funções de interação: navegar, avisar o usuário, autenticar e gerenciar filmes.
  const go = (x) => {
      setErr("");
      setP(x);
      scrollTo(0, 0);
    },
    flash = (x) => {
      setMsg(x);
      setTimeout(() => setMsg(""), 3000);
    },
    auth = async (e, reg) => {
      e.preventDefault();
      try {
        let d = await call(reg ? "/auth/cadastro" : "/auth/login", {
          method: "POST",
          body: JSON.stringify(a),
        });
        localStorage.cv_token = d.token;
        localStorage.cv_user = JSON.stringify(d.usuario);
        setT(d.token);
        setU(d.usuario);
        await load(d.token);
        go("dash");
        flash("Bem-vindo ao CineVault!");
      } catch (e) {
        setErr(e.message);
      }
    },
    open = (m) => {
      setSel(m);
      setF(m ? { ...m, categoriaId: String(m.categoriaId) } : blank);
      go("form");
    },
    save = async (e) => {
      e.preventDefault();
      if (!f.titulo || !f.sinopse || !f.ano || !f.duracao)
        return setErr("Preencha todos os campos obrigatórios.");
      try {
        await call(sel ? `/filmes/${sel.id}` : "/filmes", {
          method: sel ? "PUT" : "POST",
          body: JSON.stringify({ ...f, ano: +f.ano, duracao: +f.duracao }),
        });
        flash(sel ? "Filme atualizado." : "Filme cadastrado.");
        setSel(null);
        setF(blank);
        await load();
        go("movies");
      } catch (e) {
        setErr(e.message);
      }
    },
    del = async () => {
      if (!confirm("Excluir este filme?")) return;
      try {
        await call(`/filmes/${sel.id}`, { method: "DELETE" });
        await load();
        flash("Filme excluído.");
        go("movies");
      } catch (e) {
        setErr(e.message);
      }
    },
    out = () => {
      localStorage.clear();
      setT("");
      setU(null);
      go("home");
    },
    shown = useMemo(
      () =>
        films.filter(
          (x) =>
            (!q || x.titulo.toLowerCase().includes(q.toLowerCase())) &&
            (!cat || String(x.categoriaId) === cat),
        ),
      [films, q, cat],
    );
  return (
    <>
      <header>
        <button className="brand" onClick={() => go(t ? "dash" : "home")}>
          ◉ CINEVAULT
        </button>
        <nav>
          {t ? (
            <>
              <button onClick={() => go("dash")}>Início</button>
              <button onClick={() => go("movies")}>Catálogo</button>
              {admin && (
                <button className="primary mini" onClick={() => open()}>
                  + Filme
                </button>
              )}
              <button className="avatar" title="Sair" onClick={out}>
                {u.nome[0]}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => go("login")}>Entrar</button>
              <button className="primary mini" onClick={() => go("register")}>
                Criar conta
              </button>
            </>
          )}
        </nav>
      </header>
      {msg && <aside className="toast ok">✓ {msg}</aside>}
      {err && (
        <aside className="toast bad">
          {err}
          <button onClick={() => setErr("")}>×</button>
        </aside>
      )}
      {!t && p === "home" && (
        <main className="landing">
          <section>
            <p className="eyebrow">SEU PRÓXIMO FILME FAVORITO</p>
            <h1>
              Onde cada história <em>ganha vida.</em>
            </h1>
            <p className="lead">
              Organize, descubra e celebre os melhores filmes em um só lugar.
            </p>
            <button className="primary" onClick={() => go("register")}>
              Começar agora →
            </button>
            <button className="ghost" onClick={() => go("login")}>
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
      )}
      {!t && (p === "login" || p === "register") && (
        <main className="auth">
          <section>
            <button className="brand" onClick={() => go("home")}>
              ◉ CINEVAULT
            </button>
            <h2>
              {p === "login"
                ? "Que bom ter você de volta."
                : "Sua sessão começa aqui."}
            </h2>
            <p>
              {p === "login"
                ? "Entre para acessar seu catálogo."
                : "Crie sua conta e organize seus filmes."}
            </p>
            <form onSubmit={(e) => auth(e, p === "register")}>
              {p === "register" && (
                <label>
                  Nome
                  <input
                    required
                    value={a.nome}
                    onChange={(e) => setA({ ...a, nome: e.target.value })}
                  />
                </label>
              )}
              <label>
                E-mail
                <input
                  required
                  type="email"
                  value={a.email}
                  onChange={(e) => setA({ ...a, email: e.target.value })}
                />
              </label>
              <label>
                Senha
                <input
                  required
                  minLength="6"
                  type="password"
                  value={a.senha}
                  onChange={(e) => setA({ ...a, senha: e.target.value })}
                />
              </label>
              <button className="primary">
                {p === "login" ? "Entrar no CineVault" : "Criar minha conta"}
              </button>
            </form>
            <p>
              {p === "login" ? "Ainda não tem conta?" : "Já possui uma conta?"}{" "}
              <button
                className="link"
                onClick={() => go(p === "login" ? "register" : "login")}
              >
                {p === "login" ? "Criar conta" : "Entrar"}
              </button>
            </p>
            <small>Demo admin: admin@cinevault.com / 123456</small>
          </section>
        </main>
      )}
      {t && p === "dash" && (
        <main className="content">
          <div className="title">
            <section>
              <p className="eyebrow">BEM-VINDO, {u.nome.toUpperCase()}</p>
              <h1>O que vamos assistir hoje?</h1>
              <p>Seu acervo tem {films.length} histórias esperando por você.</p>
            </section>
            {admin && (
              <button className="primary" onClick={() => open()}>
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
              <small>CATEGORIAS</small>
              {cats.length}
            </b>
            <b>
              <small>DESTAQUES</small>
              {films.filter((x) => x.destaque).length}
            </b>
          </div>
          <div className="title">
            <section>
              <p className="eyebrow">SELEÇÃO ESPECIAL</p>
              <h2>Em destaque</h2>
            </section>
            <button className="link" onClick={() => go("movies")}>
              Ver catálogo →
            </button>
          </div>
          <Grid
            films={films.filter((x) => x.destaque).slice(0, 3)}
            open={(x) => {
              setSel(x);
              go("detail");
            }}
          />
        </main>
      )}
      {t && p === "movies" && (
        <main className="content">
          <div className="title">
            <section>
              <p className="eyebrow">ACERVO CINEVAULT</p>
              <h1>Catálogo de filmes</h1>
            </section>
            {admin && (
              <button className="primary" onClick={() => open()}>
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
              <option value="">Todas as categorias</option>
              {cats.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nome}
                </option>
              ))}
            </select>
          </div>
          <Grid
            films={shown}
            open={(x) => {
              setSel(x);
              go("detail");
            }}
          />
        </main>
      )}
      {t && p === "detail" && sel && (
        <main className="content">
          <button className="back" onClick={() => go("movies")}>
            ← Voltar ao catálogo
          </button>
          <div className="detail">
            <Poster x={sel} big />
            <section>
              <p className="eyebrow">{sel.categoria}</p>
              <h1>{sel.titulo}</h1>
              <p className="meta">
                {sel.ano} · {sel.duracao} min
              </p>
              <p className="synopsis">{sel.sinopse}</p>
              {admin && (
                <>
                  <button className="primary" onClick={() => open(sel)}>
                    Editar filme
                  </button>
                  <button className="danger" onClick={del}>
                    Excluir
                  </button>
                </>
              )}
            </section>
          </div>
        </main>
      )}
      {t && p === "form" && (
        <main className="content">
          <button className="back" onClick={() => go("movies")}>
            ← Cancelar
          </button>
          <section className="editor">
            <p className="eyebrow">GERENCIAMENTO</p>
            <h1>{sel ? "Editar filme" : "Novo filme"}</h1>
            <form onSubmit={save}>
              <label>
                Título *
                <input
                  value={f.titulo}
                  onChange={(e) => setF({ ...f, titulo: e.target.value })}
                />
              </label>
              <label>
                Categoria *
                <select
                  value={f.categoriaId}
                  onChange={(e) => setF({ ...f, categoriaId: e.target.value })}
                >
                  {cats.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ano *
                <input
                  type="number"
                  min="1888"
                  value={f.ano}
                  onChange={(e) => setF({ ...f, ano: e.target.value })}
                />
              </label>
              <label>
                Duração (min) *
                <input
                  type="number"
                  min="1"
                  value={f.duracao}
                  onChange={(e) => setF({ ...f, duracao: e.target.value })}
                />
              </label>
              <label>
                URL da imagem do card
                <input
                  type="url"
                  value={f.posterUrl || ""}
                  onChange={(e) => setF({ ...f, posterUrl: e.target.value })}
                  placeholder="https://..."
                />
              </label>
              <label className="wide">
                Sinopse *
                <textarea
                  rows="5"
                  value={f.sinopse}
                  onChange={(e) => setF({ ...f, sinopse: e.target.value })}
                />
              </label>
              <label className="wide check">
                <input
                  type="checkbox"
                  checked={f.destaque}
                  onChange={(e) => setF({ ...f, destaque: e.target.checked })}
                />{" "}
                Exibir em destaque
              </label>
              <button className="primary">
                {sel ? "Salvar alterações" : "Cadastrar filme"}
              </button>
            </form>
          </section>
        </main>
      )}
    </>
  );
}
function Poster({ x, big }) {
  const [imageFailed, setImageFailed] = useState(false);
  const fallback = (
    <div
      className={
        "poster fall category-" + x.categoriaId + " " + (big ? "big" : "")
      }
    >
      <span>◉</span>
      <small>{x.categoria}</small>
      <b>{x.titulo}</b>
    </div>
  );

  return x.posterUrl && !imageFailed ? (
    <img
      className={"poster movie-image " + (big ? "big" : "")}
      src={x.posterUrl}
      alt={`Pôster de ${x.titulo}`}
      referrerPolicy="no-referrer"
      onError={() => setImageFailed(true)}
    />
  ) : fallback;
}
function Grid({ films, open }) {
  return (
    <div className="grid">
      {films.length ? (
        films.map((x) => (
          <article key={x.id} onClick={() => open(x)}>
            <Poster x={x} />
            <section>
              <small>
                {x.categoria} · {x.ano}
              </small>
              <h3>{x.titulo}</h3>
              <small>{x.duracao} min</small>
            </section>
          </article>
        ))
      ) : (
        <p>Nenhum filme encontrado.</p>
      )}
    </div>
  );
}
