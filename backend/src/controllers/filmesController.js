// JWT protege as rotas e identifica o papel do usuário autenticado.
const jwt = require("jsonwebtoken"),
  secret = process.env.JWT_SECRET || "cinevault_dev_secret";
// Categorias que são retornadas pela API e usadas como filtros no front-end.
const cats = [
  { id: 1, nome: "Terror" },
  { id: 2, nome: "Romance" },
  { id: 3, nome: "Aventura" },
  { id: 4, nome: "Comédia" },
  { id: 5, nome: "Drama" },
  { id: 6, nome: "Ação" },
  { id: 7, nome: "Ficção científica" },
  { id: 8, nome: "Suspense" },
  { id: 9, nome: "Animação" },
];
// Catálogo inicial: cada chave representa o id de uma categoria.
const catalog = {
  1: [
    ["Pânico", 1996],
    ["O Exorcista", 1973],
    ["A Freira", 2018],
    ["Invocação do Mal", 2013],
    ["It: A Coisa", 2017],
    ["O Iluminado", 1980],
    ["Corra!", 2017],
    ["Hereditário", 2018],
    ["Annabelle", 2014],
    ["A Bruxa", 2015],
  ],
  2: [
    ["Crepúsculo", 2008],
    ["Diário de uma Paixão", 2004],
    ["Como Eu Era Antes de Você", 2016],
    ["Orgulho e Preconceito", 2005],
    ["Titanic", 1997],
    ["Simplesmente Acontece", 2014],
    ["A Cinco Passos de Você", 2019],
    ["Questão de Tempo", 2013],
    ["Para Todos os Garotos que Já Amei", 2018],
    ["La La Land", 2016],
  ],
  3: [
    ["Jurassic Park", 1993],
    ["Indiana Jones", 1981],
    ["Jumanji", 1995],
    ["Piratas do Caribe", 2003],
    ["O Senhor dos Anéis", 2001],
    ["Avatar", 2009],
    ["Mad Max: Estrada da Fúria", 2015],
    ["As Crônicas de Nárnia", 2005],
    ["Uncharted", 2022],
    ["Duna", 2021],
  ],
  4: [
    ["As Branquelas", 2004],
    ["Se Beber, Não Case!", 2009],
    ["Todo Mundo em Pânico", 2000],
    ["Gente Grande", 2010],
    ["O Máskara", 1994],
    ["Minha Mãe é uma Peça", 2013],
    ["Esqueceram de Mim", 1990],
    ["Debi & Lóide", 1994],
    ["Eu, Eu Mesmo e Irene", 2000],
    ["O Auto da Compadecida", 2000],
  ],
  5: [
    ["À Espera de um Milagre", 1999],
    ["Forrest Gump", 1994],
    ["Clube da Luta", 1999],
    ["O Poderoso Chefão", 1972],
    ["Um Sonho de Liberdade", 1994],
    ["Cidade de Deus", 2002],
    ["Parasita", 2019],
    ["O Pianista", 2002],
    ["O Lobo de Wall Street", 2013],
    ["Whiplash", 2014],
  ],
  6: [
    ["Vingadores: Ultimato", 2019],
    ["John Wick", 2014],
    ["Gladiador", 2000],
    ["Batman: O Cavaleiro das Trevas", 2008],
    ["Missão Impossível", 1996],
    ["Pantera Negra", 2018],
    ["Top Gun: Maverick", 2022],
    ["Matrix", 1999],
    ["Resgate do Soldado Ryan", 1998],
    ["300", 2006],
  ],
  7: [
    ["Interestelar", 2014],
    ["Blade Runner 2049", 2017],
    ["Star Wars", 1977],
    ["De Volta para o Futuro", 1985],
    ["A Origem", 2010],
    ["O Predador", 1987],
    ["Alien", 1979],
    ["Ex Machina", 2014],
    ["E.T.", 1982],
    ["Oppenheimer", 2023],
  ],
  8: [
    ["Ilha do Medo", 2010],
    ["Garota Exemplar", 2014],
    ["Seven", 1995],
    ["O Silêncio dos Inocentes", 1991],
    ["Fragmentado", 2016],
    ["Os Suspeitos", 2013],
    ["Cisne Negro", 2010],
    ["Zodíaco", 2007],
    ["Corpo Fechado", 2000],
    ["A Órfã", 2009],
  ],
  9: [
    ["Toy Story", 1995],
    ["O Rei Leão", 1994],
    ["Shrek", 2001],
    ["Divertida Mente", 2015],
    ["Procurando Nemo", 2003],
    ["A Viagem de Chihiro", 2001],
    ["Wall-E", 2008],
    ["Up: Altas Aventuras", 2009],
    ["Homem-Aranha no Aranhaverso", 2018],
    ["Frozen", 2013],
  ],
};
// URLs dos pôsteres na mesma ordem em que os filmes aparecem no catálogo.
const posterUrls = [
  "https://tse3.mm.bing.net/th/id/OIP.ZeVWlNzb2KbWW9qk6jtrrwHaKe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://br.web.img2.acsta.net/pictures/18/06/19/13/54/0605746.png",
  "https://leiturafilmica.com.br/wp-content/uploads/2022/05/invocacao-do-mal-poster.jpg",
  "https://br.web.img2.acsta.net/pictures/17/03/29/07/56/333222.jpg",
  "https://br.web.img3.acsta.net/c_310_420/pictures/14/10/10/19/21/152595.jpg",
  "https://tse1.mm.bing.net/th/id/OIP.86dp9sF7GbeEzAvbq2OYhAHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://tse4.mm.bing.net/th/id/OIP.DjEEFeE4_Dc05dSBB2GfwAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://th.bing.com/th/id/R.31a45967e5abfbc0a5ffa7fd9e8da67b?rik=Ioc9y%2frxjPDMrg&riu=http%3a%2f%2fwww.wearemoviegeeks.com%2fwp-content%2fuploads%2fAnnabelle-2014-Movie-Poster.jpg&ehk=3DmlpExCYWMuDrHcX7EOvn1DJv0L%2bdhicfWCBrDDYgY%3d&risl=&pid=ImgRaw&r=0",
  "https://br.web.img3.acsta.net/pictures/15/09/15/21/05/589902.jpg",
  "https://m.media-amazon.com/images/M/MV5BYWVkOGNmNWItNDE2MC00NTk2LWEwZmYtYjFkZmZlZTcxODhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  "https://images.justwatch.com/poster/304264870/s718/diario-de-uma-paixao.jpg",
  "https://www.querofilme.com.br/images/b/2281-como-eu-era-antes-de-voce.jpg",
  "https://media.fstatic.com/PIALTeV94nblOSSnSrzqLzFiXE8=/322x478/smart/filters:format(webp)/media/movies/covers/2011/07/53432b237d6bab70105440d7c852b251.jpg",
  "https://tse1.mm.bing.net/th/id/OIP.RAsVwwmpYCoQxDZaqRzTeQHaK_?r=0&w=663&h=984&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://br.web.img3.acsta.net/pictures/14/12/11/15/29/051042.jpg",
  "https://cosmonerd.com.br/wp-content/uploads/2019/02/P%C3%B4ster-Final-A-Cinco-Passos-de-Voc%C3%AA.png",
  "https://br.web.img3.acsta.net/pictures/210/530/21053062_20131025204305591.jpg",
  "https://tse1.mm.bing.net/th/id/OIP.uTWNtBopmzJgVK-ZW8-fFQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://tse4.mm.bing.net/th/id/OIP._Zcj4UBObxjkKyYc9pAUQAHaK_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://tse3.mm.bing.net/th/id/OIP.fecfHEeksxISBB6JxgsKIwHaKo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://tse1.mm.bing.net/th/id/OIP.z-qR0LOvPgPQuxVPAwF_oQHaKg?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://tse1.mm.bing.net/th/id/OIP.C1lejPfN1eyZJahXPNf4CwHaK9?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://www.themoviedb.org/t/p/original/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg",
  "https://tse3.mm.bing.net/th/id/OIP.zfaxzqQPD2uX3XVnOp3D8gHaKv?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://image.tmdb.org/t/p/original/8Y7WrRK1iQHEX7UIftBeBMjPjWD.jpg",
  "https://images.justwatch.com/poster/301728736/s718/mad-max-estrada-da-furia.jpg",
  "https://th.bing.com/th/id/R.16795c7446b06808a139572edd06353f?rik=l%2fnbpK43Z7Hndw&riu=http%3a%2f%2fwww.narniaweb.com%2fwp-content%2fuploads%2f2009%2f08%2f8991.jpg&ehk=hiwNT9Dphozi5HrmBJhUrPJI%2bUeFDvcfpHZNg0lwD%2bI%3d&risl=&pid=ImgRaw&r=0",
  "https://assets-prd.ignimgs.com/2022/01/13/uncharted-poster-full-1642086040683.jpg",
  "https://dunenewsnet.com/wp-content/uploads/2021/08/Dune-Movie-Main-Poster.jpg",
];
let movies = Object.entries(catalog).flatMap(([categoriaId, items]) =>
  items.map(([titulo, ano], index) => ({
    id: +categoriaId * 100 + index + 1,
    titulo,
    sinopse: `${titulo} é um clássico imperdível para quem aprecia grandes histórias no cinema.`,
    ano,
    duracao: 90 + index * 5,
    classificacao: index % 3 === 0 ? "14 anos" : "12 anos",
    categoriaId: +categoriaId,
    destaque: index < 2,
    posterUrl: posterUrls[(Number(categoriaId) - 1) * 10 + index] || "",
  })),
);
let users = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@cinevault.com",
    senha: "123456",
    papel: "admin",
  },
];
const rich = (m) => ({
    ...m,
    categoria:
      cats.find((c) => c.id === Number(m.categoriaId))?.nome || "Sem categoria",
  }),
  valid = (b) =>
    b.titulo?.trim().length >= 2 &&
    b.sinopse &&
    Number(b.ano) >= 1888 &&
    Number(b.duracao) > 0 &&
    cats.some((c) => c.id === Number(b.categoriaId));
const auth = (req, res, next) => {
    try {
      req.user = jwt.verify(req.headers.authorization?.split(" ")[1], secret);
      next();
    } catch {
      res
        .status(401)
        .json({ erro: "Acesso não autorizado. Faça login novamente." });
    }
  },
  admin = (req, res, next) =>
    req.user?.papel === "admin"
      ? next()
      : res
          .status(403)
          .json({ erro: "Apenas administradores podem gerenciar filmes." });
const login = (req, res) => {
  const u = users.find(
    (x) => x.email === req.body.email && x.senha === req.body.senha,
  );
  if (!u) return res.status(401).json({ erro: "E-mail ou senha inválidos." });
  const usuario = { id: u.id, nome: u.nome, email: u.email, papel: u.papel };
  res.json({ token: jwt.sign(usuario, secret, { expiresIn: "8h" }), usuario });
};
const cadastro = (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha || senha.length < 6)
    return res
      .status(400)
      .json({
        erro: "Informe nome, e-mail e senha com ao menos 6 caracteres.",
      });
  if (users.some((u) => u.email === email))
    return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
  const u = { id: users.length + 1, nome, email, senha, papel: "usuario" };
  users.push(u);
  const usuario = { id: u.id, nome, email, papel: u.papel };
  res
    .status(201)
    .json({ token: jwt.sign(usuario, secret, { expiresIn: "8h" }), usuario });
};
const listar = (_, res) => res.json(movies.map(rich)),
  buscar = (req, res) => {
    const m = movies.find((x) => x.id === +req.params.id);
    m
      ? res.json(rich(m))
      : res.status(404).json({ erro: "Filme não encontrado." });
  };
const criar = (req, res) => {
  if (!valid(req.body))
    return res.status(400).json({ erro: "Dados do filme inválidos." });
  const m = {
    ...req.body,
    id: Math.max(0, ...movies.map((x) => x.id)) + 1,
    categoriaId: +req.body.categoriaId,
    ano: +req.body.ano,
    duracao: +req.body.duracao,
    destaque: !!req.body.destaque,
  };
  movies.push(m);
  res.status(201).json(rich(m));
};
const atualizar = (req, res) => {
  const i = movies.findIndex((x) => x.id === +req.params.id);
  if (i < 0) return res.status(404).json({ erro: "Filme não encontrado." });
  if (!valid(req.body))
    return res.status(400).json({ erro: "Dados do filme inválidos." });
  movies[i] = {
    ...movies[i],
    ...req.body,
    categoriaId: +req.body.categoriaId,
    ano: +req.body.ano,
    duracao: +req.body.duracao,
    destaque: !!req.body.destaque,
  };
  res.json(rich(movies[i]));
};
const excluir = (req, res) => {
  const i = movies.findIndex((x) => x.id === +req.params.id);
  if (i < 0) return res.status(404).json({ erro: "Filme não encontrado." });
  movies.splice(i, 1);
  res.status(204).end();
};
module.exports = {
  auth,
  admin,
  login,
  cadastro,
  categorias: (_, res) => res.json(cats),
  listar,
  buscar,
  criar,
  atualizar,
  excluir,
};
