export const API = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export const blankMovie = {
  nome: "",
  duracao: "",
  quantidade: "1",
  ano: "",
  genero: "",
  nome_do_diretor: "",
};

export const normalizeMovie = (item = {}) => ({
  id: item.id_filme ?? item.id ?? 0,
  nome: item.nome ?? item.titulo ?? "Filme sem título",
  duracao: String(item.duracao ?? ""),
  quantidade: Number(item.quantidade ?? 1),
  ano: Number(item.ano ?? 0),
  genero: item.genero ?? item.categoria ?? "Geral",
  nome_do_diretor: item.nome_do_diretor ?? item.diretor ?? "",
});

export const buildMoviePayload = (f) => ({
  nome: String(f.nome || "").trim(),
  duracao: String(f.duracao || "").trim(),
  quantidade: Number(f.quantidade || 1),
  ano: Number(f.ano || 0),
  genero: String(f.genero || "").trim(),
  nome_do_diretor: String(f.nome_do_diretor || "").trim(),
});

export const request = async (path, opt = {}, token = "") => {
  const rawToken = (token || localStorage.getItem("cv_token") || "").trim();
  const validToken = rawToken && rawToken !== "null" && rawToken !== "undefined" ? rawToken : "";

  const headers = {
    Accept: "application/json",
    ...(validToken ? { Authorization: `Bearer ${validToken}` } : {}),
    ...(opt.body ? { "Content-Type": "application/json" } : {}),
    ...opt.headers,
  };

  let response;
  try {
    response = await fetch(API + path, {
      ...opt,
      headers,
    });
  } catch (error) {
    throw new Error(`Não foi possível conectar ao servidor backend em ${API}. Verifique se o servidor está rodando.`);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : {};

  if (!response.ok) {
    const errorMsg = data.error || data.erro || `Erro na operação (${response.status})`;
    if (response.status === 401 || response.status === 403 || errorMsg.includes("expirado") || errorMsg.includes("Token")) {
      localStorage.removeItem("cv_token");
      localStorage.removeItem("cv_user");
    }
    throw new Error(errorMsg);
  }

  return data;
};
