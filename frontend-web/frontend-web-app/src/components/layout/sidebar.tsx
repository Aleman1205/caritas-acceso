"use client"

import Link from "next/link"
import {
    LayoutDashboard,
    CalendarDays,
    CalendarClock,
    Bus,
    Bell,
    Hotel,
} from "lucide-react"

const navItems = [
    { href: "", label: "Caritas", icon: LayoutDashboard },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reservas", label: "Reservas", icon: CalendarDays },
    { href: "/cupos", label: "Cupos y Horarios", icon: CalendarClock },
    { href: "/transporte/solicitudes", label: "Transporte", icon: Bus },
    { href: "/notificaciones", label: "Notificaciones", icon: Bell },
    { href: "/sedes", label: "Sedes y Servicios", icon: Hotel },
    { href: "/servicios", label: "Servicios", icon: Hotel }
]

export function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-[#0f172a] text-white flex flex-col border-r border-[#1e293b]">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#1e293b] transition"
                        >
                            <Icon className="w-5 h-5 text-blue-400" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="px-4 py-6 space-y-2 border-t border-[#1e293b]">
                <Link
                    href="/configuracion"
                    className="block px-3 py-2 rounded-md hover:bg-[#1e293b]"
                >
                    Configuracion
                </Link>
                <Link
                href="/login"
                className="block px-3 py-2 rounded-md hover:bg-[#1e293b]"
                >
                    Cerrar sesión
                </Link>
            </div>
        </aside>
    )
}