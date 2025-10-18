"use client";

import { useEffect, useMemo, useState } from "react";
import { api, Sede, Servicio, SedeServicio } from "@/lib/api";


/* Util: normaliza cualquier respuesta a array */
function asArray<T>(x: any): T[] {
  if (!x) return [];
  if (Array.isArray(x)) return x as T[];
  if (Array.isArray(x?.data)) return x.data as T[];
  return [];
}

/* Util: convierte id posiblemente string a number | undefined */
function asNumId(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return Number(v);
  }
  return undefined;
}

export default function SedesPage() {
  // Datos base
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [asignaciones, setAsignaciones] = useState<SedeServicio[]>([]);

  // Formulario
  const [sedeSel, setSedeSel] = useState<number | undefined>();
  const [servSel, setServSel] = useState<number | undefined>();

  // Cargando
  const [loading, setLoading] = useState(false);

  async function cargarTodo() {
    try {
      setLoading(true);
      const [sd, sv, as] = await Promise.all([
        api.getSedes(),
        api.getServicios(),
        api.getSedeServicios(),
      ]);

      setSedes(asArray<Sede>(sd));
      setServicios(asArray<Servicio>(sv));
      setAsignaciones(asArray<SedeServicio>(as));
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  // Ciudades detectadas (Set para no repetir)
  const ciudades = useMemo(() => {
    const s = new Set<string>();
    sedes.forEach((x: any) => {
      const c = x?.Ciudad ?? x?.ciudad ?? x?.city;
      if (c) s.add(String(c));
    });
    return Array.from(s);
  }, [sedes]);

  async function guardarAsignacion() {
    const idSede = asNumId(sedeSel);
    const idServicio = asNumId(servSel);
    if (!idSede || !idServicio) return;

    try {
      setLoading(true);
      // Enviar Estatus:true para que quede Activa
      await api.createSedeServicio({
        IdSede: idSede,
        IdServicio: idServicio,
        Estatus: true,
        // Si quisieras, puedes enviar más campos:
        // Capacidad: 0,
        // Precio: 0,
        // HoraInicio: "08:00",
        // HoraFinal: "14:00",
      });

      setSedeSel(undefined);
      setServSel(undefined);
      await cargarTodo();
    } catch (e) {
      console.error("Error al crear asignación:", e);
    } finally {
      setLoading(false);
    }
  }

  async function eliminarAsignacion(id: number) {
    try {
      setLoading(true);
      // El endpoint espera body: { Ids: number[] }
      await api.deleteSedeServicios([id]);
      await cargarTodo();
    } catch (e) {
      console.error("Error al eliminar asignación:", e);
    } finally {
      setLoading(false);
    }
  }

  // Helpers para mostrar nombres en la tabla de asignaciones
  const nombreSede = (id?: number | string) => {
    const n = asNumId(id);
    const found = sedes.find((s) => asNumId(s?.Id) === n);
    return found?.Nombre ?? "-";
  };
  const nombreServicio = (id?: number | string) => {
    const n = asNumId(id);
    const found = servicios.find((s) => asNumId(s?.Id) === n);
    return found?.Nombre ?? "-";
  };

  return (
    <div className="space-y-8 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Sedes</h1>
        <button
          onClick={cargarTodo}
          className="rounded-md bg-gray-700/40 px-4 py-2 text-gray-100 hover:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      {/* Ciudades */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Ciudades detectadas</h2>
        {ciudades.length === 0 ? (
          <p className="text-gray-400">Sin ciudades</p>
        ) : (
          <ul className="list-disc pl-6 text-gray-200">
            {ciudades.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Tabla de sedes */}
      <section className="rounded-lg border border-gray-700/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-800/40 text-gray-300">
                <th className="px-4 py-3 text-left">Sede</th>
                <th className="px-4 py-3 text-left">Ciudad</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sedes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Sin resultados.
                  </td>
                </tr>
              ) : (
                sedes.map((s) => (
                  <tr key={String(s.Id)} className="border-t border-gray-800">
                    <td className="px-4 py-3">{s.Nombre ?? "-"}</td>
                    <td className="px-4 py-3">{(s as any).Ciudad ?? "-"}</td>
                    <td className="px-4 py-3">{(s as any).Direccion ?? "-"}</td>
                    <td className="px-4 py-3">{(s as any).Telefono ?? "-"}</td>
                    <td className="px-4 py-3">
                      {(s as any).Estatus === true ||
                      (s as any).Estatus === 1
                        ? "Activa"
                        : (s as any).Estatus === false ||
                          (s as any).Estatus === 0
                        ? "Inactiva"
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Form: asignar servicio a sede */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Asignar servicio a sede</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2 text-gray-100 outline-none"
            value={sedeSel ?? ""}
            onChange={(e) =>
              setSedeSel(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">Selecciona sede</option>
            {sedes.map((s) => (
              <option key={String(s.Id)} value={String(s.Id)}>
                {s.Nombre}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2 text-gray-100 outline-none"
            value={servSel ?? ""}
            onChange={(e) =>
              setServSel(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">Selecciona servicio</option>
            {servicios.map((s) => (
              <option key={String(s.Id)} value={String(s.Id)}>
                {s.Nombre}
              </option>
            ))}
          </select>

          <button
            onClick={guardarAsignacion}
            disabled={!sedeSel || !servSel || loading}
            className="rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar asignación"}
          </button>
        </div>
      </section>

      {/* Listado de asignaciones */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Asignaciones</h2>

        <div className="rounded-lg border border-gray-700/60">
          <div className="overflow-x-auto">
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
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Sin resultados.
                    </td>
                  </tr>
                ) : (
                  asignaciones.map((a) => {
                    const estadoTxt =
                      a.Estatus === true || (a as any).Estatus === 1
                        ? "Activa"
                        : a.Estatus === false || (a as any).Estatus === 0
                        ? "Inactiva"
                        : "—";
                    return (
                      <tr
                        key={String(a.Id)}
                        className="border-t border-gray-800"
                      >
                        <td className="px-4 py-3">
                          {nombreSede(a.IdSede)}
                        </td>
                        <td className="px-4 py-3">
                          {nombreServicio(a.IdServicio)}
                        </td>
                        <td className="px-4 py-3">{estadoTxt}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              a?.Id && eliminarAsignacion(Number(a.Id))
                            }
                            className="rounded-md bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-500"
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
