import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
      <Card className="w-full max-w-md p-6 bg-[#1e293b] text-white shadow-lg rounded-2xl border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Bienvenido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="Correo"
                className="bg-[#0f172a] text-white border-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                className="bg-[#0f172a] text-white border-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Iniciar sesión
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            No tienes cuenta?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Crear una
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
