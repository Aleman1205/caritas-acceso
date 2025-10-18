"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type Reserva } from "@/lib/api";

export default function DashboardPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [buscarId, setBuscarId] = useState<string>("");
  const [detalle, setDetalle] = useState<Reserva | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState<boolean>(false);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);

  async function cargarReservas() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReservas();
      setReservas(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  }

  async function buscarReserva() {
    setDetalle(null);
    setErrorDetalle(null);
    if (!buscarId.trim()) return;
    setLoadingDetalle(true);
    try {
      const r = await api.getReserva(buscarId.trim());
      setDetalle(r || null);
    } catch (e: any) {
      setErrorDetalle(e?.message || "No se pudo obtener la reserva");
    } finally {
      setLoadingDetalle(false);
    }
  }

  useEffect(() => {
    cargarReservas();
  }, []);

  const total = useMemo(() => reservas.length, [reservas]);

  return (
    <main style={{ padding: 16, display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>

      {/* Buscador por IdTransaccion */}
      <section style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Buscar reserva por IdTransaccion</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="IdTransaccion"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={buscarReserva} disabled={loadingDetalle || !buscarId.trim()}>
            {loadingDetalle ? "Buscando…" : "Buscar"}
          </button>
        </div>
        {errorDetalle && <p style={{ color: "crimson" }}>Error: {errorDetalle}</p>}
        {detalle && (
          <div style={{ border: "1px solid #333", borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Detalle</h3>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(detalle, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* Lista de reservas */}
      <section style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ margin: 0 }}>Reservas</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={cargarReservas} disabled={loading}>
              {loading ? "Actualizando…" : "Actualizar"}
            </button>
            <span style={{ opacity: 0.8 }}>Total: {total}</span>
          </div>
        </div>

        {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
        {loading && !reservas.length && <p>Cargando reservas…</p>}
        {!loading && !error && !reservas.length && <p>No hay reservas.</p>}

        {!loading && !error && !!reservas.length && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 600,
                border: "1px solid #333",
              }}
            >
              <thead>
                <tr>
                  <th style={th}>IdTransaccion</th>
                  <th style={th}>Estado</th>
                  <th style={th}>Fecha</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r, i) => (
                  <tr key={`${r.IdTransaccion || i}`} style={{ borderTop: "1px solid #333" }}>
                    <td style={td}>{r.IdTransaccion ?? ""}</td>
                    <td style={td}>{(r as any).Estado ?? ""}</td>
                    <td style={td}>{(r as any).Fecha ?? ""}</td>
                    <td style={td}>
                      <button
                        onClick={() => {
                          setBuscarId(String(r.IdTransaccion || ""));
                          // Opcional: disparar búsqueda inmediata
                          // buscarReserva();
                        }}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: 8, borderBottom: "1px solid #333" };
const td: React.CSSProperties = { padding: 8, verticalAlign: "top" };
