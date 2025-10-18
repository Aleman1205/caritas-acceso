'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Parada = {
  Id: number;
  Nombre: string;
  Estatus?: boolean;
};

export default function SolicitudesTransportePage() {
  const [rows, setRows] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [q, setQ] = useState<string>('');

  const [nombre, setNombre] = useState<string>('');
  const [estatus, setEstatus] = useState<boolean>(true);
  const [editId, setEditId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.getParadas(q ? { Nombre: q } : undefined);
      const norm: Parada[] = (data || []).map((p: any) => ({
        Id: Number(p.Id),
        Nombre: String(p.Nombre ?? ''),
        Estatus: typeof p.Estatus === 'boolean' ? p.Estatus : Boolean(p.Estatus),
      }));
      setRows(norm);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    try {
      setErrorMsg(null);
      await api.createParada({ Nombre: nombre, Estatus: estatus });
      setNombre('');
      setEstatus(true);
      await load();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al crear');
    }
  }

  function startEdit(row: Parada) {
    setEditId(row.Id);
    setNombre(row.Nombre || '');
    setEstatus(Boolean(row.Estatus));
  }

  function cancelEdit() {
    setEditId(null);
    setNombre('');
    setEstatus(true);
  }

  async function handleUpdate() {
    if (editId == null) return;
    try {
      setErrorMsg(null);
      await api.updateParada(editId, { Nombre: nombre, Estatus: estatus });
      cancelEdit();
      await load();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al actualizar');
    }
  }

  async function handleDeleteOne(id: number) {
    try {
      setErrorMsg(null);
      await api.deleteParada(id); // <--- eliminar por Id
      await load();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al eliminar');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Solicitudes de transporte (Paradas)</h1>

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
          onClick={load}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          Buscar
        </button>
      </div>

      {/* Form crear / editar */}
      <div className="rounded-lg border border-[#1e293b] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Nombre</label>
            <input
              className="px-3 py-2 rounded-md bg-[#1e293b] border border-[#334155]"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la parada"
            />
          </div>

          <div className="flex items-end gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={estatus}
                onChange={(e) => setEstatus(e.target.checked)}
              />
              Activa
            </label>
          </div>

          <div className="flex items-end gap-2">
            {editId == null ? (
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Crear
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Guardar
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white"
                >
                  Cancelar
                </button>
              </div>
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
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4" colSpan={4}>
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-4" colSpan={4}>
                  Sin resultados.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.Id} className="border-t border-[#1e293b]">
                  <td className="px-4 py-3">{r.Id}</td>
                  <td className="px-4 py-3">{r.Nombre}</td>
                  <td className="px-4 py-3">
                    {r.Estatus ? 'Activa' : 'Inactiva'}
                  </td>
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
