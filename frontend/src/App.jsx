import { useEffect, useState } from "react";
import "./index.css";
import "./CardImages.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Toast } from "./components/Toast";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CatalogPage } from "./pages/CatalogPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { MovieFormPage } from "./pages/MovieFormPage";

import { request, normalizeMovie, buildMoviePayload } from "./api/api";

function MainContent() {
  const { isAuthenticated, token, logout } = useAuth();
  const [route, setRoute] = useState(() => (localStorage.getItem("cv_token") ? "dash" : "home"));
  const [films, setFilms] = useState([]);
  const [cats, setCats] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const navigate = (nextRoute) => {
    setErr("");
    setRoute(nextRoute);
    window.scrollTo(0, 0);
  };

  const flash = (message) => {
    setMsg(message);
    setTimeout(() => setMsg(""), 3000);
  };

  const loadMovies = async () => {
    if (!token) return;
    try {
      const data = await request("/filmes", {}, token);
      const movies = Array.isArray(data) ? data.map(normalizeMovie) : [];
      const uniqueCats = [...new Set(movies.map((m) => m.genero).filter(Boolean))];

      setFilms(movies);
      setCats(uniqueCats);
    } catch (e) {
      if (e.message.includes("Token") || e.message.includes("expirado") || e.message.includes("401") || e.message.includes("403")) {
        logout();
        navigate("login");
        setErr("Sua sessão expirou ou o token é inválido. Por favor, faça login novamente.");
      } else {
        setErr(e.message);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMovies();
    }
  }, [token, isAuthenticated]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    navigate("detail");
  };

  const handleOpenForm = (movie = null) => {
    setSelectedMovie(movie);
    navigate("form");
  };

  const handleSaveMovie = async (movieData) => {
    if (!movieData.nome || !movieData.duracao || !movieData.quantidade || !movieData.ano || !movieData.genero || !movieData.nome_do_diretor) {
      return setErr("Preencha todos os campos obrigatórios do filme.");
    }

    try {
      const payload = buildMoviePayload(movieData);

      await request(
        selectedMovie ? `/filmes/${selectedMovie.id}` : "/filmes",
        {
          method: selectedMovie ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
        token
      );

      flash(selectedMovie ? "Filme atualizado com sucesso." : "Filme cadastrado com sucesso.");
      setSelectedMovie(null);
      await loadMovies();
      navigate("movies");
    } catch (e) {
      if (e.message.includes("Token") || e.message.includes("expirado") || e.message.includes("401") || e.message.includes("403")) {
        logout();
        navigate("login");
        setErr("Sua sessão expirou ou o token é inválido. Por favor, faça login novamente.");
      } else {
        setErr(e.message);
      }
    }
  };

  const handleDeleteMovie = async (movie) => {
    if (!movie || !confirm(`Excluir o filme "${movie.nome}"?`)) return;

    try {
      await request(`/filmes/${movie.id}`, { method: "DELETE" }, token);
      await loadMovies();
      flash("Filme excluído com sucesso.");
      navigate("movies");
    } catch (e) {
      if (e.message.includes("Token") || e.message.includes("expirado") || e.message.includes("401") || e.message.includes("403")) {
        logout();
        navigate("login");
        setErr("Sua sessão expirou ou o token é inválido. Por favor, faça login novamente.");
      } else {
        setErr(e.message);
      }
    }
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (route === "login") {
        return <LoginPage navigate={navigate} flash={flash} setErr={setErr} />;
      }
      if (route === "register") {
        return <RegisterPage navigate={navigate} flash={flash} setErr={setErr} />;
      }
      return <HomePage navigate={navigate} />;
    }

    switch (route) {
      case "dash":
        return (
          <DashboardPage
            films={films}
            cats={cats}
            navigate={navigate}
            onSelectMovie={handleSelectMovie}
            onAddMovie={() => handleOpenForm(null)}
          />
        );
      case "movies":
        return (
          <CatalogPage
            films={films}
            cats={cats}
            onSelectMovie={handleSelectMovie}
            onAddMovie={() => handleOpenForm(null)}
          />
        );
      case "detail":
        return (
          <MovieDetailPage
            movie={selectedMovie}
            navigate={navigate}
            onEdit={handleOpenForm}
            onDelete={handleDeleteMovie}
          />
        );
      case "form":
        return (
          <MovieFormPage
            selectedMovie={selectedMovie}
            onSave={handleSaveMovie}
            navigate={navigate}
          />
        );
      default:
        return (
          <DashboardPage
            films={films}
            cats={cats}
            navigate={navigate}
            onSelectMovie={handleSelectMovie}
            onAddMovie={() => handleOpenForm(null)}
          />
        );
    }
  };

  return (
    <>
      <Header
        currentRoute={route}
        navigate={navigate}
        onAddMovie={() => handleOpenForm(null)}
      />
      <Toast msg={msg} err={err} clearError={() => setErr("")} />
      {renderPage()}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
