package com.example.caritasapp.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.caritasapp.screens.*
import com.example.caritasapp.viewmodel.CaritasViewModel

sealed class Screen(val route: String) {
  object Splash : Screen("splash")
  object Terms : Screen("terms")
  object Start : Screen("start")
  object Home : Screen("home")
  object Sedes : Screen("sedes")
  object Reserve : Screen("reserve")
  object ReservationForm : Screen("reservation_form")
  object ReservationQR : Screen("reservation_qr")
  object Transporte : Screen("transporte")
  object ConsultarServicios : Screen("consultar_servicios")
  object ConsultarReservas : Screen("consultar_reservas")
}

@Composable
fun AppNavGraph(navController: NavHostController) {
  // ✅ Shared ViewModel for all screens
  val sharedViewModel: CaritasViewModel = viewModel()

  NavHost(
    navController = navController,
    startDestination = Screen.Splash.route
  ) {
    composable(Screen.Splash.route) { SplashScreen(navController) }
    composable(Screen.Terms.route) { TermsScreen(navController) }
    composable(Screen.Start.route) { StartScreen(navController) }

    // ✅ Pass the shared ViewModel to these screens
    composable(Screen.Home.route) { HomeScreen(navController, sharedViewModel) }
    composable(Screen.Sedes.route) { SedeScreen(navController) }
    composable(Screen.Transporte.route) { TransporteScreen(navController, sharedViewModel) }
    composable(Screen.ConsultarServicios.route) { ConsultarServiciosScreen(navController, sharedViewModel) }
    composable(Screen.Reserve.route) { ReserveScreen(navController, sharedViewModel) }
    composable(Screen.ReservationForm.route) { ReservationFormScreen(navController, sharedViewModel) }
    composable(Screen.ReservationQR.route) { ReservationQRScreen(navController, sharedViewModel) }
    composable(Screen.ConsultarReservas.route) { ConsultarReservasScreen(navController, sharedViewModel) }
  }
}
