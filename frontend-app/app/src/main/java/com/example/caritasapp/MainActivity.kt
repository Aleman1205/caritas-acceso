package com.example.caritasapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.example.caritasapp.data.UserPreferences
import com.example.caritasapp.navigation.AppNavGraph
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.CaritasAppTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    //Instancia de tus preferencias
    val prefs = UserPreferences(this)

    setContent {
      CaritasAppTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
          val navController = rememberNavController()
          val accepted by prefs.termsAccepted.collectAsState(initial = false)

          // 🔹 Decide la pantalla inicial
          val startDestination = if (accepted) {
            Screen.Start.route   // Ya aceptó
          } else {
            Screen.Terms.route   // No ha aceptado
          }

          // Pasa la ruta inicial a tu AppNavGraph
          AppNavGraph(
            navController = navController,
            startDestination = startDestination
          )
        }
      }
    }
  }
}
