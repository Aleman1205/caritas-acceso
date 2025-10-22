import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL no está definido en .env");
    }

    const body = await req.json();
    const res = await fetch(`${backendUrl}/web/parada.routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend respondió con ${res.status}: ${text}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[API /paradas/crear] Error:", err.message || err);
    return NextResponse.json(
      { error: "No se pudo crear la parada" },
      { status: 500 }
    );
  }
}
