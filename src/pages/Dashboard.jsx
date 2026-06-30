import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import seed from "../data/seed.json";

export default function Dashboard() {
  const [categorias, setCategorias] = useState([]);
  const [conteoFotos, setConteoFotos] = useState({});
  const [conteoProductos, setConteoProductos] = useState({});

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const { data: cats } = await supabase
      .from("categorias")
      .select("*")
      .order("orden");

    const { data: productos } = await supabase.from("productos").select("id, categoria_slug");
    const { data: fotos } = await supabase.from("fotos").select("producto_id");

    setCategorias(cats?.length ? cats : seed.categorias);

    const porCategoria = {};
    (productos || seed.productos).forEach((p) => {
      porCategoria[p.categoria_slug] = (porCategoria[p.categoria_slug] || 0) + 1;
    });
    setConteoProductos(porCategoria);

    const idsConFoto = new Set((fotos || []).map((f) => f.producto_id));
    const fotosPorCategoria = {};
    (productos || seed.productos).forEach((p) => {
      if (idsConFoto.has(p.id)) {
        fotosPorCategoria[p.categoria_slug] = (fotosPorCategoria[p.categoria_slug] || 0) + 1;
      }
    });
    setConteoFotos(fotosPorCategoria);
  }

  return (
    <>
      <Navbar />
      <div className="shell">
        <div className="page-head">
          <div className="eyebrow">Control de calidad de proveedores</div>
          <h2>Marcas aprobadas por categoría</h2>
        </div>
        <div className="category-grid">
          {categorias.map((cat) => (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="category-card">
              <div className="count">
                {conteoFotos[cat.slug] || 0} / {conteoProductos[cat.slug] || 0} con foto
              </div>
              <h3>{cat.nombre}</h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
