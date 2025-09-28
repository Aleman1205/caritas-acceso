import "./globals.css"
import { AppLayout } from "@/components/layout/app-layout"

export const metadata = {
  title: "Caritas",
  description: "Caritas frontend app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0f172a] text-white">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
