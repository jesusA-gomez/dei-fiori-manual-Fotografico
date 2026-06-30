import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PhotoUploader({ productoId, categoriaSlug, onUploaded }) {
  const [subiendo, setSubiendo] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    const ext = file.name.split(".").pop();
    const path = `${categoriaSlug}/${productoId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("fotos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert("No se pudo subir la foto: " + uploadError.message);
      setSubiendo(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("fotos").getPublicUrl(path);
    const url = publicUrlData.publicUrl;

    await supabase
      .from("fotos")
      .upsert({ producto_id: productoId, url, actualizado_en: new Date().toISOString() });

    setSubiendo(false);
    onUploaded(url);
  }

  return (
    <div className="upload-row">
      <label>
        {subiendo ? "Subiendo..." : "Subir / reemplazar foto"}
        <input type="file" accept="image/*" onChange={handleFile} disabled={subiendo} />
      </label>
    </div>
  );
}
