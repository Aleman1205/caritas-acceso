// src/pages/api/paradas/obtener.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/web/parada`;
  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
}
