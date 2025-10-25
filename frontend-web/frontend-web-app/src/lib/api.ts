// src/lib/api.ts

// ===== Base URL (usa NEXT_PUBLIC_API_URL; si no, fallback a backend local 3001) =====
const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").trim();
const BASE_URL = RAW_BASE.replace(/\/+$/, "");

// ===== Helpers =====
function qs(params?: Record<string, any>) {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return entries.length ? `?${new URLSearchParams(entries as any).toString()}` : "";
}

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

// ===== Tipos básicos =====
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
  HoraInicio?: string;
  HoraFinal?: string;
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

// ===== Tipos para búsqueda por teléfono =====
export type ReservaTelefono = {
  idTransaccion: string;
  clave: string;
  sede: string;
  ubicacion: string;
  ciudad: string;
  fechaInicio: string | null;
  fechaSalida: string | null;
  horaCheckIn: string | null;
  hombres: number | null;
  mujeres: number | null;
  status: "pendiente" | "en_estancia" | "finalizada" | "confirmada" | "cancelada";
  telefono?: string | null;
  beneficiario?: string | null;
};

// ===== Tipos Reseñas (web/resenas) =====
export type ResenaWeb = {
  id: number;
  estrellas: number;
  comentario: string;
  idSede?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

// ===== Tipos Cupos (web/cupos) =====
export type Cupo = {
  id: number;
  sede: string;
  servicio: string;
  capacidad: number;
  precio: number;
  horainicio: string; // "HH:MM:SS"
  horafinal: string;  // "HH:MM:SS"
  estatus: boolean;
};

// ===== Tipos Dashboard =====
export type DashboardWeb = {
  fecha: string;
  totalReservas: number;
  serviciosActivos: number;
  sedesActivas: number;
  resumenPorSede: Array<{
    sedeid: number | string;
    sede: string;
    ciudad: string;
    reservas: number;
  }>;
};

// ======================================================================
// ==========================   CLIENTE API   ============================
// ======================================================================

export const api = {
  // -------- Usuarios --------
  crearUsuario: (b: Partial<Usuario>) =>
    http(`/api/usuarios/crear`, { method: "POST", body: JSON.stringify(b) }),
  getUsuarios: (f?: any) => http<Usuario[]>(`/api/usuarios/obtener${qs(f)}`),
  getUsuarioById: (id: string | number) => http<Usuario>(`/api/usuarios/obtener/${id}`),
  updateUsuario: (id: string | number, b: Partial<Usuario>) =>
    http(`/api/usuarios/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteUsuarios: (ids: Array<string | number>) =>
    http(`/api/usuarios/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteUsuario: (id: string | number) => api.deleteUsuarios([id]),

  // ===================== Sedes / Servicios / Asignaciones (WEB) =====================
  // ¡OJO! Estas rutas usan /web/sedeservicio/* (sin ".routes")
  getSedes: () =>
    http<ApiResponse<any[]>>(`/web/sedeservicio/sedes`),

  getServicios: () =>
    http<ApiResponse<any[]>>(`/web/sedeservicio/servicios`),

  // Asignaciones (sedeservicio)
  getSedeServicios: () =>
    http<ApiResponse<any[]>>(`/web/sedeservicio/asignaciones`),

  createSedeServicio: (b: Partial<SedeServicio>) => {
    // Adaptador: acepta IdSede/IdServicio y los traduce a idsede/idservicio
    const payload = {
      idsede: (b as any).idsede ?? b.IdSede,
      idservicio: (b as any).idservicio ?? b.IdServicio,
      descripcion: (b as any).descripcion ?? b.Descripcion ?? null,
      capacidad: (b as any).capacidad ?? b.Capacidad ?? null,
      precio: (b as any).precio ?? b.Precio ?? null,
      horainicio: (b as any).horainicio ?? b.HoraInicio ?? null,
      horafinal: (b as any).horafinal ?? b.HoraFinal ?? null,
      estatus: (b as any).estatus ?? b.Estatus ?? true,
    };
    return http<ApiResponse<[]>>(`/web/sedeservicio/asignaciones`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateSedeServicio: (id: string | number, b: Partial<SedeServicio>) => {
    const payload = {
      idsede: (b as any).idsede ?? b.IdSede ?? null,
      idservicio: (b as any).idservicio ?? b.IdServicio ?? null,
      descripcion: (b as any).descripcion ?? b.Descripcion ?? null,
      capacidad: (b as any).capacidad ?? b.Capacidad ?? null,
      precio: (b as any).precio ?? b.Precio ?? null,
      horainicio: (b as any).horainicio ?? b.HoraInicio ?? null,
      horafinal: (b as any).horafinal ?? b.HoraFinal ?? null,
      estatus: (b as any).estatus ?? b.Estatus ?? null,
    };
    return http<ApiResponse<[]>>(
      `/web/sedeservicio/asignaciones/${encodeURIComponent(String(id))}`,
      { method: "PUT", body: JSON.stringify(payload) }
    );
  },

  deleteSedeServicios: (ids: Array<string | number>) =>
    Promise.all(
      ids.map((id) =>
        http<ApiResponse<[]>>(
          `/web/sedeservicio/asignaciones/${encodeURIComponent(String(id))}`,
          { method: "DELETE" }
        )
      )
    ),

  deleteSedeServicio: (id: string | number) =>
    http<ApiResponse<[]>>(`/web/sedeservicio/asignaciones/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    }),

  // -------- Paradas (API genérica legacy) --------
  getParadas: (f?: any) => http<Parada[]>(`/api/paradas/obtener${qs(f)}`),
  getParadaById: (id: string | number) => http<Parada>(`/api/paradas/obtener/${id}`),
  createParada: (b: Partial<Parada>) =>
    http(`/api/paradas/crear`, { method: "POST", body: JSON.stringify(b) }),
  updateParada: (id: string | number, b: Partial<Parada>) =>
    http(`/api/paradas/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteParadas: (ids: Array<string | number>) =>
    http(`/api/paradas/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),
  deleteParada: (id: string | number) => api.deleteParadas([id]),

  // -------- Paradas (WEB) --------
  getParadasWeb: () =>
    http<ApiResponse<any[]>>(`/web/parada`),

  getParadasBySedeWeb: (idSede: number | string) =>
    http<ApiResponse<any[]>>(`/web/parada/sede/${encodeURIComponent(String(idSede))}`),

  createParadaWeb: (body: {
    nombre: string;
    descripcion?: string | null;
    ubicacion?: string | null;
    estatus?: boolean;
    idsede: number;
  }) =>
    http<ApiResponse<any>>(`/web/parada`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateParadaWeb: (
    id: number | string,
    body: Partial<{
      nombre: string;
      descripcion: string | null;
      ubicacion: string | null;
      estatus: boolean;
      idsede: number;
    }>
  ) =>
    http<ApiResponse<any>>(`/web/parada/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteParadaWeb: (id: number | string) =>
    http<ApiResponse<any>>(`/web/parada/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    }),

  // -------- Rutas --------
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

  // -------- Beneficiarios --------
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
    http(`/api/beneficiarios/eliminar/${encodeURIComponent(tel)}/${encodeURIComponent(tx)}`, {
      method: "DELETE",
    }),

  // -------- Reservas (CRUD base) --------
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

  // --- Reservas (web) ---
  getReservasByTelefono: (tel: string) =>
    http<ApiResponse<ReservaTelefono[]>>(`/web/reservas/${encodeURIComponent(tel)}`),
  getReservasAll: () =>
    http<ApiResponse<ReservaTelefono[]>>(`/web/reservas`),
  getReservasFin: () =>
    http<ApiResponse<ReservaTelefono[]>>(`/web/reservas/fin`),
  deleteReservaWeb: (idTransaccion: string) =>
    http<ApiResponse<[]>>(`/web/reservas/${encodeURIComponent(idTransaccion)}`, {
      method: "DELETE",
    }),

  // -------- Reseñas (web) --------
  getResenasWeb: (params?: { idSede?: number }) =>
    http<ApiResponse<ResenaWeb[]>>(
      `/web/resenas${params?.idSede ? `?idSede=${encodeURIComponent(params.idSede)}` : ""}`
    ),

  // -------- Servicio (web) – pantalla Servicios --------
  getServiciosWeb: () =>
    http<ApiResponse<Servicio[]>>(`/web/servicio`),
  searchServiciosWeb: (q: string) =>
    http<ApiResponse<Servicio[]>>(
      `/web/servicio/search${q ? `?q=${encodeURIComponent(q)}` : ""}`
    ),
  getServicioWebById: (id: number | string) =>
    http<ApiResponse<Servicio>>(`/web/servicio/id/${encodeURIComponent(String(id))}`),
  createServicioWeb: (body: Partial<Servicio>) =>
    http<ApiResponse<Servicio>>(`/web/servicio`, { method: "POST", body: JSON.stringify(body) }),
  updateServicioWeb: (id: number | string, body: Partial<Servicio>) =>
    http<ApiResponse<Servicio>>(`/web/servicio/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteServicioWeb: (id: number | string) =>
    http<ApiResponse<[]>>(`/web/servicio/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    }),

  // -------- Compras --------
  createCompra: (b: Partial<Compra>) =>
    http(`/api/compras/crear`, { method: "POST", body: JSON.stringify(b) }),
  getCompras: (f?: any) => http<Compra[]>(`/api/compras/obtener${qs(f)}`),
  getCompraById: (id: string | number) => http<Compra>(`/api/compras/obtener/${id}`),
  updateCompra: (id: string | number, b: Partial<Compra>) =>
    http(`/api/compras/modificar/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  deleteCompras: (ids: Array<string | number>) =>
    http(`/api/compras/eliminar`, { method: "DELETE", body: JSON.stringify({ Ids: ids }) }),

  // -------- Cupos (web) --------
  getCupos: () => http<ApiResponse<Cupo[]>>(`/web/cupos`),
  updateCupo: (id: number, body: Partial<Cupo>) =>
    http<ApiResponse<[]>>(`/web/cupos/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  // -------- Dashboard (web) --------
  getDashboard: (fecha?: string) =>
    http<ApiResponse<DashboardWeb>>(
      `/web/dashboard${fecha ? `?fecha=${encodeURIComponent(fecha)}` : ""}`
    ),
};
