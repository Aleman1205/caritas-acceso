"use client";

import { useEffect, useState } from "react";
import { api, type DashboardWeb } from "@/lib/api";

function fmt(n: number | undefined) {
  if (typeof n !== "number" || Number.isNaN(n)) return "0";
  return new Intl.NumberFormat("es-MX").format(n);
}

export default function DashboardPage() {
  const [fecha, setFecha] = useState<string>(""); // vacío = "todas"
  const [data, setData] = useState<DashboardWeb | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const resp = await api.getDashboard(fecha ? fecha : undefined);
      if (resp?.success) {
        setData(resp.data);
      } else {
        setData(null);
        setErr(resp?.message || "No se pudo obtener el dashboard");
      }
    } catch (e: any) {
      setData(null);
      setErr(e?.message || "No se pudo obtener el dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Filtros */}
      <section className="flex items-end gap-3">
        <div>
          <label className="block text-sm mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
          />
          <p className="text-xs text-slate-400 mt-1">
            Déjalo vacío para consultar <em>todas</em> las reservas.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="h-10 rounded-md bg-indigo-600 px-4 text-white disabled:opacity-50"
        >
          {loading ? "Actualizando…" : "Actualizar"}
        </button>
      </section>

      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">
          {err}
        </div>
      )}

      {/* Tarjetas resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total reservas" value={fmt(data?.totalReservas)} />
        <Card title="Servicios activos" value={fmt(data?.serviciosActivos)} />
        <Card title="Sedes activas" value={fmt(data?.sedesActivas)} />
      </section>

      {/* Tabla por sede */}
      <section>
        <h2 className="text-lg font-medium mb-3">Ocupación por sede</h2>
        <div className="rounded-xl border border-slate-700 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <Th>Sede</Th>
                <Th>Ciudad</Th>
                <Th className="text-right">Reservas</Th>
              </tr>
            </thead>
            <tbody>
              {!data?.resumenPorSede?.length ? (
                <tr>
                  <td colSpan={3} className="p-4 text-slate-400">
                    {loading ? "Cargando…" : "Sin datos para la fecha seleccionada."}
                  </td>
                </tr>
              ) : (
                data.resumenPorSede.map((s) => (
                  <tr key={String(s.sedeid)} className="border-b border-slate-800">
                    <Td>{s.sede}</Td>
                    <Td>{s.ciudad}</Td>
                    <Td className="text-right">{fmt(s.reservas)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-700 p-4">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-3xl mt-2">{value}</div>
    </div>
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
    <th className={`p-3 text-left ${className}`.trim()}>{children}</th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`p-3 ${className}`.trim()}>{children}</td>;
}
