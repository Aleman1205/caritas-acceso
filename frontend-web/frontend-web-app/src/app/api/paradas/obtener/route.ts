// src/app/api/paradas/obtener/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL no definido");

    // Obtiene query ?nombre=...
    const { searchParams } = new URL(req.url);
    const nombre = searchParams.get("nombre") || "";

    // Construye la URL para el backend
    const url = nombre
      ? `${backendUrl}/web/parada.routes/${encodeURIComponent(nombre)}`
      : `${backendUrl}/web/parada.routes`;

    console.log("Llamando al backend:", url);

    const res = await fetch(url);
    const text = await res.text();
    console.log("Respuesta del backend:", text);

    if (!res.ok) throw new Error(`Backend respondió con ${res.status}`);

    return NextResponse.json(JSON.parse(text));
  } catch (err: any) {
    console.error("[API /paradas/obtener] Error:", err.message || err);
    return NextResponse.json(
      { error: "No se pudo obtener paradas" },
      { status: 500 }
    );
  }
}
