import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/categoria/:slug"
          element={
            <RequireAuth>
              <CategoryPage />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
