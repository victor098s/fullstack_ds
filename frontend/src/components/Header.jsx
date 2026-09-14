import { useAuth } from "../context/AuthContext";

export function Header({ currentRoute, navigate, onAddMovie }) {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header>
      <button className="brand" onClick={() => navigate(isAuthenticated ? "dash" : "home")}>
        ◉ CINEVAULT
      </button>
      <nav>
        {isAuthenticated ? (
          <>
            <button
              className={currentRoute === "dash" ? "active" : ""}
              onClick={() => navigate("dash")}
            >
              Início
            </button>
            <button
              className={currentRoute === "movies" ? "active" : ""}
              onClick={() => navigate("movies")}
            >
              Catálogo
            </button>
            {isAdmin && (
              <button className="primary mini" onClick={onAddMovie}>
                + Filme
              </button>
            )}
            <button className="avatar" title="Sair" onClick={logout}>
              {user?.nome?.[0]?.toUpperCase() || "U"}
            </button>
          </>
        ) : (
          <>
            <button
              className={currentRoute === "login" ? "active" : ""}
              onClick={() => navigate("login")}
            >
              Entrar
            </button>
            <button className="primary mini" onClick={() => navigate("register")}>
              Criar conta
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
