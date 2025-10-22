'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, type Sede } from '@/lib/api';

type ParadaRow = {
  Id: number;
  Nombre: string;
  Descripcion?: string | null;
  Ubicacion?: string | null;
  Estatus?: boolean;
  IdSede?: number | null;
};

function toArray<T>(x: any): T[] {
  if (!x) return [];
  if (Array.isArray(x)) return x as T[];
  if (Array.isArray(x?.data)) return x.data as T[];
  return [];
}

export default function SolicitudesTransportePage() {
  // datos
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [rows, setRows] = useState<ParadaRow[]>([]);

  // ui
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [q, setQ] = useState('');

  // form
  const [editId, setEditId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [estatus, setEstatus] = useState(true);
  const [idSede, setIdSede] = useState<number | ''>('');

  // carga
  async function cargar() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [sd, pd] = await Promise.all([
        api.getSedes(),               // ya lo tienes por otras pantallas
        api.getParadasWeb(),          // NUEVO método web (bloque de api.ts abajo)
      ]);

      setSedes(toArray<Sede>(sd));

      const norm = toArray<any>(pd).map((p) => ({
        Id: Number(p.id ?? p.Id ?? 0),
        Nombre: String(p.nombre ?? p.Nombre ?? ''),
        Descripcion: p.descripcion ?? null,
        Ubicacion: p.ubicacion ?? null,
        Estatus: typeof p.estatus === 'boolean' ? p.estatus : Boolean(p.estatus ?? p.Estatus),
        IdSede: p.idsede != null ? Number(p.idsede) : (p.IdSede ?? null),
      })) as ParadaRow[];

      setRows(norm);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  // filtro por nombre en cliente (el backend no tiene search)
  const filas = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.trim().toLowerCase();
    return rows.filter((r) => r.Nombre.toLowerCase().includes(s));
  }, [rows, q]);

  function limpiarForm() {
    setEditId(null);
    setNombre('');
    setDescripcion('');
    setUbicacion('');
    setEstatus(true);
    setIdSede('');
  }

  async function handleCreate() {
    if (!nombre.trim()) return setErrorMsg('El nombre es obligatorio.');
    const sedeNum = typeof idSede === 'number' ? idSede : Number(idSede || 0);
    if (!sedeNum) return setErrorMsg('Debes seleccionar una sede.');
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.createParadaWeb({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        ubicacion: ubicacion.trim() || null,
        estatus,
        idsede: sedeNum,
      });
      limpiarForm();
      await cargar();
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error al crear');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(r: ParadaRow) {
    setEditId(r.Id);
    setNombre(r.Nombre || '');
    setDescripcion(r.Descripcion || '');
    setUbicacion(r.Ubicacion || '');
    setEstatus(Boolean(r.Estatus));
    setIdSede(r.IdSede ?? '');
  }

  async function handleUpdate() {
    if (editId == null) return;
    const sedeNum = typeof idSede === 'number' ? idSede : Number(idSede || 0);
    if (!sedeNum) return setErrorMsg('Debes seleccionar una sede.');
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.updateParadaWeb(editId, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        ubicacion: ubicacion.trim() || null,
        estatus,
        idsede: sedeNum,
      });
      limpiarForm();
      await cargar();
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOne(id: number) {
    if (!confirm('¿Eliminar esta parada?')) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await api.deleteParadaWeb(id);
      await cargar();
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  }

  const nombreSede = (id?: number | null) => {
    if (!id) return '-';
    const f = sedes.find((s) => Number(s.Id) === Number(id));
    return f?.Nombre ?? `Sede ${id}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Solicitudes de transporte (Paradas)</h1>
        <button
          onClick={cargar}
          className="rounded-md bg-gray-700/40 px-4 py-2 text-gray-100 hover:bg-gray-600"
          disabled={loading}
        >
          {loading ? 'Actualizando…' : 'Refrescar'}
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-900/30 border border-red-500 px-4 py-2 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Buscar (cliente) */}
      <div className="flex gap-2">
        <input
          className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155] w-72"
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={() => setQ('')}
          className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white"
        >
          Limpiar
        </button>
      </div>

      {/* Form crear / editar */}
      <div className="rounded-lg border border-[#1e293b] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Nombre</label>
            <input
              className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la parada"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Descripción</label>
            <input
              className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Ubicación</label>
            <input
              className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Dirección o referencia"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Sede</label>
            <select
              className="rounded-md border border-[#334155] bg-[#1e293b] px-3 py-2 text-gray-100"
              value={idSede}
              onChange={(e) => setIdSede(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Selecciona sede</option>
              {sedes.map((s) => (
                <option key={String(s.Id)} value={String(s.Id)}>
                  {s.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={estatus} onChange={(e) => setEstatus(e.target.checked)} />
              Activa
            </label>

            {editId == null ? (
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={loading}
              >
                Crear
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={loading}
                >
                  Guardar
                </button>
                <button
                  onClick={limpiarForm}
                  className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-[#1e293b]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0b1220] text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Sede</th>
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-4">Cargando…</td>
              </tr>
            ) : filas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4">Sin resultados.</td>
              </tr>
            ) : (
              filas.map((r) => (
                <tr key={r.Id} className="border-t border-[#1e293b]">
                  <td className="px-4 py-3">{r.Id}</td>
                  <td className="px-4 py-3">{r.Nombre}</td>
                  <td className="px-4 py-3">{nombreSede(r.IdSede ?? null)}</td>
                  <td className="px-4 py-3">{r.Ubicacion || '-'}</td>
                  <td className="px-4 py-3">{r.Estatus ? 'Activa' : 'Inactiva'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => startEdit(r)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteOne(r.Id)}
                      className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white"
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
