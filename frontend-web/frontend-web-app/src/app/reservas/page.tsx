"use client";

import { useEffect, useMemo, useState } from "react";
import { api, Reserva } from "@/lib/api";

type Row = Reserva & { _selected?: boolean };

export default function ReservasPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // form crear
  const [txNew, setTxNew] = useState("");
  const [estadoNew, setEstadoNew] = useState("");

  // filtros / acciones
  const [searchTx, setSearchTx] = useState("");
  const [updatingTx, setUpdatingTx] = useState<string | null>(null);
  const [estadoEdit, setEstadoEdit] = useState("");

  const selected = useMemo(
    () => items.filter((r) => r._selected).map((r) => r.IdTransaccion),
    [items]
  );

  const loadAll = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await api.getReservas();
      setItems((data || []).map((x) => ({ ...x, _selected: false })));
    } catch (e: any) {
      setErr(e?.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  const searchOne = async () => {
    if (!searchTx.trim()) return loadAll();
    setLoading(true);
    setErr(null);
    try {
      const one = await api.getReserva(searchTx.trim());
      // si no existe, normaliza a []
      const arr = one ? [{ ...one, _selected: false }] : [];
      setItems(arr);
    } catch (e: any) {
      setErr(e?.message || "No se pudo obtener la reserva");
    } finally {
      setLoading(false);
    }
  };

  const crear = async () => {
    if (!txNew.trim()) {
      setErr("IdTransaccion es requerido");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      await api.createReserva({
        IdTransaccion: txNew.trim(),
        ...(estadoNew ? { Estado: estadoNew } : {}),
      });
      setTxNew("");
      setEstadoNew("");
      await loadAll();
    } catch (e: any) {
      setErr(e?.message || "No se pudo crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async () => {
    if (!updatingTx || !estadoEdit.trim()) return;
    setErr(null);
    setLoading(true);
    try {
      await api.updateReserva(updatingTx, { Estado: estadoEdit.trim() });
      setUpdatingTx(null);
      setEstadoEdit("");
      await loadAll();
    } catch (e: any) {
      setErr(e?.message || "No se pudo actualizar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const eliminarSeleccionadas = async () => {
    if (selected.length === 0) return;
    setErr(null);
    setLoading(true);
    try {
      await api.deleteReservas(selected as string[]);
      await loadAll();
    } catch (e: any) {
      setErr(e?.message || "No se pudieron eliminar");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (tx: string) => {
    setItems((prev) =>
      prev.map((r) =>
        r.IdTransaccion === tx ? { ...r, _selected: !r._selected } : r
      )
    );
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <p className="text-sm text-slate-400">
          Crear, buscar, actualizar estado y eliminar reservas.
        </p>
      </header>

      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">
          {err}
        </div>
      )}

      {/* Buscar por IdTransaccion */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm mb-1">Buscar por IdTransaccion</label>
          <input
            value={searchTx}
            onChange={(e) => setSearchTx(e.target.value)}
            placeholder="TX-100"
            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
          />
        </div>
        <button
          onClick={searchOne}
          disabled={loading}
          className="h-10 rounded-md bg-blue-600 px-4 text-white disabled:opacity-50"
        >
          Buscar
        </button>
        <button
          onClick={loadAll}
          disabled={loading}
          className="h-10 rounded-md bg-slate-700 px-4 text-white disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      {/* Crear reserva */}
      <div className="rounded-xl border border-slate-700 p-4">
        <h2 className="font-medium mb-3">Crear reserva</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">IdTransaccion *</label>
            <input
              value={txNew}
              onChange={(e) => setTxNew(e.target.value)}
              placeholder="TX-101"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Estado (opcional)</label>
            <input
              value={estadoNew}
              onChange={(e) => setEstadoNew(e.target.value)}
              placeholder="pendiente | confirmada | cancelada"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={crear}
              disabled={loading}
              className="h-10 rounded-md bg-emerald-600 px-4 text-white disabled:opacity-50"
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* Actualizar estado */}
      <div className="rounded-xl border border-slate-700 p-4">
        <h2 className="font-medium mb-3">Actualizar estado</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">IdTransaccion *</label>
            <input
              value={updatingTx ?? ""}
              onChange={(e) => setUpdatingTx(e.target.value)}
              placeholder="TX-101"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Nuevo estado *</label>
            <input
              value={estadoEdit}
              onChange={(e) => setEstadoEdit(e.target.value)}
              placeholder="confirmada"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={actualizarEstado}
              disabled={loading || !updatingTx || !estadoEdit}
              className="h-10 rounded-md bg-amber-600 px-4 text-white disabled:opacity-50"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-slate-400">
            {loading ? "Cargando..." : `${items.length} reserva(s)`}
          </div>
          <button
            onClick={eliminarSeleccionadas}
            disabled={loading || selected.length === 0}
            className="h-9 rounded-md bg-rose-600 px-3 text-white disabled:opacity-50"
          >
            Eliminar seleccionadas ({selected.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="p-3 text-left">Sel</th>
                <th className="p-3 text-left">IdTransaccion</th>
                <th className="p-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-slate-400">
                    Sin resultados.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.IdTransaccion} className="border-b border-slate-800">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={!!r._selected}
                        onChange={() => toggleRow(r.IdTransaccion)}
                      />
                    </td>
                    <td className="p-3">{r.IdTransaccion}</td>
                    <td className="p-3">{r.Estado || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
