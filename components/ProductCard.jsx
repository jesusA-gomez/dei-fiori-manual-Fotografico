import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import PhotoUploader from "./PhotoUploader";

export default function ProductCard({ producto, marcaInicial, fotoInicial }) {
  const { rol, puedeEditar } = useAuth();
  const [marca, setMarca] = useState(
    marcaInicial || { principal: "", alternativa_1: "", alternativa_2: "", notas: "" }
  );
  const [foto, setFoto] = useState(fotoInicial || null);
  const [guardado, setGuardado] = useState(false);

  function handleChange(campo, valor) {
    setMarca((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleBlur() {
    if (!puedeEditar) return;
    await supabase.from("marcas").upsert({
      producto_id: producto.id,
      principal: marca.principal,
      alternativa_1: marca.alternativa_1,
      alternativa_2: marca.alternativa_2,
      notas: marca.notas,
    });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1500);
  }

  return (
    <div className={`product-card ${!puedeEditar ? "role-readonly" : ""}`}>
      <div className="product-photo">
        {foto ? (
          <img src={foto} alt={producto.nombre} />
        ) : (
          <div className="empty">Sin foto todavía</div>
        )}
      </div>
      <div className="product-body">
        <h4>{producto.nombre}</h4>

        <div className="brand-row">
          <span className="label">Principal</span>
          <input
            value={marca.principal}
            onChange={(e) => handleChange("principal", e.target.value)}
            onBlur={handleBlur}
            placeholder="—"
          />
        </div>
        <div className="brand-row">
          <span className="label">Alternativa 1</span>
          <input
            value={marca.alternativa_1}
            onChange={(e) => handleChange("alternativa_1", e.target.value)}
            onBlur={handleBlur}
            placeholder="—"
          />
        </div>
        <div className="brand-row">
          <span className="label">Alternativa 2</span>
          <input
            value={marca.alternativa_2}
            onChange={(e) => handleChange("alternativa_2", e.target.value)}
            onBlur={handleBlur}
            placeholder="—"
          />
        </div>
        <div className="brand-row">
          <span className="label">Notas</span>
          <input
            value={marca.notas}
            onChange={(e) => handleChange("notas", e.target.value)}
            onBlur={handleBlur}
            placeholder="—"
          />
        </div>

        {guardado && <div className="saved-flag">Guardado</div>}

        {rol === "admin" && (
          <PhotoUploader
            productoId={producto.id}
            categoriaSlug={producto.categoria_slug}
            onUploaded={setFoto}
          />
        )}
      </div>
    </div>
  );
}
