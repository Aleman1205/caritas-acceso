import "./globals.css"
import { Navbar } from "@/components/layout/navbar"

export const metadata = {
  title: "Caritas",
  description: "Caritas frontend app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0f172a] text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
