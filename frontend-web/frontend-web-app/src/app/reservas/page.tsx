"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type ReservaTelefono } from "@/lib/api";

type Mode = "phone" | "all" | "fin";

// catálogo fijo de estados permitidos para edición
const ALLOWED_STATUSES = ["en_estancia", "finalizada", "cancelada"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

/* ───────────── Helpers de estado/estilos ───────────── */
function canonicalStatus(v: unknown) {
  // normaliza variantes como "Finalizado", "cancelado", etc.
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "finalizado") return "finalizada";
  if (s === "cancelado") return "cancelada";
  return s;
}

function isFinalizada(v: unknown) {
  const s = canonicalStatus(v);
  return s === "finalizada";
}

function statusBadgeClasses(v: unknown) {
  const s = canonicalStatus(v);
  switch (s) {
    case "cancelada":
      return "bg-red-700/30 text-red-200 border-red-600";
    case "pendiente":
      return "bg-yellow-600/20 text-yellow-200 border-yellow-500";
    case "en_estancia":
      return "bg-emerald-900/40 text-emerald-200 border-emerald-700/60";
    case "finalizada":
      return "bg-white text-slate-900 border-white";
    default:
      return "bg-slate-700/40 text-slate-200 border-slate-600/60";
  }
}

export default function ReservasPage() {
  const [mode, setMode] = useState<Mode>("all");
  const [items, setItems] = useState<ReservaTelefono[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [searchPhone, setSearchPhone] = useState("");

  // ====== Estado para editar ======
  const [openStatus, setOpenStatus] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusErr, setStatusErr] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<string | null>(null);
  const [currentReserva, setCurrentReserva] = useState<ReservaTelefono | null>(null);
  const [newStatus, setNewStatus] = useState<AllowedStatus>("en_estancia");

  // ---- cargas ----
  const loadAll = async () => {
    setErr(null);
    setLoading(true);
    try {
      const resp = await api.getReservasAll();
      setItems(resp.data ?? []);
    } catch (e: any) {
      setItems([]);
      setErr(e?.message || "No se pudo cargar la lista de reservas");
    } finally {
      setLoading(false);
    }
  };

  const loadFin = async () => {
    setErr(null);
    setLoading(true);
    try {
      const resp = await api.getReservasFin();
      // el backend ya devuelve 'status' (normalmente "finalizada");
      // por si acaso, rellenamos si viene vacío.
      const data = (resp.data ?? []).map((r) => ({
        ...r,
        status: (r.status as any) || "finalizada",
      }));
      setItems(data);
    } catch (e: any) {
      setItems([]);
      setErr(e?.message || "No se pudo cargar 'reservafin'.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar por teléfono
  const searchByPhone = async () => {
    setErr(null);
    if (!searchPhone.trim()) {
      setItems([]);
      setErr("Escribe un teléfono para buscar.");
      return;
    }
    setLoading(true);
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

  // Cambiar de pestaña
  const onSwitch = (m: Mode) => {
    setMode(m);
    setErr(null);
    setItems([]);
    if (m === "all") loadAll();
    if (m === "fin") loadFin();
  };

  // Inicial: mostrar “Todas”
  useEffect(() => {
    loadAll();
  }, []);

  const total = useMemo(() => items.length, [items]);
  const isFinView = mode === "fin";

  function openEditStatus(r: ReservaTelefono) {
    if (isFinalizada(r.status) || isFinView) return; // bloquea en finalizadas
    setCurrentReserva(r);
    const current = canonicalStatus(r.status);
    setNewStatus(
      (ALLOWED_STATUSES as readonly string[]).includes(current)
        ? (current as AllowedStatus)
        : "en_estancia"
    );
    setStatusErr(null);
    setOpenStatus(true);
  }

  function closeEditStatus() {
    setOpenStatus(false);
    setCurrentReserva(null);
    setStatusErr(null);
  }

  // ✅ finalizada / cancelada -> elimina en BD y quita la fila
  // ✅ en_estancia -> solo actualiza local
  async function saveStatus() {
    if (!currentReserva) return;
    setStatusSaving(true);
    setStatusErr(null);
    setStatusInfo(null);
    try {
      const id = currentReserva.idTransaccion;

      if (newStatus === "finalizada" || newStatus === "cancelada") {
        const resp = await api.deleteReservaWeb(id);
        if (!resp?.success) {
          throw new Error(resp?.message || "No se pudo eliminar la reserva.");
        }
        setItems((prev) => prev.filter((r) => r.idTransaccion !== id));
        setStatusInfo("Reserva eliminada de la lista (tabla 'reserva').");
      } else {
        setItems((prev) =>
          prev.map((r) => (r.idTransaccion === id ? { ...r, status: newStatus } : r))
        );
        setStatusInfo("Estado actualizado localmente.");
      }

      closeEditStatus();
    } catch (e: any) {
      setStatusErr(e?.message || "Error al aplicar el cambio.");
    } finally {
      setStatusSaving(false);
      if (!statusErr) setTimeout(() => setStatusInfo(null), 2500);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <p className="text-sm text-slate-400">
          Buscar por teléfono, ver todas o ver las finalizadas (reservafin).
        </p>
        {statusInfo && (
          <div className="mt-3 rounded-md border border-emerald-600 bg-emerald-900/30 px-4 py-2 text-emerald-200">
            {statusInfo}
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSwitch("phone")}
          className={`rounded-lg px-4 py-2 border ${
            mode === "phone"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-slate-800 text-slate-200 border-slate-700"
          }`}
        >
          Por teléfono
        </button>
        <button
          onClick={() => onSwitch("all")}
          className={`rounded-lg px-4 py-2 border ${
            mode === "all"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-slate-800 text-slate-200 border-slate-700"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => onSwitch("fin")}
          className={`rounded-lg px-4 py-2 border ${
            mode === "fin"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-slate-800 text-slate-200 border-slate-700"
          }`}
        >
          Finalizadas
        </button>
      </div>

      {/* Panel de error */}
      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">
          {err}
        </div>
      )}

      {/* Buscar por Teléfono (solo mode=phone) */}
      {mode === "phone" && (
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
        </div>
      )}

      {/* Acciones arriba de la tabla */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          {loading ? "Cargando..." : `${total} registro(s)`}
        </div>
        <button
          onClick={
            mode === "all" ? loadAll : mode === "fin" ? loadFin : searchByPhone
          }
          disabled={
            loading || (mode === "phone" && !searchPhone.trim())
          }
          className="h-9 rounded-md bg-slate-700 px-3 text-white disabled:opacity-50"
        >
          Recargar
        </button>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-slate-700 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="p-3 text-left">Clave</th>
              <th className="p-3 text-left">Sede</th>
              <th className="p-3 text-left">Ubicación</th>
              <th className="p-3 text-left">Ciudad</th>
              <th className="p-3 text-left">Fecha Inicio</th>
              <th className="p-3 text-left">Fecha Salida</th>
              <th className="p-3 text-left">Hora Check-in</th>
              <th className="p-3 text-left">Hombres</th>
              <th className="p-3 text-left">Mujeres</th>
              <th className="p-3 text-left">Beneficiario</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-4 text-slate-400">
                  {loading ? "Cargando..." : "Sin resultados."}
                </td>
              </tr>
            ) : (
              items.map((r, i) => {
                const s = canonicalStatus(r.status);
                const disabled = isFinView || isFinalizada(s);
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
                    <td className="p-3">{r.beneficiario || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs border inline-block capitalize ${statusBadgeClasses(
                          s
                        )}`}
                      >
                        {s || "-"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        className={`rounded-md px-3 py-1 text-white ${
                          disabled
                            ? "bg-slate-600 cursor-not-allowed opacity-60"
                            : "bg-amber-600 hover:bg-amber-500"
                        }`}
                        onClick={() => openEditStatus(r)}
                        disabled={disabled}
                        title={
                          isFinView
                            ? "No editable en Finalizadas"
                            : isFinalizada(r.status)
                            ? "Esta reserva está finalizada"
                            : "Editar estado"
                        }
                      >
                        Editar estado
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Editar Estado */}
      {openStatus && currentReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={statusSaving ? undefined : closeEditStatus}
          />
          {/* panel */}
          <div className="relative z-10 w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Editar estado — {currentReserva.clave}
            </h2>

            {statusErr && (
              <div className="mb-3 rounded-md border border-red-600 bg-red-900/30 px-3 py-2 text-red-200">
                {statusErr}
              </div>
            )}

            <label className="block mb-1 text-sm text-slate-300">Estado</label>
            <select
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as AllowedStatus)}
              disabled={statusSaving}
            >
              {ALLOWED_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditStatus}
                disabled={statusSaving}
                className="h-10 rounded-md border border-slate-600 px-4 text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={saveStatus}
                disabled={statusSaving}
                className="h-10 rounded-md bg-indigo-600 px-4 text-white disabled:opacity-50"
              >
                {statusSaving ? "Aplicando…" : "Aplicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
