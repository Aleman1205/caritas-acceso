"use client";

import { useEffect, useMemo, useState } from "react";

export default function SedesPage() {
  // Datos base (manuales / estáticos)
  const sedes = [
    { Id: 1, Nombre: "Sede Monterrey Centro", Ciudad: "Monterrey", Direccion: "Centro de Monterrey", Estatus: true },
    { Id: 2, Nombre: "Cáritas Monterrey - Norte", Ciudad: "San Nicolás", Direccion: "Zona Norte", Estatus: true },
    { Id: 3, Nombre: "Cáritas Monterrey - Sur", Ciudad: "Guadalupe", Direccion: "Zona Sur", Estatus: true },
    { Id: 4, Nombre: "Cáritas Monterrey - Guadalupe", Ciudad: "Guadalupe", Direccion: "Av. Benito Juárez 123", Estatus: true },
  ];

  const servicios = [
    { Id: 1, Nombre: "Atención Médica" },
    { Id: 2, Nombre: "Alimentos" },
    { Id: 3, Nombre: "Lavandería" },
    { Id: 4, Nombre: "Alojamiento" },
    { Id: 5, Nombre: "Transporte Solidario" },
    { Id: 6, Nombre: "Psicología" },
  ];

  // Estado de asignaciones
  const [asignaciones, setAsignaciones] = useState<
    { Id: number; IdSede: number; IdServicio: number; Estatus: boolean }[]
  >([]);

  // Formulario
  const [sedeSel, setSedeSel] = useState<number | undefined>();
  const [servSel, setServSel] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  // Ciudades detectadas
  const ciudades = useMemo(() => {
    const s = new Set<string>();
    sedes.forEach((x) => x.Ciudad && s.add(x.Ciudad));
    return Array.from(s);
  }, [sedes]);

  function guardarAsignacion() {
    if (!sedeSel || !servSel) return;
    const nueva = {
      Id: Date.now(),
      IdSede: sedeSel,
      IdServicio: servSel,
      Estatus: true,
    };
    setAsignaciones((prev) => [...prev, nueva]);
    setSedeSel(undefined);
    setServSel(undefined);
  }

  function eliminarAsignacion(id: number) {
    setAsignaciones((prev) => prev.filter((a) => a.Id !== id));
  }

  const nombreSede = (id?: number | string) =>
    sedes.find((s) => s.Id === Number(id))?.Nombre ?? "-";
  const nombreServicio = (id?: number | string) =>
    servicios.find((s) => s.Id === Number(id))?.Nombre ?? "-";

  return (
    <div className="space-y-8 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Sedes</h1>
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
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sedes.map((s) => (
                <tr key={s.Id} className="border-t border-gray-800">
                  <td className="px-4 py-3">{s.Nombre}</td>
                  <td className="px-4 py-3">{s.Ciudad}</td>
                  <td className="px-4 py-3">{s.Direccion}</td>
                  <td className="px-4 py-3">
                    {s.Estatus ? "Activa" : "Inactiva"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Formulario de asignación */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Asignar servicio a sede</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2 text-gray-100 outline-none"
            value={sedeSel ?? ""}
            onChange={(e) =>
              setSedeSel(e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Selecciona sede</option>
            {sedes.map((s) => (
              <option key={s.Id} value={s.Id}>
                {s.Nombre}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-gray-700 bg-gray-800/40 px-3 py-2 text-gray-100 outline-none"
            value={servSel ?? ""}
            onChange={(e) =>
              setServSel(e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Selecciona servicio</option>
            {servicios.map((s) => (
              <option key={s.Id} value={s.Id}>
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
                  asignaciones.map((a) => (
                    <tr key={a.Id} className="border-t border-gray-800">
                      <td className="px-4 py-3">{nombreSede(a.IdSede)}</td>
                      <td className="px-4 py-3">
                        {nombreServicio(a.IdServicio)}
                      </td>
                      <td className="px-4 py-3">
                        {a.Estatus ? "Activa" : "Inactiva"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => eliminarAsignacion(a.Id)}
                          className="rounded-md bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-500"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
