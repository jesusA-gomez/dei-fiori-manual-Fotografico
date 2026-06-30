-- Ejecutar en el SQL Editor de Supabase (una sola vez)

create table if not exists categorias (
  slug text primary key,
  nombre text not null,
  orden int not null
);

create table if not exists productos (
  id int primary key,
  categoria_slug text references categorias(slug),
  nombre text not null
);

create table if not exists marcas (
  producto_id int primary key references productos(id),
  principal text default '',
  alternativa_1 text default '',
  alternativa_2 text default '',
  notas text default ''
);

create table if not exists fotos (
  producto_id int primary key references productos(id),
  url text not null,
  actualizado_en timestamptz default now()
);

-- rol: 'admin' (vos, subís fotos y editás todo)
-- rol: 'owner' (dueñas, ven todo y pueden editar marcas)
-- rol: 'viewer' (empleados, solo ven)
create table if not exists usuarios (
  id uuid primary key references auth.users(id),
  rol text not null default 'viewer'
);

-- Seguridad: todos los que tengan sesión pueden leer.
-- Solo admin/owner pueden escribir en marcas. Solo admin puede escribir fotos.
alter table categorias enable row level security;
alter table productos enable row level security;
alter table marcas enable row level security;
alter table fotos enable row level security;
alter table usuarios enable row level security;

create policy "leer categorias" on categorias for select using (auth.role() = 'authenticated');
create policy "leer productos" on productos for select using (auth.role() = 'authenticated');
create policy "leer marcas" on marcas for select using (auth.role() = 'authenticated');
create policy "leer fotos" on fotos for select using (auth.role() = 'authenticated');
create policy "leer mi usuario" on usuarios for select using (auth.uid() = id);

create policy "escribir marcas admin u owner" on marcas for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol in ('admin', 'owner'))
);

create policy "escribir fotos admin" on fotos for all using (
  exists (select 1 from usuarios where id = auth.uid() and rol = 'admin')
);

-- Después de crear un usuario en Authentication > Users, agregalo aquí con su rol:
-- insert into usuarios (id, rol) values ('UUID-DEL-USUARIO', 'admin');
-- insert into usuarios (id, rol) values ('UUID-DE-LA-DUEÑA', 'owner');
-- insert into usuarios (id, rol) values ('UUID-DEL-EMPLEADO', 'viewer');
