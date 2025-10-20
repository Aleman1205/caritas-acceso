package com.example.caritasapp.screens

import android.graphics.Bitmap
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import androidx.core.graphics.createBitmap
import androidx.core.graphics.set

@Composable
fun ReservationQRScreen(navController: NavHostController, viewModel: CaritasViewModel) {
  val clave by viewModel.reservationClave

  val qrBitmap = remember(clave) { generateQRCode(clave) }

  Scaffold(
    containerColor = Color.White
  ) { padding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(padding)
        .padding(horizontal = 24.dp, vertical = 36.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center
    ) {
      Text(
        text = "¡Reserva completada con éxito!\nMuestra este código en tu sede.",
        textAlign = TextAlign.Center,
        fontSize = 20.sp,
        fontWeight = FontWeight.SemiBold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 24.dp)
      )

      qrBitmap?.let {
        Image(
          bitmap = it.asImageBitmap(),
          contentDescription = "QR Code",
          modifier = Modifier
            .size(240.dp)
            .background(CaritasLight)
            .padding(4.dp)
        )
      }

      Spacer(modifier = Modifier.height(24.dp))

      Text(
        text = "Clave: $clave",
        fontSize = 18.sp,
        color = CaritasNavy,
        fontWeight = FontWeight.Medium,
        modifier = Modifier.padding(bottom = 36.dp)
      )

      Button(
        onClick = {
          viewModel.hasActiveReservation.value = true
          navController.navigate(Screen.Home.route)
                  },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
          .fillMaxWidth()
          .height(70.dp)
      ) {
        Text("Terminar Registro", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = CaritasLight)
      }
    }
  }
}


fun generateQRCode(text: String): Bitmap? = try {
  val writer = QRCodeWriter()
  val bitMatrix = writer.encode(text, BarcodeFormat.QR_CODE, 512, 512)
  val width = bitMatrix.width
  val height = bitMatrix.height
  val bmp = createBitmap(width, height, Bitmap.Config.RGB_565)
  for (x in 0 until width) {
    for (y in 0 until height) {
      bmp[x, y] =
        if (bitMatrix[x, y]) android.graphics.Color.BLACK else android.graphics.Color.WHITE
    }
  }
  bmp
} catch (_: Exception) {
  null
}
