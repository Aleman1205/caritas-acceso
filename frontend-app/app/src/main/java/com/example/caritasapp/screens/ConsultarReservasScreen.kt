package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch
import android.graphics.Bitmap
import androidx.compose.foundation.Image
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter

data class ReservaDetalle(
  val clave: String,
  val sede: String,
  val fecha: String,
  val hora: String,
  val hombres: Int,
  val mujeres: Int
)

// ✅ QR Generator
fun generateQrCode(content: String): Bitmap? {
  return try {
    val writer = QRCodeWriter()
    val bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, 512, 512)
    val width = bitMatrix.width
    val height = bitMatrix.height
    val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
    for (x in 0 until width) {
      for (y in 0 until height) {
        bmp.setPixel(x, y, if (bitMatrix[x, y]) android.graphics.Color.BLACK else android.graphics.Color.WHITE)
      }
    }
    bmp
  } catch (e: Exception) {
    null
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConsultarReservasScreen(navController: NavHostController, viewModel: CaritasViewModel) {
  val scope = rememberCoroutineScope()
  val snackbarHostState = remember { SnackbarHostState() }

  var reserva by remember { mutableStateOf<ReservaDetalle?>(null) }
  var isLoading by remember { mutableStateOf(true) }
  var errorMessage by remember { mutableStateOf<String?>(null) }

  val hasActiveReservation = viewModel.hasActiveReservation.value

  LaunchedEffect(Unit) {
    scope.launch {
      try {
        if (hasActiveReservation) {
          reserva = ReservaDetalle(
            clave = viewModel.reservationClave.value,
            sede = viewModel.selectedSedeName.value ?: "Sede desconocida",
            fecha = viewModel.selectedDate.value,
            hora = "${viewModel.selectedHour.value}:${viewModel.selectedMinute.value} ${viewModel.amPm.value}",
            hombres = viewModel.hombres.value,
            mujeres = viewModel.mujeres.value
          )
        } else {
          errorMessage = "No tienes reservas activas."
        }
      } catch (e: Exception) {
        errorMessage = "Error: ${e.message}"
      } finally {
        isLoading = false
      }
    }
  }

  Scaffold(
    snackbarHost = { SnackbarHost(snackbarHostState) }
  ) { padding ->
    Surface(
      modifier = Modifier
        .fillMaxSize()
        .padding(padding),
      color = Color.White
    ) {
      when {
        isLoading -> {
          Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = CaritasBlueTeal)
          }
        }

        errorMessage != null -> {
          Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
          ) {
            Text(
              text = errorMessage ?: "Error desconocido",
              color = Color.Red,
              fontSize = 16.sp,
              textAlign = TextAlign.Center
            )
          }
        }

        else -> {
          Column(
            modifier = Modifier
              .fillMaxSize()
              .padding(horizontal = 24.dp, vertical = 36.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text(
              text = "Detalles de tu Reserva",
              fontSize = 26.sp,
              fontWeight = FontWeight.Bold,
              color = CaritasNavy,
              modifier = Modifier.padding(bottom = 28.dp)
            )

            reserva?.let {
              // 🟩 Show QR Code above the card
              val qrBitmap = remember { generateQrCode(it.clave) }
              qrBitmap?.let { bmp ->
                Image(
                  bitmap = bmp.asImageBitmap(),
                  contentDescription = "QR Code",
                  modifier = Modifier
                    .size(180.dp)
                    .padding(bottom = 16.dp)
                )
              }

              ReservaCard(it)
            }

            Spacer(modifier = Modifier.height(36.dp))

            Button(
              onClick = {
                scope.launch {
                  viewModel.hasActiveReservation.value = false
                  viewModel.selectedSedeName.value = null
                  viewModel.selectedSedeId.value = null
                  viewModel.reservationClave.value = ""

                  snackbarHostState.showSnackbar("Reserva finalizada correctamente ✅")

                  kotlinx.coroutines.delay(1200)
                  navController.navigate(Screen.Home.route) {
                    popUpTo(Screen.Home.route) { inclusive = true }
                  }
                }
              },
              colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
              shape = RoundedCornerShape(24.dp),
              modifier = Modifier
                .fillMaxWidth()
                .height(70.dp)
            ) {
              Text(
                text = "Finalizar Reserva",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
              )
            }
          }
        }
      }
    }
  }
}

@Composable
fun ReservaCard(reserva: ReservaDetalle) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .padding(horizontal = 8.dp, vertical = 16.dp),
    colors = CardDefaults.cardColors(containerColor = CaritasBlueTeal.copy(alpha = 0.1f)),
    shape = RoundedCornerShape(20.dp)
  ) {
    Column(
      modifier = Modifier.padding(20.dp),
      horizontalAlignment = Alignment.Start
    ) {
      Text(
        text = "Clave de Reserva:",
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        fontSize = 18.sp
      )
      Text(
        text = reserva.clave,
        fontSize = 16.sp,
        color = CaritasNavy.copy(alpha = 0.9f),
        modifier = Modifier.padding(bottom = 12.dp)
      )

      Text("Sede: ${reserva.sede}", color = CaritasNavy, fontSize = 16.sp)
      Text("Fecha: ${reserva.fecha}", color = CaritasNavy, fontSize = 16.sp)
      Text("Hora: ${reserva.hora}", color = CaritasNavy, fontSize = 16.sp)
      Text("Hombres: ${reserva.hombres}", color = CaritasNavy, fontSize = 16.sp)
      Text("Mujeres: ${reserva.mujeres}", color = CaritasNavy, fontSize = 16.sp)
    }
  }
}
