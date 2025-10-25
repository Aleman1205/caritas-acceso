"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Si en api.ts no tienes el tipo aún, puedes usar este local */
type Resena = {
  id: number;
  estrellas: number;   // int_estrellas
  comentario: string;  // comentarios
  idSede?: number;
  createdAt?: string;
  updatedAt?: string;
};

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  return (
    <span aria-label={`${v} estrellas`} className="font-medium">
      {"★".repeat(v)}
      {"☆".repeat(5 - v)}
    </span>
  );
}

export default function ResenasPage() {
  const [items, setItems] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // filtros opcionales (mínimo de estrellas y búsqueda en comentario)
  const [minStars, setMinStars] = useState(0);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // requiere api.getResenasWeb() (ver nota al final)
      const resp = await api.getResenasWeb();
      setItems(resp?.data ?? []);
    } catch (e: any) {
      setErr(e?.message || "No se pudieron cargar las reseñas.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((r) => {
    if (minStars > 0 && (r.estrellas ?? 0) < minStars) return false;
    if (q.trim()) {
      const txt = (r.comentario || "").toLowerCase();
      if (!txt.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reseñas</h1>
        <p className="text-sm text-slate-400">
          Vista de comentarios con su calificación.
        </p>
      </header>

      {/* Filtros simples */}
      <div className="flex items-end gap-3">
        <div>
          <label className="block text-sm mb-1">Buscar en comentario</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="palabra clave…"
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Mínimo de estrellas</label>
          <select
            value={minStars}
            onChange={(e) => setMinStars(Number(e.target.value))}
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2"
          >
            <option value={0}>Todas</option>
            <option value={5}>5 ★</option>
            <option value={4}>4 ★ o más</option>
            <option value={3}>3 ★ o más</option>
            <option value={2}>2 ★ o más</option>
            <option value={1}>1 ★ o más</option>
          </select>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="h-10 rounded-md bg-slate-700 px-4 text-white disabled:opacity-50"
        >
          {loading ? "Cargando…" : "Recargar"}
        </button>
      </div>

      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">
          {err}
        </div>
      )}

      {/* Tabla muy simple: rating + comentario */}
      <div className="rounded-xl border border-slate-700 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="p-3 text-left w-32">Rating</th>
              <th className="p-3 text-left">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-slate-400">
                  {loading ? "Cargando…" : "Sin reseñas que coincidan."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-slate-800">
                  <td className="p-3 align-top">
                    <div className="inline-flex items-center gap-2">
                      <Stars value={r.estrellas} />
                      <span className="text-slate-400 text-xs">
                        ({r.estrellas})
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{r.comentario || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-400">
        {filtered.length} reseña(s) mostradas.
      </div>
    </div>
  );
}
