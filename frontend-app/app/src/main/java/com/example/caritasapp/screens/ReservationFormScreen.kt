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
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.network.ApiService
import com.example.caritasapp.network.ReservaRequest
import com.example.caritasapp.network.RetrofitClient
import com.example.caritasapp.ui.components.CaritasScaffold
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

fun convertTo24HourFormat(hour: String, minute: String, period: String): String {
  var h = hour.toIntOrNull() ?: 0
  val m = minute.toIntOrNull() ?: 0
  if (period == "PM" && h < 12) h += 12
  if (period == "AM" && h == 12) h = 0
  return String.format("%02d:%02d:00", h, m)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReservationFormScreen(navController: NavHostController, viewModel: CaritasViewModel) {
  val fecha = viewModel.selectedDate.value
  val hora = viewModel.selectedHour.value
  val minuto = viewModel.selectedMinute.value
  val periodo = viewModel.amPm.value

  var nombre by viewModel.nombre
  var telefono by viewModel.telefono
  var correo by viewModel.correo
  var menCount by viewModel.hombres
  var womenCount by viewModel.mujeres
  var idsede by viewModel.selectedSedeId

  var isLoading by remember { mutableStateOf(false) }
  var errorMessage by remember { mutableStateOf<String?>(null) }

  val scope = rememberCoroutineScope()
  val snackbarHostState = remember { SnackbarHostState() }

  var lada by remember { mutableStateOf("+52") }
  var selectedFlag by remember { mutableStateOf("🇲🇽") }
  var showLadaMenu by remember { mutableStateOf(false) }

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

  CaritasScaffold(navController) { padding ->
    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { innerPadding ->
      Surface(
        modifier = Modifier
          .fillMaxSize()
          .padding(padding)
          .padding(innerPadding),
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
                    Row(verticalAlignment = Alignment.CenterVertically) {
                      Text(flag, fontSize = 20.sp, modifier = Modifier.padding(end = 10.dp))
                      Text("$code $country", fontSize = 15.sp, color = CaritasNavy)
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

          Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
              text = "Número de personas",
              fontSize = 18.sp,
              fontWeight = FontWeight.SemiBold,
              color = CaritasNavy,
              modifier = Modifier.padding(bottom = 12.dp)
            )
            CounterRow("Hombres", menCount, { menCount++ }, { if (menCount > 0) menCount-- })
            Spacer(modifier = Modifier.height(12.dp))
            CounterRow("Mujeres", womenCount, { womenCount++ }, { if (womenCount > 0) womenCount-- })
          }

          Spacer(modifier = Modifier.height(24.dp))

          Button(
            onClick = {
              if (idsede == null) {
                scope.launch {
                  snackbarHostState.showSnackbar("Selecciona una sede antes de continuar.")
                }
                return@Button
              }

              if (nombre.isBlank() || telefono.isBlank()) {
                scope.launch {
                  snackbarHostState.showSnackbar("Completa los campos obligatorios.")
                }
                return@Button
              }

              isLoading = true
              errorMessage = null

              val api = RetrofitClient.instance.create(ApiService::class.java)
              val request = ReservaRequest(
                nombre = nombre,
                telefono = telefono,
                email = if (correo.isBlank()) null else correo,
                hombres = menCount,
                mujeres = womenCount,
                fechainicio = fecha,
                horacheckin = convertTo24HourFormat(hora, minuto, periodo),
                idsede = idsede ?: 0
              )

              scope.launch {
                try {
                  val response = api.crearReserva(request)
                  if (response.isSuccessful && response.body()?.success == true) {
                    val clave = response.body()?.clave ?: ""
                    viewModel.reservationClave.value = clave
                    viewModel.hasActiveReservation.value = true
                    navController.navigate(Screen.ReservationQR.route)
                  } else {
                    errorMessage = response.body()?.message ?: "Error ${response.code()}"
                  }
                } catch (e: Exception) {
                  errorMessage = "Error: ${e.message}"
                } finally {
                  isLoading = false
                }
              }
            },
            enabled = !isLoading,
            colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
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
  }
}

@Composable
fun CounterRow(label: String, count: Int, onIncrement: () -> Unit, onDecrement: () -> Unit) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 16.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.SpaceBetween
  ) {
    Text(label, fontSize = 16.sp, fontWeight = FontWeight.Medium, color = CaritasNavy)
    Row(verticalAlignment = Alignment.CenterVertically) {
      IconButton(onClick = onDecrement) {
        Icon(Icons.Filled.Remove, contentDescription = "Disminuir", tint = CaritasNavy)
      }
      Text(
        text = count.toString(),
        fontSize = 16.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.width(24.dp)
      )
      IconButton(onClick = onIncrement) {
        Icon(Icons.Filled.Add, contentDescription = "Aumentar", tint = CaritasNavy)
      }
    }
  }
}
