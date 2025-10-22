'use client';

import { useEffect, useMemo, useState } from "react";

type Sede = { Id: number; Nombre: string; Ciudad?: string; Direccion?: string; Telefono?: string; Estatus?: boolean | 0 | 1; };
type Servicio = { Id: number; Nombre: string; Descripcion?: string; Estatus?: boolean | 0 | 1; };
type SedeServicio = { Id: number; IdSede: number; IdServicio: number; Estatus?: boolean | 0 | 1; };

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

/* Util: normaliza cualquier respuesta a array */
function asArray<T>(x: any): T[] {
  if (!x) return [];
  if (Array.isArray(x)) return x as T[];
  if (Array.isArray(x?.data)) return x.data as T[];
  return [];
}

/* Convierte id posiblemente string a number */
function asNumId(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [asignaciones, setAsignaciones] = useState<SedeServicio[]>([]);
  const [sedeSel, setSedeSel] = useState<number | undefined>();
  const [servSel, setServSel] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

    async function cargarTodo() {
    try {
      setLoading(true);

      // Fetch directamente desde el backend
      const [sdRes, svRes, asRes] = await Promise.all([
        fetch(`${BACKEND_URL}/web/sedes`),
        fetch(`${BACKEND_URL}/web/servicios`),
        fetch(`${BACKEND_URL}/web/sedeservicio`)
      ]);

      const [sdJson, svJson, asJson] = await Promise.all([
        sdRes.json(),
        svRes.json(),
        asRes.json()
      ]);

      // Normalizar arrays
      const sedesArray = Array.isArray(sdJson.data) ? sdJson.data : [];
      const serviciosArray = Array.isArray(svJson.data) ? svJson.data : [];
      const asignacionesArray = Array.isArray(asJson.data) ? asJson.data : [];

      setSedes(sedesArray);
      setServicios(serviciosArray);
      setAsignaciones(asignacionesArray);

    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
    }


  useEffect(() => { cargarTodo(); }, []);

  // Ciudades detectadas solo de sedes con asignaciones activas
  const ciudades = useMemo(() => {
    const s = new Set<string>();
    const asignActivas = asignaciones.filter(a => a.Estatus === true || a.Estatus === 1);
    asignActivas.forEach(a => {
      const sede = sedes.find(s => s.Id === a.IdSede);
      if (sede?.Ciudad) s.add(sede.Ciudad);
    });
    return Array.from(s);
  }, [sedes, asignaciones]);

  async function guardarAsignacion() {
    const idSede = asNumId(sedeSel);
    const idServicio = asNumId(servSel);
    if (!idSede || !idServicio) return;

    try {
      setLoading(true);
      await fetch(`${BACKEND_URL}/web/sedeservicio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdSede: idSede, IdServicio: idServicio, Estatus: true })
      });
      setSedeSel(undefined);
      setServSel(undefined);
      await cargarTodo();
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  }

  async function eliminarAsignacion(id: number) {
    try {
      setLoading(true);
      await fetch(`${BACKEND_URL}/web/sedeservicio`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Ids: [id] })
      });
      await cargarTodo();
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  }

  const nombreSede = (id?: number) => sedes.find(s => s.Id === id)?.Nombre ?? "-";
  const nombreServicio = (id?: number) => servicios.find(s => s.Id === id)?.Nombre ?? "-";

  return (
    <div className="space-y-8 px-2 sm:px-0">
      <h1 className="text-3xl font-semibold">Sedes</h1>

      {/* Ciudades detectadas */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Ciudades detectadas</h2>
        {ciudades.length === 0 ? (
          <p className="text-gray-400">Sin ciudades</p>
        ) : (
          <ul className="list-disc pl-6 text-gray-200">
            {ciudades.map(c => <li key={c}>{c}</li>)}
          </ul>
        )}
      </section>

      {/* Selección de sedes y servicios */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Asignar servicio a sede</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={sedeSel ?? ""}
            onChange={e => setSedeSel(e.target.value ? Number(e.target.value) : undefined)}
            className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2 text-gray-100 outline-none"
          >
            <option value="">Selecciona sede</option>
            {sedes.map(s => <option key={s.Id} value={s.Id}>{s.Nombre}</option>)}
          </select>

          <select
            value={servSel ?? ""}
            onChange={e => setServSel(e.target.value ? Number(e.target.value) : undefined)}
            className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2 text-gray-100 outline-none"
          >
            <option value="">Selecciona servicio</option>
            {servicios.map(s => <option key={s.Id} value={s.Id}>{s.Nombre}</option>)}
          </select>

          <button
            onClick={guardarAsignacion}
            disabled={!sedeSel || !servSel || loading}
            className="rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar asignación"}
          </button>
        </div>
      </section>

      {/* Listado de asignaciones */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Asignaciones</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700/60">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-800/40 text-gray-300">
                <th className="px-4 py-3 text-left">Sede</th>
                <th className="px-4 py-3 text-left">Servicio</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">Sin resultados.</td></tr>
              ) : (
                asignaciones.map(a => {
                  const esActivo = a.Estatus === true || a.Estatus === 1;
                  return (
                    <tr key={a.Id} className="border-t border-gray-800">
                      <td className="px-4 py-3">{nombreSede(a.IdSede)}</td>
                      <td className="px-4 py-3">{nombreServicio(a.IdServicio)}</td>
                      <td className="px-4 py-3">{esActivo ? "Activa" : "Inactiva"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => eliminarAsignacion(a.Id)}
                          className="rounded-md bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-500 disabled:opacity-60"
                          disabled={loading}
                        >Eliminar</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
