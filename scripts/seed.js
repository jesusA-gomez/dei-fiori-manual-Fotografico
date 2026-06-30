// Ejecutar UNA SOLA VEZ para cargar las 12 categorías y 177 productos
// extraídos del manual original. Necesita la Service Role Key (no la anon).
//
// Uso:
//   1. Copiá .env.example a .env y completá SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
//   2. npm install
//   3. npm run seed

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import "dotenv/config";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(url, key);
const seed = JSON.parse(fs.readFileSync("./src/data/seed.json", "utf-8"));

async function run() {
  console.log(`Cargando ${seed.categorias.length} categorías...`);
  const { error: errCat } = await supabase.from("categorias").upsert(seed.categorias);
  if (errCat) throw errCat;

  console.log(`Cargando ${seed.productos.length} productos...`);
  const { error: errProd } = await supabase.from("productos").upsert(seed.productos);
  if (errProd) throw errProd;

  console.log("Listo. Categorías y productos cargados en Supabase.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
