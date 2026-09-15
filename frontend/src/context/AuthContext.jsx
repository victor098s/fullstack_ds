import { createContext, useContext, useState } from "react";
import { request } from "../api/api";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("cv_user") || "null");
  } catch {
    return null;
  }
};

const tokenExpirado = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const readStoredToken = () => {
  const storedToken = localStorage.getItem("cv_token") || "";

  if (!storedToken || tokenExpirado(storedToken)) {
    localStorage.removeItem("cv_token");
    localStorage.removeItem("cv_user");
    return "";
  }

  return storedToken;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(() => (localStorage.getItem("cv_token") ? readStoredUser() : null));

  const isAdmin = user?.role === "admin" || user?.papel === "admin";

  const login = async (email, senha) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });

    const authToken = data.token;
    const authUser = data.usuario || {
      id: data.id,
      nome: data.nome,
      email: data.email,
      role: data.role || data.papel || "user",
    };

    if (!authToken || !authUser) {
      throw new Error("Resposta inválida do servidor.");
    }

    localStorage.setItem("cv_token", authToken);
    localStorage.setItem("cv_user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    return authUser;
  };

  const register = async (nome, email, senha) => {
    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    });
  };

  const logout = () => {
    localStorage.removeItem("cv_token");
    localStorage.removeItem("cv_user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAdmin,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
