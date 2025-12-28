import React, { createContext, useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // cookie set karne ke liye
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.data.user);
        setAccessToken(data.data.accessToken); // ✅ access token save
      }
      return data;
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Login failed" };
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
     const res = await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      })
      const response = await res.json()
      console.log('res::',res)
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setAccessToken(null);
  };

  // ✅ Auto-login with refresh token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: refresh token -> new access token
        const refreshRes = await fetch("http://localhost:8000/api/v1/users/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const { accessToken } = await refreshRes.json();
        setAccessToken(accessToken);

        // Step 2: get current user with new access token
        const res = await fetch("http://localhost:8000/api/v1/users/current-user", {
          method: "GET",
          credentials: "include",
        });

        const response = await res.json();
        if (response?.success) {
          setUser(response.data);
          console.log('response:',response.data)
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {loading?<Loading/>:children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
