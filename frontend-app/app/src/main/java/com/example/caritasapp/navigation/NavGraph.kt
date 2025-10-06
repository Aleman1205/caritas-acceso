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
  object Home : Screen("home")
}

@Composable
fun AppNavGraph(navController: NavHostController) {
  NavHost(
    navController = navController,
    startDestination = Screen.Splash.route
  ) {
    composable(Screen.Splash.route) { SplashScreen(navController) }
    composable(Screen.Terms.route) { TermsScreen(navController) }
    composable(Screen.Home.route) { HomeScreen(navController) }
  }
}
