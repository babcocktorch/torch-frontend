"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ADMIN_PAGES } from "./constants";
import { AdminUser, AuthResponse } from "./types";

type AuthContextType = {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  setup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session via HTTP-only cookie on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setToken("cookie-session"); // Dummy token to indicate auth state
          setAdmin(data.data.admin);
        } else {
          setToken(null);
          setAdmin(null);
        }
      } catch (error) {
        console.error("Failed to fetch admin:", error);
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            return { error: "Invalid email or password" };
          }
          if (response.status === 403) {
            return {
              error: "Account not activated. Please complete setup first.",
            };
          }
          return { error: data.message || "Login failed" };
        }

        const authData = data as AuthResponse;
        setToken("cookie-session");
        setAdmin(authData.data.admin);
        router.push(ADMIN_PAGES.dashboard);
        return {};
      } catch (error) {
        console.error("Login error:", error);
        return { error: "An unexpected error occurred. Please try again." };
      }
    },
    [router],
  );

  const setup = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        const response = await fetch("/api/auth/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            return {
              error: "Email not allowlisted. Contact an administrator.",
            };
          }
          if (response.status === 400) {
            return {
              error:
                data.message || "Account already activated or invalid password",
            };
          }
          return { error: data.message || "Setup failed" };
        }

        const authData = data as AuthResponse;
        setToken("cookie-session");
        setAdmin(authData.data.admin);
        router.push(ADMIN_PAGES.dashboard);
        return {};
      } catch (error) {
        console.error("Setup error:", error);
        return { error: "An unexpected error occurred. Please try again." };
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setToken(null);
    setAdmin(null);
    router.push(ADMIN_PAGES.login);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        isAuthenticated: !!token && !!admin,
        login,
        setup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
