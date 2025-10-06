package com.example.caritasapp.screens

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
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*

@Composable
fun HomeScreen(navController: NavHostController) {
  Surface(
    modifier = Modifier.fillMaxSize(),
    color = White
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .padding(horizontal = 20.dp, vertical = 36.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      // 🔹 Title
      Text(
        text = "Seleccionar el servicio deseado",
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 40.dp)
      )

      // 🔹 Buttons
      ServiceButton(
        text = "Reservar alojamiento en albergue",
        color = CaritasBlueTeal,
        onClick = { navController.navigate(Screen.Terms.route) }
      )
      ServiceButton(
        text = "Consultar servicios por albergue",
        color = CaritasBlueTeal,
        onClick = { navController.navigate(Screen.Terms.route) }
      )
      ServiceButton(
        text = "Transporte",
        color = CaritasBlueTeal,
        onClick = { navController.navigate(Screen.Terms.route) }
      )
      ServiceButton(
        text = "Reseña y valoración",
        color = CaritasBlueTeal,
        onClick = { navController.navigate(Screen.Terms.route) }
      )

      Spacer(modifier = Modifier.height(36.dp))

      // 🔹 Bottom button
      Button(
        onClick = { navController.navigate(Screen.Terms.route) },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasNavy),
        shape = RoundedCornerShape(40.dp),
        modifier = Modifier
          .fillMaxWidth()
          .height(100.dp)
      ) {
        Text(
          text = "Consultar mis reservas",
          fontSize = 22.sp,
          textAlign = TextAlign.Center,
          fontWeight = FontWeight.Bold
        )
      }

      Spacer(modifier = Modifier.height(40.dp))
    }
  }
}

@Composable
fun ServiceButton(
  text: String,
  color: androidx.compose.ui.graphics.Color,
  onClick: () -> Unit
) {
  Button(
    onClick = onClick,
    colors = ButtonDefaults.buttonColors(containerColor = color),
    shape = RoundedCornerShape(40.dp),
    modifier = Modifier
      .fillMaxWidth()
      .height(150.dp)
      .padding(vertical = 10.dp)
  ) {
    Text(
      text = text,
      fontSize = 24.sp,
      fontWeight = FontWeight.Bold,
      textAlign = TextAlign.Center,
      lineHeight = 30.sp
    )
  }
}
