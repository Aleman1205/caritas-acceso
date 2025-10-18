'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, type Servicio } from '@/lib/api';

// ---------------------------
// Helpers
// ---------------------------
type ServicioRaw = {
  Id?: number | string;
  Nombre?: string;
  Descripcion?: string;
  Estatus?: boolean | 0 | 1;
};

function toArray<T = unknown>(x: any): T[] {
  if (Array.isArray(x)) return x as T[];
  if (x && Array.isArray(x.data)) return x.data as T[];
  return [];
}

function asNumberId(v: string | number | undefined | null) {
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

type ServicioForm = {
  Id?: number;
  Nombre: string;
  Descripcion?: string;
  Estatus: boolean;
};

// ---------------------------
// Página
// ---------------------------
export default function ServiciosPage() {
  // Estado base
  const [rawData, setRawData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtro simple por nombre
  const [q, setQ] = useState('');

  // Form de creación / edición
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);

  // Modo edición
  const [editId, setEditId] = useState<number | null>(null);

  // ---------------------------
  // Fetch
  // ---------------------------
  const load = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const resp = await api.getServicios(); // puede devolver [] o {data:[]}
      setRawData(resp);
    } catch (err: any) {
      setErrorMsg(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ---------------------------
  // Normalización segura (evita .map is not a function)
  // ---------------------------
  const servicios = useMemo<ServicioForm[]>(() => {
    const list = toArray<ServicioRaw>(rawData);
    return list.map((s) => ({
      Id: s?.Id != null ? asNumberId(s.Id) : undefined,
      Nombre: s?.Nombre ?? '',
      Descripcion: s?.Descripcion ?? '',
      Estatus:
        typeof s?.Estatus === 'boolean'
          ? s.Estatus
          : s?.Estatus === 1
          ? true
          : false,
    }));
  }, [rawData]);

  const visibles = useMemo(() => {
    const qn = q.trim().toLowerCase();
    if (!qn) return servicios;
    return servicios.filter((s) => s.Nombre.toLowerCase().includes(qn));
  }, [servicios, q]);

  // ---------------------------
  // Handlers CRUD
  // ---------------------------
  const resetForm = () => {
    setEditId(null);
    setNombre('');
    setDescripcion('');
    setActivo(true);
  };

  const onCreate = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const body: Partial<Servicio> = {
        Nombre: nombre.trim(),
        Descripcion: descripcion.trim() || undefined,
        Estatus: activo,
      };

      if (!body.Nombre) {
        setErrorMsg('El nombre es obligatorio.');
        setLoading(false);
        return;
      }

      await api.createServicio(body);
      resetForm();
      await load();
    } catch (err: any) {
      setErrorMsg(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const onEditStart = (s: ServicioForm) => {
    setEditId(s.Id ?? null);
    setNombre(s.Nombre);
    setDescripcion(s.Descripcion ?? '');
    setActivo(!!s.Estatus);
  };

  const onUpdate = async () => {
    if (editId == null) return;
    try {
      setLoading(true);
      setErrorMsg(null);

      const body: Partial<Servicio> = {
        Nombre: nombre.trim(),
        Descripcion: descripcion.trim() || undefined,
        Estatus: activo,
      };

      if (!body.Nombre) {
        setErrorMsg('El nombre es obligatorio.');
        setLoading(false);
        return;
      }

      await api.updateServicio(editId, body);
      resetForm();
      await load();
    } catch (err: any) {
      setErrorMsg(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const onDeleteOne = async (id?: number) => {
    if (!id) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      // Backend espera DELETE many: { Ids: number[] }
      await api.deleteServicios([id]);
      await load();
    } catch (err: any) {
      setErrorMsg(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Servicios</h1>

      {/* Error banner */}
      {errorMsg && (
        <div className="rounded-md bg-red-900/40 border border-red-600 text-red-200 p-3 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Buscar / refrescar */}
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none"
        />
        <button
          onClick={load}
          disabled={loading}
          className="rounded-md bg-neutral-700 hover:bg-neutral-600 px-4 py-2 disabled:opacity-50"
        >
          Refrescar
        </button>
      </div>

      {/* Form crear / editar */}
      <div className="rounded-lg border border-neutral-700 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Nombre *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del servicio"
              className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              Descripción (opcional)
            </label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-end gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              <span>Activo</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editId == null ? (
            <button
              onClick={onCreate}
              disabled={loading}
              className="rounded-md bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-white disabled:opacity-50"
            >
              Crear
            </button>
          ) : (
            <>
              <button
                onClick={onUpdate}
                disabled={loading}
                className="rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2 text-white disabled:opacity-50"
              >
                Guardar cambios
              </button>
              <button
                onClick={resetForm}
                className="rounded-md bg-neutral-700 hover:bg-neutral-600 px-4 py-2"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-neutral-700">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-900/50">
            <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
              <th className="w-20">Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="w-24">Estado</th>
              <th className="w-48 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-neutral-400">
                  Sin resultados.
                </td>
              </tr>
            )}

            {visibles.map((s) => (
              <tr key={s.Id ?? Math.random()} className="border-t border-neutral-800">
                <td className="px-3 py-2">{s.Id ?? '-'}</td>
                <td className="px-3 py-2">{s.Nombre}</td>
                <td className="px-3 py-2">{s.Descripcion || '-'}</td>
                <td className="px-3 py-2">
                  {s.Estatus ? (
                    <span className="text-emerald-400">Activo</span>
                  ) : (
                    <span className="text-neutral-400">Inactivo</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditStart(s)}
                      className="rounded-md bg-sky-600 hover:bg-sky-500 px-3 py-1 text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeleteOne(s.Id)}
                      className="rounded-md bg-rose-600 hover:bg-rose-500 px-3 py-1 text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-sm text-neutral-400">Cargando / procesando…</div>
      )}
    </div>
  );
}
