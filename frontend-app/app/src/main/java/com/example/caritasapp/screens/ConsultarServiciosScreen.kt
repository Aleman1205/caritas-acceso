package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import com.example.caritasapp.network.ServicioItem

@Composable
fun ConsultarServiciosScreen(
  navController: NavController,
  viewModel: CaritasViewModel
) {
  val sedeName = viewModel.selectedSedeName.value ?: "Sede sin nombre"

  val servicios = viewModel.servicios.value
  val isLoading = viewModel.isLoadingServicios.value
  val error = viewModel.errorServicios.value

  // Fetch services once when the screen opens
  LaunchedEffect(Unit) {
    viewModel.getServiciosPorSede()
  }

  Surface(
    modifier = Modifier.fillMaxSize(),
    color = Color.White
  ) {
    when {
      isLoading -> {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
          CircularProgressIndicator(color = CaritasNavy)
        }
      }

      error != null -> {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
          Text(
            text = error,
            color = Color.Red,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(24.dp)
          )
        }
      }

      servicios.isEmpty() -> {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
          Text(
            text = "No hay servicios registrados en esta sede.",
            color = CaritasNavy,
            fontSize = 18.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(24.dp)
          )
        }
      }

      else -> {
        LazyColumn(
          modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 28.dp),
          verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
          item {
            Text(
              text = sedeName,
              fontSize = 24.sp,
              fontWeight = FontWeight.Bold,
              color = CaritasNavy,
              modifier = Modifier.padding(bottom = 12.dp)
            )

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

          items(servicios) { servicio ->
            ServicioCard(servicio)
          }

          item { Spacer(modifier = Modifier.height(30.dp)) }
        }
      }
    }
  }
}

@Composable
fun ServicioCard(servicio: ServicioItem) {
  Card(
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = CaritasBlueTeal.copy(alpha = 0.1f)),
    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    modifier = Modifier.fillMaxWidth()
  ) {
    Column(modifier = Modifier.padding(16.dp)) {
      Text(
        text = servicio.nombreservicio,
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy
      )

      servicio.descripcion?.let {
        Text(
          text = it,
          fontSize = 15.sp,
          color = CaritasNavy.copy(alpha = 0.9f),
          lineHeight = 20.sp,
          modifier = Modifier.padding(top = 4.dp)
        )
      }

      servicio.capacidad?.let {
        Text(
          text = "Capacidad: $it",
          fontSize = 14.sp,
          color = CaritasNavy.copy(alpha = 0.9f),
          modifier = Modifier.padding(top = 6.dp)
        )
      }

      Row(modifier = Modifier.padding(top = 4.dp)) {
        servicio.horainicio?.let {
          Text(
            text = "Inicio: $it",
            color = CaritasNavy.copy(alpha = 0.9f),
            fontSize = 14.sp
          )
        }
        Spacer(modifier = Modifier.width(12.dp))
        servicio.horafinal?.let {
          Text(
            text = "Fin: $it",
            color = CaritasNavy.copy(alpha = 0.9f),
            fontSize = 14.sp
          )
        }
      }
    }
  }
}
