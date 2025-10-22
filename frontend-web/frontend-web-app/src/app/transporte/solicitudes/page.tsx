'use client';

import { useState } from 'react';

type Parada = {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Ubicacion: string;
  Estatus: boolean;
  IdSede: number;
};

export default function TransportePage() {
  const [rows, setRows] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [estatus, setEstatus] = useState(true);
  const [idsede, setIdsede] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  // ⚡ Normalización de datos
  const normalizeParada = (p: any): Parada => ({
    Id: Number(p.id ?? 0),
    Nombre: String(p.nombre ?? ''),
    Descripcion: String(p.descripcion ?? ''),
    Ubicacion: String(p.ubicacion ?? ''),
    Estatus: p.estatus === true || p.estatus === 'true',
    IdSede: Number(p.idsede ?? 0),
  });

  async function handleBuscar() {
    if (!q.trim()) return setErrorMsg('Escribe un nombre para buscar.');
    setLoading(true);
    setErrorMsg(null);
    setRows([]);

    try {
      const res = await fetch(`${BACKEND_URL}/web/parada.routes/${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);

      const json = await res.json();
      console.log('Respuesta cruda del backend:', json); // para depuración

      // Detecta el array real de paradas en la respuesta
      const rawRows: any[] = (() => {
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.data)) return json.data;
        if (Array.isArray(json.paradas)) return json.paradas;
        return [];
      })();

      console.log('Array detectado del backend:', rawRows);

      // Normalización de campos: minúscula → mayúscula, tipos seguros

    // Normalización de campos
    const normalizedRows = (json.data ?? []).map((p: any) => ({
      Id: Number(p.id),
      Nombre: String(p.nombre),
      Descripcion: String(p.descripcion ?? ''),
      Ubicacion: String(p.ubicacion ?? ''),
      Estatus: p.estatus === true || p.estatus === 'true',
      IdSede: Number(p.idsede),
    }));

    setRows(normalizedRows);

    if (normalizedRows.length === 0) setErrorMsg('No se encontraron resultados.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al buscar parada');
    } finally {
      setLoading(false);
    }
  }


  async function handleCreate() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const body = { nombre, descripcion, ubicacion, estatus, idsede };
      const res = await fetch(`${BACKEND_URL}/web/parada.routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      await res.json();

      alert('Parada creada correctamente.');
      clearForm();
      await handleBuscar();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al crear parada');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (editId == null) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const body = { nombre, descripcion, ubicacion, estatus, idsede };
      const res = await fetch(`${BACKEND_URL}/web/parada.routes/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      await res.json();

      alert('Parada actualizada correctamente.');
      clearForm();
      await handleBuscar();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al actualizar parada');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOne(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta parada?')) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${BACKEND_URL}/web/parada.routes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
      await res.json();

      alert('Parada eliminada.');
      await handleBuscar();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al eliminar parada');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(row: Parada) {
    setEditId(row.Id);
    setNombre(row.Nombre);
    setDescripcion(row.Descripcion);
    setUbicacion(row.Ubicacion);
    setEstatus(row.Estatus);
    setIdsede(row.IdSede);
  }

  function clearForm() {
    setEditId(null);
    setNombre('');
    setDescripcion('');
    setUbicacion('');
    setEstatus(true);
    setIdsede(1);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Gestión de Paradas</h1>

      {errorMsg && (
        <div className="rounded-md bg-red-900/30 border border-red-500 px-4 py-2 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Buscar */}
      <div className="flex gap-2">
        <input
          className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155] w-72"
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
        <h2 className="text-lg font-medium">{editId ? 'Editar parada' : 'Crear nueva parada'}</h2>

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
          <input
            className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
            placeholder="Ubicación"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
          <input
            type="number"
            className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
            placeholder="ID Sede"
            value={idsede}
            onChange={(e) => setIdsede(Number(e.target.value))}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={estatus}
              onChange={(e) => setEstatus(e.target.checked)}
            />
            Activa
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
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3">Sede</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center">
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center">
                  Sin resultados.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.Id} className="border-t border-[#1e293b]">
                  <td className="px-4 py-3">{r.Id}</td>
                  <td className="px-4 py-3">{r.Nombre}</td>
                  <td className="px-4 py-3">{r.Descripcion}</td>
                  <td className="px-4 py-3">{r.Ubicacion}</td>
                  <td className="px-4 py-3">{r.Estatus ? 'Activa' : 'Inactiva'}</td>
                  <td className="px-4 py-3">{r.IdSede}</td>
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
