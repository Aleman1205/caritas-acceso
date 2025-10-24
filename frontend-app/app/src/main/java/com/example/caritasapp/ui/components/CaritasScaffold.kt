package com.example.caritasapp.ui.components

import androidx.compose.material3.TopAppBar
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.CaritasBlueTeal
import com.example.caritasapp.ui.theme.CaritasNavy

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CaritasScaffold(
  navController: NavController,
  showTopBar: Boolean = true,
  content: @Composable (PaddingValues) -> Unit
) {
  val backStackEntry by navController.currentBackStackEntryAsState()
  val currentRoute = backStackEntry?.destination?.route

  // Determine bar style and title automatically
  val (title, type, showBack) = when (currentRoute) {
    Screen.Home.route -> Triple("Inicio", "center", false)
    Screen.Reserve.route -> Triple("Reservar alojamiento", "small", true)
    Screen.ReservationForm.route -> Triple("Formulario de reserva", "medium", true)
    Screen.ReservationQR.route -> Triple("Código QR", "small", true)
    Screen.ConsultarReservas.route -> Triple("Mis Reservas", "medium", true)
    Screen.ConsultarServicios.route -> Triple("Servicios del Sede", "small", true)
    Screen.Transporte.route -> Triple("Transporte Solidario", "small", true)
    Screen.Resena.route -> Triple("Reseña y Valoración", "center", true)
    else -> Triple("", "none", false)
  }

  Scaffold(
    topBar = {
      if (showTopBar && type != "none") {
        when (type) {
          "center" -> CenterAlignedTopAppBar(
            title = {
              Text(
                title,
                color = CaritasNavy,
                style = MaterialTheme.typography.titleLarge
              )
            },
            navigationIcon = {
              if (showBack)
                IconButton(onClick = { navController.popBackStack() }) {
                  Icon(Icons.Default.ArrowBack, null, tint = CaritasNavy)
                }
            },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
              containerColor = CaritasBlueTeal.copy(alpha = 0.1f)
            )
          )

          "medium" -> MediumTopAppBar(
            title = {
              Text(
                title,
                color = CaritasNavy,
                style = MaterialTheme.typography.headlineSmall
              )
            },
            navigationIcon = {
              if (showBack)
                IconButton(onClick = { navController.popBackStack() }) {
                  Icon(Icons.Default.ArrowBack, null, tint = CaritasNavy)
                }
            },
            colors = TopAppBarDefaults.mediumTopAppBarColors(
              containerColor = CaritasBlueTeal.copy(alpha = 0.1f)
            )
          )

          else -> TopAppBar(
            title = {
              Text(
                title,
                color = CaritasNavy,
                style = MaterialTheme.typography.titleLarge
              )
            },
            navigationIcon = {
              if (showBack)
                IconButton(onClick = { navController.popBackStack() }) {
                  Icon(Icons.Default.ArrowBack, null, tint = CaritasNavy)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
              containerColor = CaritasBlueTeal.copy(alpha = 0.1f)
            )
          )
        }
      }
    },
    content = content
  )
}
