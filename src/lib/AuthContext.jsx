import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) cargarRol(data.session.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) cargarRol(newSession.user.id);
      else {
        setRol(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function cargarRol(userId) {
    const { data } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", userId)
      .single();
    setRol(data?.rol || "viewer");
    setLoading(false);
  }

  const value = {
    session,
    rol, // "admin" | "owner" | "viewer"
    loading,
    puedeEditar: rol === "admin" || rol === "owner",
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
