"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type CupoHorario = {
  id: number;
  sede: string;
  servicio: string;
  descripcion?: string | null;
  capacidad: number | null;                 // normalizado
  precio: number;                           // normalizado
  horainicio: string | null;                // "HH:MM:SS" | null
  horafinal: string | null;                 // "HH:MM:SS" | null
  estatus: string | number | boolean | null;
};

function fmtEntero(n: unknown) {
  const num =
    typeof n === "number" ? n :
    typeof n === "string" ? parseInt(n, 10) :
    0;
  if (Number.isNaN(num)) return "0";
  return new Intl.NumberFormat("es-MX").format(num);
}
function fmtMoney(n: number | string | null | undefined) {
  const num =
    typeof n === "string" ? Number(n) :
    typeof n === "number" ? n : 0;
  if (Number.isNaN(num)) return "0.00";
  return num.toFixed(2);
}
function fmtHora(h: string | null | undefined) {
  if (!h) return "—";
  return h;
}

/** Texto libre -> "activo" | "inactivo" | "" (para mostrar en badge) */
function normalizeStatusText(v: unknown): "activo" | "inactivo" | "" {
  if (v === null || v === undefined) return "";
  if (v === true) return "activo";
  if (v === false) return "inactivo";
  if (typeof v === "number") return v === 1 ? "activo" : v === 0 ? "inactivo" : "";
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "1" || s === "activo") return "activo";
    if (s === "0" || s === "inactivo") return "inactivo";
    return s === "" ? "" : (s as "activo" | "inactivo" | "");
  }
  return "";
}

/** "HH:MM" o "HH:MM:SS" -> "HH:MM:SS" | null */
function toHHMMSS(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.trim();
  if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  return s;
}

/** Normalizadores para la carga */
function toInt(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? parseInt(v, 10) : Number(v);
  return Number.isNaN(n) ? null : n;
}
function toNum(v: any): number {
  const n = typeof v === "string" ? Number(v) : Number(v ?? 0);
  return Number.isNaN(n) ? 0 : n;
}
function toHHMMSSOrNull(v: any): string | null {
  if (v === null || v === undefined || v === "") return null;
  const s = String(v);
  return toHHMMSS(s);
}

/* ==================== Componente ==================== */
export default function CuposPage() {
  const [rows, setRows] = useState<CupoHorario[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Modal de edición
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [current, setCurrent] = useState<CupoHorario | null>(null);

  // Form state
  const [capacidad, setCapacidad] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");
  const [horainicio, setHorainicio] = useState<string>("");
  const [horafinal, setHorafinal] = useState<string>("");
  const [estatusBool, setEstatusBool] = useState<boolean | null>(null);
  const [descripcion, setDescripcion] = useState<string>("");

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const resp = await api.getCupos();
      if (resp?.success && Array.isArray(resp.data)) {
        const normalized: CupoHorario[] = resp.data.map((r: any) => ({
          id: Number(r.id),
          sede: String(r.sede ?? ""),
          servicio: String(r.servicio ?? ""),
          descripcion: r.descripcion ?? null,
          capacidad: toInt(r.capacidad),
          precio: toNum(r.precio),
          horainicio: toHHMMSSOrNull(r.horainicio),
          horafinal: toHHMMSSOrNull(r.horafinal),
          estatus: r.estatus,
        }));
        setRows(normalized);
      } else {
        setRows([]);
        setErr(resp?.message || "No se pudo obtener la lista de cupos.");
      }
    } catch (e: any) {
      setRows([]);
      setErr(e?.message || "No se pudo obtener la lista de cupos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onEditar(row: CupoHorario) {
    setCurrent(row);
    // prellenar
    setCapacidad(row.capacidad == null ? "" : String(row.capacidad));
    setPrecio(String(row.precio ?? 0));
    // inputs type="time" aceptan "HH:MM"
    setHorainicio((row.horainicio || "").slice(0, 5));
    setHorafinal((row.horafinal || "").slice(0, 5));
    const st = normalizeStatusText(row.estatus);
    setEstatusBool(st === "" ? null : st === "activo");
    setDescripcion(row.descripcion ?? "");
    setFormErr(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setCurrent(null);
  }

  async function handleSave() {
    if (!current) return;
    setSaving(true);
    setFormErr(null);
    try {
      if (estatusBool === null) {
        throw new Error("Selecciona un estatus (activo o inactivo).");
      }

      const body: any = {
        capacidad: capacidad.trim() === "" ? null : Number(capacidad),
        precio: precio.trim() === "" ? 0 : Number(precio),
        horainicio: toHHMMSS(horainicio),
        horafinal: toHHMMSS(horafinal),
        estatus: estatusBool,           // boolean para backend
        descripcion: descripcion ?? "",
      };

      if (body.capacidad !== null && Number.isNaN(body.capacidad)) {
        throw new Error("Capacidad no es un número válido.");
      }
      if (Number.isNaN(body.precio)) {
        throw new Error("Precio no es un número válido.");
      }

      const resp = await api.updateCupo(current.id, body);
      if (!resp?.success) throw new Error(resp?.message || "No se pudo guardar.");

      await load();
      setOpen(false);
      setCurrent(null);
    } catch (e: any) {
      setFormErr(e?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cupos y horarios</h1>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="h-10 rounded-md bg-indigo-600 px-4 text-white disabled:opacity-50"
        >
          {loading ? "Cargando…" : "Recargar"}
        </button>
      </header>

      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">
          {err}
        </div>
      )}

      {/* Tabla */}
      <section className="rounded-xl border border-slate-700 overflow-x-auto">
        <div className="px-4 py-3 text-sm text-slate-400">
          {rows.length} registro(s)
        </div>
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-slate-800/50 border-y border-slate-700">
            <tr>
              <Th>ID</Th>
              <Th>Sede</Th>
              <Th>Servicio</Th>
              <Th>Descripción</Th>
              <Th className="text-right">Capacidad</Th>
              <Th className="text-right">Precio</Th>
              <Th className="text-center">Hora inicio</Th>
              <Th className="text-center">Hora final</Th>
              <Th className="text-center">Estatus</Th>
              <Th className="text-center">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-4 text-slate-400">
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-4 text-slate-400">
                  Sin registros.
                </td>
              </tr>
            ) : (
              rows.map((c) => {
                const statusText = normalizeStatusText(c.estatus);
                return (
                  <tr key={c.id} className="border-b border-slate-800">
                    <Td className="text-slate-300">{c.id}</Td>
                    <Td>{c.sede}</Td>
                    <Td>{c.servicio}</Td>

                    <Td className="whitespace-pre-line">
                      {c.descripcion && c.descripcion.trim() !== ""
                        ? c.descripcion
                        : "—"}
                    </Td>

                    <Td className="text-right">{fmtEntero(c.capacidad)}</Td>
                    <Td className="text-right">{fmtMoney(c.precio)}</Td>
                    <Td className="text-center">{fmtHora(c.horainicio)}</Td>
                    <Td className="text-center">{fmtHora(c.horafinal)}</Td>

                    <Td className="text-center">
                      {statusText ? (
                        <span
                          className={[
                            "px-2 py-1 rounded text-xs border inline-block",
                            statusText === "activo"
                              ? "bg-emerald-900/40 text-emerald-200 border-emerald-700/60"
                              : "bg-slate-700/40 text-slate-200 border-slate-600/60",
                          ].join(" ")}
                        >
                          {statusText}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </Td>

                    <Td className="text-center">
                      <button
                        className="rounded-md bg-amber-600 px-3 py-1 text-white hover:bg-amber-500"
                        onClick={() => onEditar(c)}
                      >
                        Editar
                      </button>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* Modal de edición */}
      {open && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={saving ? undefined : closeModal}
          />
          {/* Panel */}
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-4">
              Editar cupo #{current.id} — {current.sede} / {current.servicio}
            </h2>

            {formErr && (
              <div className="mb-4 rounded-md border border-red-600 bg-red-900/30 px-3 py-2 text-red-200">
                {formErr}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Capacidad">
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  placeholder="p. ej. 50"
                  disabled={saving}
                />
              </Field>

              <Field label="Precio">
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                  disabled={saving}
                />
              </Field>

              <Field label="Hora inicio">
                <input
                  type="time"
                  className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={horainicio}
                  onChange={(e) => setHorainicio(e.target.value)}
                  disabled={saving}
                />
              </Field>

              <Field label="Hora final">
                <input
                  type="time"
                  className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={horafinal}
                  onChange={(e) => setHorafinal(e.target.value)}
                  disabled={saving}
                />
              </Field>

              <Field label="Estatus">
                <select
                  className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
                  value={
                    estatusBool === null ? "" : estatusBool ? "true" : "false"
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") setEstatusBool(null);
                    else setEstatusBool(v === "true");
                  }}
                  disabled={saving}
                >
                  <option value="">— Seleccionar —</option>
                  <option value="true">activo</option>
                  <option value="false">inactivo</option>
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Descripción">
                  <textarea
                    className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 min-h-[120px]"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Notas, horarios detallados, etc."
                    disabled={saving}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={saving}
                className="h-10 rounded-md border border-slate-600 px-4 text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-10 rounded-md bg-indigo-600 px-4 text-white disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ==================== UI helpers ==================== */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-slate-300">{label}</div>
      {children}
    </label>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`p-3 text-left font-medium ${className}`.trim()}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`p-3 align-top ${className}`.trim()}>{children}</td>;
}
