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

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("cv_token") || "");
  const [user, setUser] = useState(() => readStoredUser());

  const isAdmin = user?.role === "admin" || user?.papel === "admin";

  const login = async (email, senha) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ Email: email, Senha: senha }),
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
      body: JSON.stringify({ Nome: nome, Email: email, Senha: senha }),
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
