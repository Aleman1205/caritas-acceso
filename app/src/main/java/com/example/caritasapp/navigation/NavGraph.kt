package com.example.caritasapp.navigation

import android.window.SplashScreen
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.caritasapp.screens.*

sealed class Screen(val route: String) {
  object Splash : Screen("splash")
  object Terms : Screen("terms")
  object Start : Screen("start")
  object Home : Screen("home")
  object Sedes : Screen("Sedes")
  object Reserve : Screen("reserve")
  object ReservationForm : Screen("reservation_form")
  object ReservationQR : Screen("reservation_qr")
  object Transporte : Screen("transporte")
  object ConsultarServicios : Screen("consultar_servicios")
}

// CAMBIO 1: agregar el parámetro startDestination en la función
@Composable
fun AppNavGraph(
  navController: NavHostController,
  startDestination: String //  agregado
) {
  // CAMBIO 2: usar el startDestination que viene del MainActivity
  NavHost(
    navController = navController,
    startDestination = startDestination // <-- eemplaza Screen.Splash.route
  ) {
    composable(Screen.Splash.route) { SplashScreen(navController) }
    composable(Screen.Terms.route) { TermsScreen(navController) }
    composable(Screen.Start.route) { StartScreen(navController) }
    composable(Screen.Home.route) { HomeScreen(navController) }
    composable(Screen.Sedes.route) { SedeScreen(navController) }
    composable(Screen.Reserve.route) { ReserveScreen(navController) }
    composable(Screen.ReservationForm.route) { ReservationFormScreen(navController) }
    composable(Screen.ReservationQR.route) { ReservationQRScreen(navController) }
    composable(Screen.Transporte.route) { TransporteScreen(navController) }
    composable(Screen.ConsultarServicios.route) { ConsultarServiciosScreen(navController) }
  }
}
