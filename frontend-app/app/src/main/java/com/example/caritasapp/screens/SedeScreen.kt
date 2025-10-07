package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Color.Companion.White
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*

@Composable
fun SedeScreen(navController: NavHostController) {
  Surface(
    modifier = Modifier.fillMaxSize(),
    color = White
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .padding(horizontal = 24.dp, vertical = 36.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      Text(
        text = "Seleccionar Sede",
        fontSize = 26.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 28.dp)
      )

      Text(
        text = "Elige una sede para ver disponibilidad de fechas y horarios.",
        fontSize = 16.sp,
        color = CaritasNavy.copy(alpha = 0.8f),
        textAlign = TextAlign.Center,
        modifier = Modifier.padding(bottom = 32.dp)
      )

      SedeCard("Sede Central Monterrey", "Av. Juárez 102, Centro", navController)
      SedeCard("Sede San Nicolás", "Calle Reforma 200, San Nicolás", navController)
      SedeCard("Sede Guadalupe", "Av. Miguel Alemán 345, Guadalupe", navController)
      SedeCard("Sede Santa Catarina", "Calle Hidalgo 87, Santa Catarina", navController)
    }
  }
}

@Composable
fun SedeCard(nombre: String, direccion: String, navController: NavHostController) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 10.dp)
      .clickable { navController.navigate(Screen.Reserve.route) },
    colors = CardDefaults.cardColors(containerColor = CaritasBlueTeal),
    shape = RoundedCornerShape(24.dp),
    elevation = CardDefaults.cardElevation(4.dp)
  ) {
    Column(
      modifier = Modifier
        .padding(24.dp),
      horizontalAlignment = Alignment.Start
    ) {
      Text(
        text = nombre,
        color = Color.White,
        fontSize = 20.sp,
        fontWeight = FontWeight.Bold
      )
      Spacer(modifier = Modifier.height(6.dp))
      Text(
        text = direccion,
        color = Color.White.copy(alpha = 0.9f),
        fontSize = 15.sp
      )
    }
  }
}
