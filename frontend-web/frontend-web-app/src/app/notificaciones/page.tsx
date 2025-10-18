"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Tipos **/
type NotiTipo =
  | "capacidad_superada"
  | "cupo_al_limite"
  | "reserva_rechazada"
  | "error_api"
  | "info";

type Notificacion = {
  id: string;
  fechaISO: string; // ISO string
  titulo: string;
  mensaje: string;
  tipo: NotiTipo;
  leida: boolean;
  sedeId?: string;
  servicioId?: string;
  cupoId?: string;
};

/** MOCK (cuando no hay API) */
const NOW = new Date();
const MOCK_NOTIS: Notificacion[] = [
  {
    id: "n-001",
    fechaISO: new Date(NOW.getTime() - 1000 * 60 * 5).toISOString(),
    titulo: "Capacidad superada",
    mensaje:
      "El cupo 10:00 para Lavandería (Sede Centro) excede capacidad (9/8).",
    tipo: "capacidad_superada",
    leida: false,
    sedeId: "sd-01",
    servicioId: "s-03",
    cupoId: "c-04",
  },
  {
    id: "n-002",
    fechaISO: new Date(NOW.getTime() - 1000 * 60 * 60).toISOString(),
    titulo: "Cupo al límite",
    mensaje: "Alimentación 13:00 está al 95% (28/30) en Sede Centro.",
    tipo: "cupo_al_limite",
    leida: false,
    sedeId: "sd-01",
    servicioId: "s-01",
  },
  {
    id: "n-003",
    fechaISO: new Date(NOW.getTime() - 1000 * 60 * 120).toISOString(),
    titulo: "Info sistema",
    mensaje: "Sincronización nocturna completada.",
    tipo: "info",
    leida: true,
  },
];

/** Página */
export default function NotificacionesPage() {
  const [data, setData] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // UI
  const [query, setQuery] = useState("");
  const [fEstado, setFEstado] = useState<"todas" | "no_leidas" | "leidas">(
    "todas"
  );
  const [fTipo, setFTipo] = useState<NotiTipo | "todos">("todos");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // busy por fila
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  // --- CARGA INICIAL + POLLING ---
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch("/api/notificaciones?limit=200", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error("Formato inválido");
        if (alive) setData(json);
      } catch {
        if (alive) {
          setData(MOCK_NOTIS);
          setMsg("Sin servidor: mostrando datos de prueba.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const iv = setInterval(load, 30000); // opcional
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  // --- ACCIONES ---
  async function marcarLeida(id: string, leida = true) {
    setBusy((m) => ({ ...m, [id]: true }));
    const prev = data;
    const next = prev.map((n) => (n.id === id ? { ...n, leida } : n));
    setData(next);
    try {
      const res = await fetch(`/api/notificaciones/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leida }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setData(prev);
      alert("No se pudo actualizar la notificación.");
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
    }
  }

  async function marcarTodasLeidas() {
    const ids = data.filter((n) => !n.leida).map((n) => n.id);
    if (ids.length === 0) return;
    const prev = data;
    const next = prev.map((n) => ({ ...n, leida: true }));
    setData(next);
    try {
      const res = await fetch(`/api/notificaciones/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setData(prev);
      alert("No se pudieron marcar todas como leídas.");
    }
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar esta notificación?")) return;
    setBusy((m) => ({ ...m, [id]: true }));
    const prev = data;
    const next = prev.filter((n) => n.id !== id);
    setData(next);
    try {
      const res = await fetch(`/api/notificaciones/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
    } catch {
      setData(prev);
      alert("No se pudo eliminar.");
    } finally {
      setBusy((m) => ({ ...m, [id]: false }));
    }
  }

  // --- FILTROS + PAGINACIÓN ---
  const filtered = useMemo(() => {
    let arr = data
      .slice()
      .sort((a, b) => +new Date(b.fechaISO) - +new Date(a.fechaISO));

    if (fEstado === "no_leidas") arr = arr.filter((n) => !n.leida);
    if (fEstado === "leidas") arr = arr.filter((n) => n.leida);
    if (fTipo !== "todos") arr = arr.filter((n) => n.tipo === fTipo);

    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((n) =>
        [
          n.titulo,
          n.mensaje,
          n.tipo,
          n.sedeId || "",
          n.servicioId || "",
          n.cupoId || "",
          new Date(n.fechaISO).toLocaleString(),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return arr;
  }, [data, fEstado, fTipo, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // --- RENDER ---
  return (
    <main className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notificaciones
          </h1>
          <p className="text-sm opacity-70">
            Alertas del sistema (capacidad, cupos, reservas y fallos).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={marcarTodasLeidas}
            disabled={!data.some((n) => !n.leida)}
          >
            Marcar todas como leídas
          </Button>
        </div>
      </header>

      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar por título, mensaje, tipo…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-[320px]"
          />

          {/* Estado */}
          <select
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2"
            value={fEstado}
            onChange={(e) => {
              setFEstado(e.target.value as typeof fEstado);
              setPage(1);
            }}
          >
            <option value="todas">Todas</option>
            <option value="no_leidas">No leídas</option>
            <option value="leidas">Leídas</option>
          </select>

          {/* Tipo */}
          <select
            className="rounded-md border border-white/20 bg-white/5 px-3 py-2"
            value={fTipo}
            onChange={(e) => {
              setFTipo(e.target.value as NotiTipo | "todos");
              setPage(1);
            }}
          >
            <option value="todos">Todos los tipos</option>
            <option value="capacidad_superada">Capacidad superada</option>
            <option value="cupo_al_limite">Cupo al límite</option>
            <option value="reserva_rechazada">Reserva rechazada</option>
            <option value="error_api">Error de API</option>
            <option value="info">Info</option>
          </select>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            setFEstado("todas");
            setFTipo("todos");
            setPage(1);
          }}
        >
          Limpiar
        </Button>
      </div>

      {/* Tabla */}
      <Card className="rounded-2xl">
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Mensaje</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-center opacity-70" colSpan={6}>
                    Cargando…
                  </td>
                </tr>
              ) : slice.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center opacity-70" colSpan={6}>
                    {msg || "Sin notificaciones."}
                  </td>
                </tr>
              ) : (
                slice.map((n) => {
                  const isBusy = !!busy[n.id];
                  return (
                    <tr
                      key={n.id}
                      className={`border-t border-white/10 ${
                        !n.leida ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(n.fechaISO).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{n.titulo}</td>
                      <td className="px-4 py-3">{n.mensaje}</td>
                      <td className="px-4 py-3">{labelTipo(n.tipo)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full border px-2 py-1 text-xs ${
                            n.leida
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/15 text-primary border-primary/30"
                          }`}
                        >
                          {n.leida ? "Leída" : "No leída"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isBusy || n.leida}
                            onClick={() => marcarLeida(n.id, true)}
                          >
                            Marcar leída
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => eliminar(n.id)}
                          >
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
        <span className="text-xs opacity-70">
          Página {pageSafe} de {totalPages} — {filtered.length} resultado(s)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageSafe >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </main>
  );
}

function labelTipo(t: NotiTipo) {
  switch (t) {
    case "capacidad_superada":
      return "Capacidad superada";
    case "cupo_al_limite":
      return "Cupo al límite";
    case "reserva_rechazada":
      return "Reserva rechazada";
    case "error_api":
      return "Error de API";
    default:
      return "Info";
  }
}
