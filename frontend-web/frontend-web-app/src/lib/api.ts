// src/lib/api.ts

// ===== Base URL (usa rewrites; si no, define NEXT_PUBLIC_API_URL) =====
const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
// sin slash final
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

// ===== Helpers =====
function qs(params?: Record<string, any>) {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return entries.length
    ? `?${new URLSearchParams(entries as any).toString()}`
    : "";
}

// asegura "/" y evita dobles slashes, funciona con BASE_URL vacío
function buildUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${p}` || p;
  if (typeof window !== "undefined") console.log("[API] ->", url);
  return url;
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${url} :: ${text || res.statusText}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ===== Tipos básicos (ajústalos si tu backend devuelve otros campos) =====
export type Sede = {
  Id?: number | string;
  Nombre?: string;
  Ciudad?: string;
  Direccion?: string;
  Telefono?: string;
  Estatus?: boolean;
};

export type Servicio = {
  Id?: number | string;
  Nombre?: string;
  Descripcion?: string;
  Estatus?: boolean;
};

export type SedeServicio = {
  Id?: number | string;
  IdSede?: number | string;
  IdServicio?: number | string;
  Descripcion?: string;
  Capacidad?: number;
  Precio?: number;
  HoraInicio?: string; // "08:00"
  HoraFinal?: string;  // "14:00"
  Estatus?: boolean;
};

export type Parada = { Id?: number | string; Nombre?: string; Estatus?: boolean };
export type Ruta = {
  Id?: number | string;
  IdSedeServicio?: number | string;
  Orden?: number;
  Estatus?: boolean;
};
export type Usuario = {
  Id?: number | string;
  Email?: string;
  Telefono?: string;
  Nombre?: string;
  Apellido?: string;
  IdTipoUsuario?: number;
};
export type Beneficiario = { Telefono: string; IdTransaccion: string; Nombre?: string };
export type Reserva = { IdTransaccion: string; Estado?: string };
export type Compra = { Id?: number | string };

// ======================================================================
// ==========================   CLIENTE API   ============================
// ======================================================================

export const api = {
  // -------- Usuarios (por si los usas después) --------
  crearUsuario: (b: Partial<Usuario>) =>
    http(`/api/usuarios/crear`, { method: "POST", body: JSON.stringify(b) }),
  getUsuarios: (f?: any) => http<Usuario[]>(`/api/usuarios/obtener${qs(f)}`),
  getUsuarioById: (id: string | number) => http<Usuario>(`/api/usuarios/obtener/${id}`),
  updateUsuario: (id: string | number, b: Partial<Usuario>) =>
    http(`/api/usuarios/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteUsuarios: (ids: Array<string | number>) =>
    http(`/api/usuarios/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteUsuario: (id: string | number) => api.deleteUsuarios([id]),

  // -------- Sedes --------
  getSedes: (f?: any) => http<Sede[]>(`/api/sedes/obtener${qs(f)}`),
  getSedeById: (id: string | number) => http<Sede>(`/api/sedes/obtener/${id}`),
  createSede: (b: Partial<Sede>) =>
    http(`/api/sedes/crear`, { method: "POST", body: JSON.stringify(b) }),
  updateSede: (id: string | number, b: Partial<Sede>) =>
    http(`/api/sedes/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteSedes: (ids: Array<string | number>) =>
    http(`/api/sedes/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteSede: (id: string | number) => api.deleteSedes([id]),

  // -------- Servicios --------
  getServicios: (f?: any) => http<Servicio[]>(`/api/servicios/obtener${qs(f)}`),
  getServicioById: (id: string | number) => http<Servicio>(`/api/servicios/obtener/${id}`),
  createServicio: (b: Partial<Servicio>) =>
    http(`/api/servicios/crear`, { method: "POST", body: JSON.stringify(b) }),
  updateServicio: (id: string | number, b: Partial<Servicio>) =>
    http(`/api/servicios/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  // IMPORTANTE: deleteMany espera {Ids:[...]}
  deleteServicios: (ids: Array<string | number>) =>
    http(`/api/servicios/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteServicio: (id: string | number) => api.deleteServicios([id]),

  // -------- Sede-Servicios (PLURAL en el path) --------
  getSedeServicios: (f?: any) =>
    http<SedeServicio[]>(`/api/sede-servicios/obtener${qs(f)}`),
  getSedeServicioById: (id: string | number) =>
    http<SedeServicio>(`/api/sede-servicios/obtener/${id}`),
  createSedeServicio: (b: Partial<SedeServicio>) =>
    http(`/api/sede-servicios/crear`, { method: "POST", body: JSON.stringify(b) }),
  updateSedeServicio: (id: string | number, b: Partial<SedeServicio>) =>
    http(`/api/sede-servicios/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteSedeServicios: (ids: Array<string | number>) =>
    http(`/api/sede-servicios/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteSedeServicio: (id: string | number) => api.deleteSedeServicios([id]),

  // -------- Paradas (por si luego las vuelves a usar) --------
  getParadas: (f?: any) => http<Parada[]>(`/api/paradas/obtener${qs(f)}`),
  getParadaById: (id: string | number) => http<Parada>(`/api/paradas/obtener/${id}`),
  createParada: (b: Partial<Parada>) =>
    http(`/api/paradas/crear`, { method: "POST", body: JSON.stringify(b) }),
  updateParada: (id: string | number, b: Partial<Parada>) =>
    http(`/api/paradas/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteParadas: (ids: Array<string | number>) =>
    http(`/api/paradas/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteParada: (id: string | number) => api.deleteParadas([id]),

  // -------- Rutas (nota: tu backend tiene un PUT /modificar sin :id para sincronizar) --------
  getRutas: (f?: { IdSedeServicio?: string | number; Estatus?: boolean; Orden?: number }) =>
    http<Ruta[]>(`/api/rutas/obtener${qs(f)}`),
  getRutaById: (id: string | number) => http<Ruta>(`/api/rutas/obtener/${id}`),
  createRuta: (b: Partial<Ruta>) =>
    http(`/api/rutas/crear`, { method: "POST", body: JSON.stringify(b) }),
  updateRuta: (id: string | number, b: Partial<Ruta>) =>
    http(`/api/rutas/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  syncRuta: (b: any) => http(`/api/rutas/modificar`, { method: "PUT", body: JSON.stringify(b) }),
  deleteRutas: (ids: Array<string | number>) =>
    http(`/api/rutas/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteRuta: (id: string | number) => api.deleteRutas([id]),

  // -------- Beneficiarios (clave compuesta) --------
  createBeneficiario: (b: Partial<Beneficiario>) =>
    http(`/api/beneficiarios/crear`, { method: "POST", body: JSON.stringify(b) }),
  getBeneficiarios: (f?: any) => http<Beneficiario[]>(`/api/beneficiarios/obtener${qs(f)}`),
  getBeneficiario: (tel: string, tx: string) =>
    http<Beneficiario>(
      `/api/beneficiarios/obtener/${encodeURIComponent(tel)}/${encodeURIComponent(tx)}`
    ),
  updateBeneficiario: (tel: string, tx: string, b: Partial<Beneficiario>) =>
    http(`/api/beneficiarios/modificar/${encodeURIComponent(tel)}/${encodeURIComponent(tx)}`, {
      method: "PUT",
      body: JSON.stringify(b),
    }),
  deleteBeneficiario: (tel: string, tx: string) =>
    http(
      `/api/beneficiarios/eliminar/${encodeURIComponent(tel)}/${encodeURIComponent(tx)}`,
      { method: "DELETE" }
    ),

  // -------- Reservas --------
  createReserva: (b: Partial<Reserva>) =>
    http(`/api/reservas/crear`, { method: "POST", body: JSON.stringify(b) }),
  getReservas: (f?: any) => http<Reserva[]>(`/api/reservas/obtener${qs(f)}`),
  getReserva: (tx: string) => http<Reserva>(`/api/reservas/obtener/${encodeURIComponent(tx)}`),
  updateReserva: (tx: string, b: Partial<Reserva>) =>
    http(`/api/reservas/modificar/${encodeURIComponent(tx)}`, {
      method: "PUT",
      body: JSON.stringify(b),
    }),
  deleteReservas: (ids: string[]) =>
    http(`/api/reservas/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),

  // -------- Compras --------
  createCompra: (b: Partial<Compra>) =>
    http(`/api/compras/crear`, { method: "POST", body: JSON.stringify(b) }),
  getCompras: (f?: any) => http<Compra[]>(`/api/compras/obtener${qs(f)}`),
  getCompraById: (id: string | number) => http<Compra>(`/api/compras/obtener/${id}`),
  updateCompra: (id: string | number, b: Partial<Compra>) =>
    http(`/api/compras/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteCompras: (ids: Array<string | number>) =>
    http(`/api/compras/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteCompra: (id: string | number) => api.deleteCompras([id]),
};
