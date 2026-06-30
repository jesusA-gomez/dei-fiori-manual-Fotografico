import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import seed from "../data/seed.json";

export default function CategoryPage() {
  const { slug } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState({});
  const [fotos, setFotos] = useState({});

  useEffect(() => {
    cargar();
  }, [slug]);

  async function cargar() {
    const cat = seed.categorias.find((c) => c.slug === slug);
    setCategoria(cat);

    const { data: prods } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria_slug", slug);

    const lista = prods?.length ? prods : seed.productos.filter((p) => p.categoria_slug === slug);
    setProductos(lista);

    const ids = lista.map((p) => p.id);
    if (ids.length === 0) return;

    const { data: marcasData } = await supabase.from("marcas").select("*").in("producto_id", ids);
    const mapaMarcas = {};
    (marcasData || []).forEach((m) => (mapaMarcas[m.producto_id] = m));
    setMarcas(mapaMarcas);

    const { data: fotosData } = await supabase.from("fotos").select("*").in("producto_id", ids);
    const mapaFotos = {};
    (fotosData || []).forEach((f) => (mapaFotos[f.producto_id] = f.url));
    setFotos(mapaFotos);
  }

  return (
    <>
      <Navbar />
      <div className="shell">
        <div className="page-head">
          <div className="crumb">
            <Link to="/">Categorías</Link> / {categoria?.nombre || slug}
          </div>
          <h2>{categoria?.nombre || slug}</h2>
        </div>
        <div className="product-grid">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              marcaInicial={marcas[p.id]}
              fotoInicial={fotos[p.id]}
            />
          ))}
        </div>
      </div>
    </>
  );
}
