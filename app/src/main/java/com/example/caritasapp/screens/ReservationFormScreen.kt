package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReservationFormScreen(navController: NavHostController) {
  var nombre by remember { mutableStateOf("") }
  var telefono by remember { mutableStateOf("") }
  var correo by remember { mutableStateOf("") }

  var nombreError by remember { mutableStateOf(false) }
  var telefonoError by remember { mutableStateOf(false) }

  val isFormValid = nombre.isNotBlank() && telefono.isNotBlank()

  Surface(
    modifier = Modifier.fillMaxSize(),
    color = Color.White
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(horizontal = 24.dp, vertical = 36.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      Text(
        text = "Datos de tu Reserva",
        fontSize = 26.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 40.dp)
      )

      OutlinedTextField(
        value = nombre,
        onValueChange = {
          nombre = it
          nombreError = it.isBlank()
                        },
        label = { Text("Nombre completo") },
        singleLine = true,
        isError = nombreError,
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
          focusedBorderColor = CaritasBlueTeal,
          unfocusedBorderColor = CaritasBlueTeal.copy(alpha = 0.5f),
          cursorColor = CaritasBlueTeal,
          errorBorderColor = Color.Red
        )
      )
      if(nombreError) {
        Text(
          text = "El nombre es obligatorio",
          color = Color.Red,
          fontSize = 14.sp,
          modifier = Modifier
            .align(Alignment.Start)
            .padding(start = 8.dp)
        )
      }

      OutlinedTextField(
        value = telefono,
        onValueChange = { telefono = it
                        telefonoError = it.isBlank()
                        },
        label = { Text("Telefono") },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
        isError = telefonoError,
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
          focusedBorderColor = CaritasBlueTeal,
          unfocusedBorderColor = CaritasBlueTeal.copy(alpha = 0.5f),
          cursorColor = CaritasBlueTeal,
          errorBorderColor = Color.Red
        )
      )
      if (telefonoError) {
        Text(
          text = "El teléfono es obligatorio",
          color = Color.Red,
          fontSize = 14.sp,
          modifier = Modifier
            .align(Alignment.Start)
            .padding(start = 8.dp)
        )
      }

      OutlinedTextField(
        value = correo,
        onValueChange = { correo = it },
        label = { Text("Correo (opcional)") },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
          focusedBorderColor = CaritasBlueTeal,
          unfocusedBorderColor = CaritasBlueTeal.copy(alpha = 0.5f),
          cursorColor = CaritasBlueTeal
        )
      )

      Spacer(modifier = Modifier.height(40.dp))

      Button(
        onClick = {
          nombreError = nombre.isBlank()
          telefonoError = telefono.isBlank()

          if (isFormValid) {
            navController.navigate(Screen.ReservationQR.route) {
              popUpTo(Screen.Home.route) { inclusive = true }
            }
           }
        },
        enabled = isFormValid,
        colors = ButtonDefaults.buttonColors(
          containerColor = if (isFormValid) CaritasBlueTeal else CaritasBlueTeal.copy(alpha = 0.4f)
        ),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
          .fillMaxWidth()
          .height(70.dp)
      ) {
        Text(
          text = "Continuar",
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
      }
    }
  }
}
