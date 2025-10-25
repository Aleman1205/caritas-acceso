'use client';

import { useEffect, useState } from 'react';

type Servicio = {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Estatus: boolean;
};

export default function ServiciosPage() {
  const [rows, setRows] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  // Usa 3001 por defecto (backend)
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  // ---------------------------
  // Normalización de datos
  // ---------------------------
  const normalizeServicio = (s: any): Servicio => ({
    Id: Number(s.id ?? s.Id ?? 0),
    Nombre: String(s.nombre ?? s.Nombre ?? ''),
    Descripcion: String(s.descripcion ?? s.Descripcion ?? ''),
    Estatus: s.estatus === true || s.estatus === 'true' || s.estatus === 1 || s.Estatus === true,
  });

  // ---------------------------
  // Helpers de búsqueda (front)
  // ---------------------------
  function normText(s: unknown) {
    return String(s ?? '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  function filterServicios(list: any[], query: string) {
    const qn = normText(query);
    if (!qn) return list;
    return list.filter((it) => {
      const n = normText(it.nombre ?? it.Nombre);
      const d = normText(it.descripcion ?? it.Descripcion);
      return n.includes(qn) || d.includes(qn);
    });
  }

  // ---------------------------
  // Cargar / Buscar
  // ---------------------------
  async function fetchServicios(query?: string) {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Intentamos pasar ?q= al backend si lo soporta
      const url = `${API_BASE}/web/servicio${query ? `?q=${encodeURIComponent(query)}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      const json = await res.json();

      const raw: any[] = Array.isArray(json?.data) ? json.data : [];
      const normalized = raw.map(normalizeServicio);
      // Filtro de seguridad en front (por si el backend no filtra)
      const finalRows = filterServicios(normalized, query || '');
      setRows(finalRows);

      if (finalRows.length === 0) setErrorMsg('No se encontraron resultados.');
    } catch (err: any) {
      setRows([]);
      setErrorMsg(err?.message || 'Error consultando servicios');
    } finally {
      setLoading(false);
    }
  }

  async function handleBuscar() {
    await fetchServicios(q);
  }

  // ---------------------------
  // Crear / Actualizar / Eliminar
  // ---------------------------
  async function handleCreate() {
    if (!nombre.trim()) return setErrorMsg('El nombre es obligatorio.');
    setLoading(true);
    setErrorMsg(null);

    try {
      const body = { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined, estatus: activo };
      const res = await fetch(`${API_BASE}/web/servicio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      await res.json();

      alert('Servicio creado correctamente.');
      clearForm();
      await fetchServicios(q);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al crear servicio');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (editId == null) return;
    if (!nombre.trim()) return setErrorMsg('El nombre es obligatorio.');
    setLoading(true);
    setErrorMsg(null);

    try {
      const body = { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined, estatus: activo };
      const res = await fetch(`${API_BASE}/web/servicio/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      await res.json();

      alert('Servicio actualizado correctamente.');
      clearForm();
      await fetchServicios(q);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al actualizar servicio');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOne(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este servicio?')) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/web/servicio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      await res.json();

      alert('Servicio eliminado.');
      await fetchServicios(q);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al eliminar servicio');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(s: Servicio) {
    setEditId(s.Id);
    setNombre(s.Nombre);
    setDescripcion(s.Descripcion);
    setActivo(s.Estatus);
  }

  function clearForm() {
    setEditId(null);
    setNombre('');
    setDescripcion('');
    setActivo(true);
  }

  // Carga inicial
  useEffect(() => {
    fetchServicios('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Servicios</h1>

      {errorMsg && (
        <div className="rounded-md bg-red-900/30 border border-red-500 px-4 py-2 text-sm">{errorMsg}</div>
      )}

      {/* Buscar */}
      <div className="flex gap-2">
        <input
          className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155] w-72"
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBuscar();
          }}
        />
        <button
          onClick={handleBuscar}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          Buscar
        </button>
      </div>

      {/* Crear / Editar */}
      <div className="rounded-lg border border-[#1e293b] p-4 space-y-3">
        <h2 className="text-lg font-medium">{editId ? 'Editar servicio' : 'Crear nuevo servicio'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Activo
          </label>
        </div>

        <div className="flex gap-2">
          {editId == null ? (
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Crear
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white"
              >
                Guardar
              </button>
              <button
                onClick={clearForm}
                className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-[#1e293b]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0b1220] text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center">Cargando…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center">Sin resultados.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.Id} className="border-t border-[#1e293b]">
                  <td className="px-4 py-3">{r.Id}</td>
                  <td className="px-4 py-3">{r.Nombre}</td>
                  <td className="px-4 py-3">{r.Descripcion || '-'}</td>
                  <td className="px-4 py-3">{r.Estatus ? 'Activo' : 'Inactivo'}</td>
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
