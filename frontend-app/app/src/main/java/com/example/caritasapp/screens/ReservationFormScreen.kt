package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.network.ApiService
import com.example.caritasapp.network.ReservaRequest
import com.example.caritasapp.network.RetrofitClient
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReservationFormScreen(navController: NavHostController) {
  val fecha = navController.currentBackStackEntry?.arguments?.getString("fecha") ?: ""
  val hora = navController.currentBackStackEntry?.arguments?.getString("hora") ?: "8"
  val minuto = navController.currentBackStackEntry?.arguments?.getString("minuto") ?: "00"
  val periodo = navController.currentBackStackEntry?.arguments?.getString("periodo") ?: "AM"

  val viewModel: CaritasViewModel = viewModel()

  var nombre by viewModel.nombre
  var telefono by viewModel.telefono
  var correo by viewModel.correo
  var menCount by viewModel.hombres
  var womenCount by viewModel.mujeres
  var idsede by viewModel.selectedSedeId

  var isLoading by remember { mutableStateOf(false) }
  var errorMessage by remember { mutableStateOf<String?>(null) }

  val scope = rememberCoroutineScope()
  var lada by remember { mutableStateOf("+52") }
  var selectedFlag by remember { mutableStateOf("🇲🇽") }
  var showLadaMenu by remember { mutableStateOf(false) }

  val isFormValid = nombre.isNotBlank() && telefono.isNotBlank()
  var nombreError by remember { mutableStateOf(false) }
  var telefonoError by remember { mutableStateOf(false) }

  val ladaList = listOf(
    Triple("🇲🇽", "+52", "México"),
    Triple("🇨🇴", "+57", "Colombia"),
    Triple("🇻🇪", "+58", "Venezuela"),
    Triple("🇵🇪", "+51", "Perú"),
    Triple("🇦🇷", "+54", "Argentina"),
    Triple("🇨🇱", "+56", "Chile"),
    Triple("🇧🇷", "+55", "Brasil"),
    Triple("🇺🇸", "+1", "EE.UU.")
  )

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
      if (nombreError) {
        Text(
          text = "El nombre es obligatorio",
          color = Color.Red,
          fontSize = 14.sp,
          modifier = Modifier
            .align(Alignment.Start)
            .padding(start = 8.dp)
        )
      }

      Box(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp)
      ) {
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.fillMaxWidth()
        ) {
          Box(
            modifier = Modifier
              .width(110.dp)
              .height(50.dp)
              .border(
                1.dp,
                CaritasBlueTeal.copy(alpha = 0.5f),
                RoundedCornerShape(16.dp)
              )
              .background(Color.White, RoundedCornerShape(16.dp))
              .clickable { showLadaMenu = true }
              .padding(horizontal = 16.dp),
            contentAlignment = Alignment.Center
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.Center
            ) {
              Text(
                text = selectedFlag,
                fontSize = 20.sp,
                modifier = Modifier.padding(end = 6.dp)
              )
              Text(
                text = lada,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = CaritasNavy
              )
            }
          }
          Spacer(modifier = Modifier.width(10.dp))

          OutlinedTextField(
            value = telefono,
            onValueChange = {
              telefono = it
              telefonoError = it.isBlank()
            },
            label = { Text("Teléfono") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
            isError = telefonoError,
            modifier = Modifier
              .weight(1f)
              .height(56.dp),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              focusedBorderColor = CaritasBlueTeal,
              unfocusedBorderColor = CaritasBlueTeal.copy(alpha = 0.5f),
              cursorColor = CaritasBlueTeal,
              errorBorderColor = Color.Red
            )
          )
        }

        DropdownMenu(
          expanded = showLadaMenu,
          onDismissRequest = { showLadaMenu = false },
          modifier = Modifier
            .background(Color.White)
            .width(220.dp)
        ) {
          ladaList.forEach { (flag, code, country) ->
            DropdownMenuItem(
              text = {
                Row(
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Text(flag, fontSize = 20.sp, modifier = Modifier.padding(end = 10.dp))
                  Column {
                    Text(
                      text = "$code $country",
                      fontSize = 15.sp,
                      color = CaritasNavy
                    )
                  }
                }
              },
              onClick = {
                selectedFlag = flag
                lada = code
                showLadaMenu = false
              }
            )
          }
        }
      }
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

      Spacer(modifier = Modifier.height(28.dp))

      Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
      ) {
        Text(
          text = "Número de personas",
          fontSize = 18.sp,
          fontWeight = FontWeight.SemiBold,
          color = CaritasNavy,
          modifier = Modifier.padding(bottom = 12.dp)
        )

        CounterRow(
          label = "Hombres",
          count = menCount,
          onIncrement = { menCount++ },
          onDecrement = { if (menCount > 0) menCount-- }
        )

        Spacer(modifier = Modifier.height(12.dp))

        CounterRow(
          label = "Mujeres",
          count = womenCount,
          onIncrement = { womenCount++ },
          onDecrement = { if (womenCount > 0) womenCount-- }
        )
      }

      Button(
        onClick = {
          if (nombre.isBlank() || telefono.isBlank()) return@Button
          isLoading = true
          errorMessage = null

          val api = RetrofitClient.instance.create(ApiService::class.java)
          val request = ReservaRequest(
            telefono = telefono,
            nombre = nombre,
            correo = if (correo.isBlank()) null else correo,
            idsede = idsede,
            fechainicio = fecha,
            horacheckin = "$hora:$minuto $periodo",
            hombres = menCount,
            mujeres = womenCount
          )

          scope.launch {
            try {
              val response = api.crearReserva(request)
              if (response.isSuccessful && response.body()?.success == true) {
                val clave = response.body()?.clave ?: ""
                navController.navigate(Screen.ReservationQR.route + "?clave=$clave")
              } else {
                errorMessage = "Error ${response.code()}"
              }
            } catch (e: Exception) {
              errorMessage = "Error: ${e.message}"
            } finally {
              isLoading = false
            }
          }
        },
        enabled = !isLoading && nombre.isNotBlank() && telefono.isNotBlank(),
        colors = ButtonDefaults.buttonColors(
          containerColor = if (nombre.isNotBlank() && telefono.isNotBlank())
            CaritasBlueTeal else CaritasBlueTeal.copy(alpha = 0.4f)
        ),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
          .fillMaxWidth()
          .height(70.dp)
      ) {
        if (isLoading) {
          CircularProgressIndicator(color = Color.White, modifier = Modifier.size(28.dp))
        } else {
          Text("Continuar", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
      }

      errorMessage?.let {
        Text(
          text = it,
          color = Color.Red,
          fontSize = 14.sp,
          modifier = Modifier.padding(top = 8.dp)
        )
      }
    }
  }
}

@Composable
fun CounterRow(
  label: String,
  count: Int,
  onIncrement: () -> Unit,
  onDecrement: () -> Unit
) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.SpaceBetween
  ) {
    Text(
      text = label,
      fontSize = 16.sp,
      fontWeight = FontWeight.Medium,
      color = CaritasNavy
    )
    Row(
      verticalAlignment = Alignment.CenterVertically
    ) {
      IconButton(onClick = onDecrement) {
        Icon(
          imageVector = Icons.Filled.Remove,
          contentDescription = "Disminuir",
          tint = CaritasNavy
        )
      }
      Text(
        text = count.toString(),
        fontSize = 16.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.width(24.dp),
      )
      IconButton(onClick = onIncrement) {
        Icon(
          imageVector = Icons.Filled.Add,
          contentDescription = "Aumentar",
          tint = CaritasNavy
        )
      }
    }
  }
}
