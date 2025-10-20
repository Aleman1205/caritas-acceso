package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel

data class ServicioDetalle(
  val titulo: String,
  val descripcion: String
)

@Composable
fun ConsultarServiciosScreen(navController: NavController, viewModel: CaritasViewModel) {
  val sede = "Cáritas Monterrey - Centro"
  val direccion = "Av. Pino Suárez 305, Centro Monterrey, N.L."
  val contacto = "Tel: 81 1234 5678"
  val horario = "Todos los días, 24 horas"

  val servicios = listOf(
    ServicioDetalle(
      "Atención Médica",
      "Doctor: Dr. Omar Caballero\nHorario: 9:00 AM - 5:00 PM"
    ),
    ServicioDetalle(
      "Alimentos",
      "Desayuno: 8:00 AM - 9:00 AM\nComida: 1:00 PM - 2:30 PM\nCena: 7:00 PM - 8:00 PM"
    ),
    ServicioDetalle(
      "Lavandería",
      "Estaciones Disponibles: 6\nHorario: 9:00 AM - 6:00 PM"
    ),
    ServicioDetalle(
      "Alojamiento",
      "Capacidad total: 50 personas\nHabitaciones: 10\nÁrea común con ventilación y agua caliente"
    ),
    ServicioDetalle(
      "Transporte Solidario",
      "Rutas disponibles: El destino que usted elija pero siempre partiendo del Sede\nPara ir al sede donde usted esté en Monterrey"
    )
  )

  Surface(
    modifier = Modifier.fillMaxSize(),
    color = Color.White
  ) {
    LazyColumn(
      modifier = Modifier
        .fillMaxSize()
        .padding(horizontal = 20.dp, vertical = 28.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp),
      horizontalAlignment = Alignment.Start
    ) {
      item {
        Text(
          text = sede,
          fontSize = 24.sp,
          fontWeight = FontWeight.Bold,
          color = CaritasNavy,
          modifier = Modifier.padding(bottom = 12.dp)
        )

        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = CaritasBlueTeal.copy(alpha = 0.1f)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(
            modifier = Modifier.padding(16.dp)
          ) {
            Text(text = "Dirección:", fontWeight = FontWeight.Bold, color = CaritasNavy)
            Text(text = direccion, color = CaritasNavy.copy(alpha = 0.8f))

            Spacer(modifier = Modifier.height(6.dp))

            Text(text = "Contacto:", fontWeight = FontWeight.Bold, color = CaritasNavy)
            Text(text = contacto, color = CaritasNavy.copy(alpha = 0.8f))

            Spacer(modifier = Modifier.height(6.dp))

            Text(text = "Horario:", fontWeight = FontWeight.Bold, color = CaritasNavy)
            Text(text = horario, color = CaritasNavy.copy(alpha = 0.8f))
          }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
          text = "Servicios disponibles",
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = CaritasNavy
        )

        Divider(
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
          color = CaritasBlueTeal.copy(alpha = 0.3f),
          thickness = 1.dp
        )
      }

      items(servicios.size) { index ->
        val servicio = servicios[index]
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(
            modifier = Modifier.padding(16.dp)
          ) {
            Text(
              text = servicio.titulo,
              fontSize = 18.sp,
              fontWeight = FontWeight.Bold,
              color = CaritasNavy
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
              text = servicio.descripcion,
              fontSize = 15.sp,
              color = CaritasNavy.copy(alpha = 0.9f),
              lineHeight = 20.sp
            )
          }
        }
      }

      item {
        Spacer(modifier = Modifier.height(30.dp))
      }
    }
  }
}
