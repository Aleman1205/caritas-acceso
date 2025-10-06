package com.example.caritasapp.screens

import android.R.attr.bottom
import android.R.attr.text
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.CaritasBlueTeal
import com.example.caritasapp.ui.theme.CaritasNavy

@Composable
fun TermsScreen(navController: NavHostController) {
  Surface(
    modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp, vertical = 32.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState()),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center
    ) {
      Text(
        text = "Términos y Condiciones",
        fontSize = 26.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        textAlign = TextAlign.Center,
        modifier = Modifier.padding(bottom = 20.dp)
      )

      Text(
        text = """
                    Bienvenido a la aplicación Cáritas Monterrey. 
                    
                    Esta aplicación tiene como finalidad facilitar la consulta de servicios y apoyos disponibles. 
                    Al usar esta aplicación, aceptas nuestros términos de privacidad y el uso responsable de los datos proporcionados.

                    No recopilamos información sensible sin tu consentimiento explícito. 
                    Si no estás de acuerdo con estos términos, por favor no utilices la aplicación.

                    Cáritas Monterrey se reserva el derecho de actualizar esta política en cualquier momento.
                """.trimIndent(),
        fontSize = 18.sp,
        color = CaritasNavy,
        textAlign = TextAlign.Justify,
        modifier = Modifier.padding(bottom = 36.dp)
      )

      Button(
        onClick = {
          navController.navigate(Screen.Home.route) {
            popUpTo(Screen.Terms.route) { inclusive = true }
          }
        },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
        shape = MaterialTheme.shapes.medium,
        modifier = Modifier
          .fillMaxWidth()
          .height(60.dp)
      ) {
        Text("Aceptar", fontSize = 18.sp)
      }
    }
  }
}
