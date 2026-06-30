# Manual fotográfico — dei fiori

App para reemplazar el Word: cada producto tiene su foto, marca principal,
2 alternativas y notas de calidad. Vos subís las fotos, las dueñas y el
equipo entran a verlas (o editarlas) desde un link, sin instalar nada.

No hay que comprar ningún dominio. Todo corre gratis sobre dos servicios:

- **Supabase**: guarda los datos, las fotos y los logins (plan gratis).
- **Vercel**: publica la app en un link tipo `dei-fiori-manual.vercel.app` (plan gratis).

Ya viene cargado con las 12 categorías y 177 productos de tu manual original
(`src/data/seed.json`), para que no tengas que tipearlos de nuevo.

---

## 1. Crear el proyecto en Supabase (10 min)

1. Entrá a [supabase.com](https://supabase.com) → crear cuenta gratis → **New project**.
2. Cuando esté listo, ir a **SQL Editor** → pegar todo el contenido de
   `supabase/schema.sql` → **Run**. Esto crea las tablas.
3. Ir a **Storage** → **New bucket** → nombre `fotos` → marcarlo como **Public**.
4. Ir a **Settings → API** y copiar:
   - `Project URL`
   - `anon public key`
   - `service_role key` (no la compartas, es solo para vos)

## 2. Cargar las categorías y productos (una sola vez)

En tu computadora, dentro de esta carpeta:

```bash
npm install
cp .env.example .env
```

Completá en `.env` los valores `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`
que copiaste arriba. Después:

```bash
npm run seed
```

Esto sube las 12 categorías y 177 productos a Supabase.

## 3. Crear los usuarios (vos, las dueñas, empleados)

En Supabase, ir a **Authentication → Users → Add user** y crear uno por
persona (con su email y una contraseña). Después, en **SQL Editor**, por
cada persona ejecutar (reemplazando el UUID que aparece en la lista de
usuarios y el rol):

```sql
insert into usuarios (id, rol) values ('PEGAR-UUID-AQUI', 'admin');  -- vos
insert into usuarios (id, rol) values ('PEGAR-UUID-AQUI', 'owner');  -- dueña
insert into usuarios (id, rol) values ('PEGAR-UUID-AQUI', 'viewer'); -- empleado
```

- `admin`: sube y reemplaza fotos, edita marcas.
- `owner`: edita marcas y notas, no sube fotos.
- `viewer`: solo mira (útil para el mostrador, al hacer un pedido).

No hay pantalla de "registrarse" — la única forma de entrar es con un
usuario que vos creaste. Así nadie de afuera puede entrar.

## 4. Probarlo en tu computadora (opcional)

```bash
npm run dev
```

Abrí el link que muestra la terminal (`http://localhost:5173`).

## 5. Publicarlo gratis, sin dominio

1. Subí esta carpeta a un repositorio de GitHub (gratis).
2. Entrá a [vercel.com](https://vercel.com) → **Add new project** → elegí
   ese repositorio.
3. En **Environment Variables** agregá:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (los mismos valores de tu `.env`, sin la service role key — esa nunca
   va en Vercel).
4. **Deploy**. En un par de minutos te da un link gratis tipo
   `dei-fiori-manual.vercel.app`.

Ese link es el único dato que tenés que compartir con las dueñas y el
equipo. Cada vez que subas una foto nueva desde tu cuenta, se ve al toque
para todos — no hay que volver a publicar nada.

---

## Estructura del proyecto

```
src/
  components/  ProductCard, PhotoUploader, Navbar, RequireAuth
  pages/       Login, Dashboard (categorías), CategoryPage (productos)
  lib/         supabaseClient, AuthContext (maneja sesión y rol)
  data/        seed.json (categorías y productos extraídos del manual)
supabase/
  schema.sql   tablas, permisos y roles
scripts/
  seed.js      carga inicial de categorías/productos
```

## Nota sobre los datos

Se extrajeron 177 productos de las 12 categorías del Word original. En dos
categorías (Verdulería y Almacén) el documento tenía un par de páginas en
blanco dentro de la numeración, así que si falta algún producto puntual se
agrega a mano en la tabla `productos` de Supabase — es una fila simple
(`id`, `categoria_slug`, `nombre`).
