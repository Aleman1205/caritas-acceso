// components/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const HARDCODED_EMAIL = "carita1@gmail.com";
const HARDCODED_PASSWORD = "Caritas1";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next"); // ej: /reservas, /cupos, etc.

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      if (
        email.trim().toLowerCase() === HARDCODED_EMAIL &&
        pass === HARDCODED_PASSWORD
      ) {
        // Cookie de sesión simple
        document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 30}`;

        // Redirige al "next" si existe, sino a /reservas
        router.replace(next || "/reservas");
      } else {
        setErr("Credenciales inválidas.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6">
      <h1 className="text-xl font-semibold">Iniciar sesión</h1>

      {err && (
        <div className="rounded-md border border-red-600 bg-red-900/30 px-3 py-2 text-sm text-red-200">
          {err}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          placeholder="carita1@gmail.com"
          autoComplete="username"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Contraseña</label>
        <div className="flex gap-2">
          <input
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 text-xs text-slate-200 hover:bg-slate-700"
          >
            {showPass ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      <p className="pt-2 text-center text-xs text-slate-400">
        Tip: <span className="font-mono">carita1@gmail.com / Caritas1</span>
      </p>
    </form>
  );
}
