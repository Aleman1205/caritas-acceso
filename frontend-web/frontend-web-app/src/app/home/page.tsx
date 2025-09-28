import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const items = [
    {
        title: "Reservas del día",
        description: "Tienes 45 reservas activas. 30 atendidas, 10 pendientes y 5 no-show",
        action: "Ver detalle",
    },
    {
        title: "Consumo de servicios",
        description: "Hoy se han consumido 120 servicios de comida, 15 de lavandería y 25 de alojamiento.",
        action: "Ver consumo",
    },
    {
        title: "Cupos y horarios",
        description: "80% de los cupos ya ocupados. Revisa horarios y ajusta disponibilidad.",
        action: "Actualizar"
    },
    {
        title: "Transporte",
        description: "Hay 3 solicitudes de transporte en espera de aprobación.",
        action: "Gestionar",
    },
    {
        title: "Últimas alertas",
        description: "2 servicios están cerca de su capacidad máxima. Revisa para evitar saturación.",
        action: "Ver notificaciones",
    },
    {
        title: "Reportes semanales",
        description: "Descarga reportes en PDF o Excel con filtros por sede y servicio.",
        action: "Exportar",
    },
]

export default function HomePage() {
    return (
        <div className="flex">
            <main className="flex-1 p-8">
                <h1 className="text-3x1 font-bold mb-8 text-center">Home</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            className="bg-[#1d293b] text-white border-0 shadow-md"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <span>{item.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-300 mb-4">
                                    {item.description}
                                </p>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {item.action}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}