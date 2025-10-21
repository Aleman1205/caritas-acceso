"use client";

import { useState } from "react";
import { api, type ReservaTelefono } from "@/lib/api";

export default function ReservasPage() {
  const [items, setItems] = useState<ReservaTelefono[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowUpdating, setRowUpdating] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [searchPhone, setSearchPhone] = useState("");

  // Por ahora no hay endpoint "todas": limpia resultados
  const loadAll = async () => {
    setErr(null);
    setItems([]);
  };

  const searchByPhone = async () => {
    if (!searchPhone.trim()) return loadAll();
    setLoading(true);
    setErr(null);
    try {
      const resp = await api.getReservasByTelefono(searchPhone.trim());
      setItems(resp.success ? resp.data : []);
      if (!resp.success || resp.data.length === 0) {
        setErr("Sin resultados para ese teléfono.");
      }
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes("[404]")) {
        setItems([]);
        setErr("Sin resultados para ese teléfono.");
      } else {
        setErr(e?.message || "No se pudo buscar por teléfono");
      }
    } finally {
      setLoading(false);
    }
  };

  async function setEstado(tx: string, estado: "confirmada" | "cancelada") {
    setErr(null);
    setRowUpdating(tx);
    try {
      await api.updateReserva(tx, { Estado: estado });
      // Refresca desde el backend para ver el estado real actualizado
      await searchByPhone();
    } catch (e: any) {
      setErr(e?.message || "No se pudo actualizar el estado");
    } finally {
      setRowUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <p className="text-sm text-slate-400">
          Buscar por teléfono, ver detalles y aceptar/rechazar.
        </p>
      </header>

      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">
          {err}
        </div>
      )}

      {/* Buscar por Teléfono */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm mb-1">Buscar por teléfono</label>
          <input
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="8123456789"
            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
            inputMode="tel"
          />
        </div>
        <button
          onClick={searchByPhone}
          disabled={loading}
          className="h-10 rounded-md bg-indigo-600 px-4 text-white disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
        <button
          onClick={loadAll}
          disabled={loading}
          className="h-10 rounded-md bg-slate-700 px-4 text-white disabled:opacity-50"
        >
          Mostrar todas
        </button>
      </div>

      {/* Tabla (formato de /web/reservas/telefono) */}
      <div className="rounded-xl border border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-slate-400">
            {loading ? "Cargando..." : `${items.length} reserva(s)`}
          </div>
          <button
            onClick={searchByPhone}
            disabled={loading || !searchPhone.trim()}
            className="h-9 rounded-md bg-slate-700 px-3 text-white disabled:opacity-50"
          >
            Recargar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="p-3 text-left">Clave</th>
                <th className="p-3 text-left">Sede</th>
                <th className="p-3 text-left">Ubicación</th>
                <th className="p-3 text-left">Ciudad</th>
                <th className="p-3 text-left">Fecha Inicio</th>
                <th className="p-3 text-left">Fecha Salida</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Hombres</th>
                <th className="p-3 text-left">Mujeres</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-4 text-slate-400">
                    Sin resultados.
                  </td>
                </tr>
              ) : (
                items.map((r, i) => {
                  const updating = rowUpdating === r.idTransaccion;
                  return (
                    <tr key={`${r.idTransaccion}-${i}`} className="border-b border-slate-800">
                      <td className="p-3">{r.clave}</td>
                      <td className="p-3">{r.sede}</td>
                      <td className="p-3">{r.ubicacion}</td>
                      <td className="p-3">{r.ciudad}</td>
                      <td className="p-3">{r.fechaInicio ?? "-"}</td>
                      <td className="p-3">{r.fechaSalida ?? "-"}</td>
                      <td className="p-3">{r.horaCheckIn ?? "-"}</td>
                      <td className="p-3">{r.hombres ?? "-"}</td>
                      <td className="p-3">{r.mujeres ?? "-"}</td>
                      <td className="p-3 capitalize">{r.status}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEstado(r.idTransaccion, "confirmada")}
                            disabled={loading || updating}
                            className="h-8 rounded-md bg-emerald-600 px-3 text-white disabled:opacity-50"
                            title="Confirmar"
                          >
                            {updating ? "..." : "Confirmar"}
                          </button>
                          <button
                            onClick={() => setEstado(r.idTransaccion, "cancelada")}
                            disabled={loading || updating}
                            className="h-8 rounded-md bg-rose-700 px-3 text-white disabled:opacity-50"
                            title="Rechazar"
                          >
                            {updating ? "..." : "Rechazar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
