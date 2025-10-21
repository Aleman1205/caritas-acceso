"use client";

import { useEffect, useState } from "react";
import { api, type Cupo } from "@/lib/api";

export default function CuposPage() {
  const [items, setItems] = useState<Cupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<Cupo> & { id?: number }>({});

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const res = await api.getCupos();
      setItems(res.data || []);
    } catch (e:any) {
      setErr(e?.message || "Error cargando cupos");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c: Cupo) => {
    setEdit({
      id: c.id,
      capacidad: c.capacidad,
      precio: c.precio,
      horainicio: c.horainicio,
      horafinal: c.horafinal,
      estatus: c.estatus,
    });
  };

  const save = async () => {
    if (!edit.id) return;
    setLoading(true); setErr(null);
    try {
      await api.updateCupo(edit.id, {
        capacidad: Number(edit.capacidad),
        precio: Number(edit.precio),
        horainicio: String(edit.horainicio),
        horafinal: String(edit.horafinal),
        estatus: Boolean(edit.estatus),
      });
      setEdit({});
      await load();
    } catch (e:any) {
      setErr(e?.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Cupos y horarios</h1>
        <p className="text-sm text-slate-400">Ver y editar capacidad, horario y estatus.</p>
      </header>

      {err && <div className="rounded-md border border-red-600 bg-red-900/30 px-4 py-2 text-red-200">{err}</div>}

      <div className="rounded-xl border border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-slate-400">{loading ? "Cargando..." : `${items.length} registro(s)`}</div>
          <button onClick={load} disabled={loading} className="h-9 rounded-md bg-slate-700 px-3 text-white disabled:opacity-50">Recargar</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Sede</th>
                <th className="p-3 text-left">Servicio</th>
                <th className="p-3 text-left">Capacidad</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Hora inicio</th>
                <th className="p-3 text-left">Hora final</th>
                <th className="p-3 text-left">Estatus</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={9} className="p-4 text-slate-400">Sin resultados.</td></tr>
              ) : items.map((c) => (
                <tr key={c.id} className="border-b border-slate-800">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.sede}</td>
                  <td className="p-3">{c.servicio}</td>
                  <td className="p-3">{c.capacidad}</td>
                  <td className="p-3">{c.precio}</td>
                  <td className="p-3">{c.horainicio}</td>
                  <td className="p-3">{c.horafinal}</td>
                  <td className="p-3">{c.estatus ? "activo" : "inactivo"}</td>
                  <td className="p-3">
                    <button onClick={() => startEdit(c)} className="h-8 rounded-md bg-amber-600 px-3 text-white">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor simple inline */}
      {edit.id && (
        <div className="rounded-xl border border-slate-700 p-4 space-y-3">
          <h2 className="font-medium">Editar cupo #{edit.id}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2" type="number"
              placeholder="Capacidad" value={edit.capacidad ?? ""} onChange={e=>setEdit(s=>({...s,capacidad:e.target.valueAsNumber}))}/>
            <input className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2" type="number"
              placeholder="Precio" value={edit.precio ?? ""} onChange={e=>setEdit(s=>({...s,precio:e.target.valueAsNumber}))}/>
            <input className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2" placeholder="HH:MM:SS"
              value={edit.horainicio ?? ""} onChange={e=>setEdit(s=>({...s,horainicio:e.target.value}))}/>
            <input className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2" placeholder="HH:MM:SS"
              value={edit.horafinal ?? ""} onChange={e=>setEdit(s=>({...s,horafinal:e.target.value}))}/>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={!!edit.estatus} onChange={e=>setEdit(s=>({...s,estatus:e.target.checked}))}/>
              <span>Estatus activo</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={loading}
              className="h-9 rounded-md bg-emerald-600 px-4 text-white disabled:opacity-50">Guardar</button>
            <button onClick={()=>setEdit({})}
              className="h-9 rounded-md bg-slate-700 px-4 text-white">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
