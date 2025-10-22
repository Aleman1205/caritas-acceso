"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Tipos **/
type Cupo = {
  id: string;
  servicioId: string;
  fecha: string;    // YYYY-MM-DD
  hora: string;     // HH:mm
  capacidad: number;
  ocupados: number;
  activo: boolean;
};

type Servicio = {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
};

/** MOCK fallback (solo Alimentación y Lavandería) **/
const MOCK_SERVICIOS: Servicio[] = [
  { id: "s-01", nombre: "Alimentación", descripcion: "Comidas", activo: true },
  { id: "s-03", nombre: "Lavandería",   descripcion: "Lavado y secado", activo: true },
];

const MOCK_CUPOS: Cupo[] = [
  { id: "c-01", servicioId: "s-01", fecha: "2025-10-12", hora: "08:00", capacidad: 30, ocupados: 12, activo: true },
  { id: "c-02", servicioId: "s-01", fecha: "2025-10-12", hora: "13:00", capacidad: 30, ocupados: 18, activo: true },
  { id: "c-04", servicioId: "s-03", fecha: "2025-10-13", hora: "10:00", capacidad: 8,  ocupados: 3,  activo: true },
];

/** PAGE **/
export default function Page() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [data, setData] = useState<Cupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // UI
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Form
  const [form, setForm] = useState<Partial<Cupo>>({
    servicioId: "",
    fecha: "",
    hora: "",
    capacidad: 0,
    ocupados: 0,
    activo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busyRow, setBusyRow] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setMsg("");
      try {
        const [servRes, cupRes] = await Promise.allSettled([
          fetch("/api/servicios", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch("/api/cupos", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
        ]);
        if (!alive) return;


        // Si tu API aún devuelve cupos de s-02, también los filtramos:
        const cps = (cupRes.status === "fulfilled" && Array.isArray(cupRes.value) ? cupRes.value : MOCK_CUPOS)
          .filter((c: Cupo) => c.servicioId !== "s-02");

        setServicios(srv);
        setData(cps);

        if (servRes.status !== "fulfilled" || cupRes.status !== "fulfilled") {
          setMsg("Sin servidor: usando datos de prueba.");
        }
      } catch {
        if (!alive) return;
        setServicios(MOCK_SERVICIOS);
        setData(MOCK_CUPOS);
        setMsg("Sin servidor: usando datos de prueba.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  function onChange<K extends keyof Cupo>(k: K, v: Cupo[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function validate(f: Partial<Cupo>) {
    const e: Record<string, string> = {};
    if (!f.servicioId) e.servicioId = "Selecciona servicio.";
    if (!f.fecha) e.fecha = "Elige fecha (YYYY-MM-DD).";
    if (!f.hora) e.hora = "Elige hora (HH:mm).";
    const cap = Number(f.capacidad ?? 0);
    const occ = Number(f.ocupados ?? 0);
    if (!Number.isFinite(cap) || cap < 0) e.capacidad = "Capacidad inválida.";
    if (!Number.isFinite(occ) || occ < 0) e.ocupados = "Ocupados inválido.";
    if (cap < occ) e.ocupados = "Ocupados no puede exceder capacidad.";
    return e;
  }

  async function save() {
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload: Cupo = {
      id: (form.id as string) || `c-${uid8()}`,
      servicioId: form.servicioId as string,
      fecha: form.fecha as string,
      hora: form.hora as string,
      capacidad: Number(form.capacidad ?? 0),
      ocupados: Number(form.ocupados ?? 0),
      activo: !!form.activo,
    };

    const exists = data.some(c => c.id === payload.id);
    const prev = data;
    const next = exists ? prev.map(c => c.id === payload.id ? payload : c) : [payload, ...prev];
    setData(next);

    try {
      const res = await fetch(exists ? `/api/cupos/${encodeURIComponent(payload.id)}` : "/api/cupos", {
        method: exists ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setForm({ servicioId: "", fecha: "", hora: "", capacidad: 0, ocupados: 0, activo: true });
    } catch {
      setData(prev);
      alert("No se pudo guardar el cupo. Revisa tu API.");
    }
  }

  async function toggleActivo(c: Cupo) {
    setBusyRow(m => ({ ...m, [c.id]: true }));
    const prev = data;
    const next = prev.map(x => x.id === c.id ? { ...x, activo: !x.activo } : x);
    setData(next);
    try {
      const res = await fetch(`/api/cupos/${encodeURIComponent(c.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !c.activo }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setData(prev);
      alert("No se pudo actualizar el estado.");
    } finally {
      setBusyRow(m => ({ ...m, [c.id]: false }));
    }
  }

  async function removeCupo(id: string) {
    if (!confirm("¿Eliminar este cupo?")) return;
    setBusyRow(m => ({ ...m, [id]: true }));
    const prev = data;
    const next = prev.filter(x => x.id !== id);
    setData(next);
    try {
      const res = await fetch(`/api/cupos/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setData(prev);
      alert("No se pudo eliminar.");
    } finally {
      setBusyRow(m => ({ ...m, [id]: false }));
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const mapServ = new Map(servicios.map(s => [s.id, s.nombre.toLowerCase()]));
    return data.filter(c =>
      [
        c.fecha,
        c.hora,
        String(c.capacidad),
        String(c.ocupados),
        c.activo ? "activo" : "inactivo",
        mapServ.get(c.servicioId) || "",
      ].some(v => v.includes(q))
    );
  }, [data, servicios, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cupos & Horarios</h1>
        <p className="text-sm opacity-70">Administra la capacidad por servicio, fecha y hora.</p>
      </header>

      {msg && <p className="text-xs mb-3 opacity-70">{msg}</p>}

      {/* Formulario */}
      <Card className="rounded-2xl mb-6">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Servicio *</label>
            <select
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2"
              value={form.servicioId || ""}
              onChange={e => onChange("servicioId", e.target.value as unknown as Cupo["servicioId"])}
            >
              <option value="">Selecciona servicio</option>
              {servicios.filter(s => s.activo).map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
            {errors.servicioId && <p className="text-xs text-red-400 mt-1">{errors.servicioId}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha *</label>
            <Input type="date" value={form.fecha || ""} onChange={e => onChange("fecha", e.target.value)} />
            {errors.fecha && <p className="text-xs text-red-400 mt-1">{errors.fecha}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Hora *</label>
            <Input type="time" value={form.hora || ""} onChange={e => onChange("hora", e.target.value)} />
            {errors.hora && <p className="text-xs text-red-400 mt-1">{errors.hora}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Capacidad *</label>
            <Input type="number" value={form.capacidad ?? 0} onChange={e => onChange("capacidad", Math.max(0, Number(e.target.value)))} />
            {errors.capacidad && <p className="text-xs text-red-400 mt-1">{errors.capacidad}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Ocupados</label>
            <Input type="number" value={form.ocupados ?? 0} onChange={e => onChange("ocupados", Math.max(0, Number(e.target.value)))} />
            {errors.ocupados && <p className="text-xs text-red-400 mt-1">{errors.ocupados}</p>}
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={save}>Guardar</Button>
            <Button variant="ghost" onClick={() => setForm({ servicioId: "", fecha: "", hora: "", capacidad: 0, ocupados: 0, activo: true })}>
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtro */}
      <div className="mb-3">
        <Input
          placeholder="Buscar por servicio, fecha, hora, estado…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          className="w-[320px]"
        />
      </div>

      {/* Tabla */}
      <Card className="rounded-2xl">
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3 text-right">Capacidad</th>
                <th className="px-4 py-3 text-right">Ocupados</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-center opacity-70" colSpan={7}>Cargando…</td></tr>
              ) : slice.length === 0 ? (
                <tr><td className="px-4 py-6 text-center opacity-70" colSpan={7}>{msg || "Sin resultados."}</td></tr>
              ) : (
                slice.map((c) => {
                  const s = servicios.find(x => x.id === c.servicioId);
                  const busy = !!busyRow[c.id];
                  return (
                    <tr key={c.id} className="border-t border-white/10">
                      <td className="px-4 py-3">{s ? s.nombre : "—"}</td>
                      <td className="px-4 py-3">{c.fecha}</td>
                      <td className="px-4 py-3">{c.hora}</td>
                      <td className="px-4 py-3 text-right">{c.capacidad}</td>
                      <td className="px-4 py-3 text-right">{c.ocupados}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2 py-1 text-xs ${c.activo ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"}`}>
                          {c.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" disabled={busy} onClick={() => { setForm(c); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" disabled={busy} onClick={() => toggleActivo(c)}>
                            {busy ? "..." : (c.activo ? "Desactivar" : "Activar")}
                          </Button>
                          <Button variant="ghost" size="sm" disabled={busy} onClick={() => removeCupo(c.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs opacity-70">Página {pageSafe} de {totalPages} — {filtered.length} resultado(s)</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pageSafe <= 1}>Anterior</Button>
          <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe >= totalPages}>Siguiente</Button>
        </div>
      </div>
    </main>
  );
}

/** Utils **/
function uid8() { return Math.random().toString(36).slice(2, 10); }
