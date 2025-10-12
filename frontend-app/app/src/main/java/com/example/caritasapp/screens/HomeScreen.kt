package com.example.caritasapp.screens

import android.R.attr.onClick
import android.R.attr.text
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Color.Companion.White
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*
import kotlinx.coroutines.launch

data class Sede(
  val name: String,
  val address: String,
  val contact: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavHostController) {
  var selectedSede by rememberSaveable { mutableStateOf<String?>(null) }
  var hasReservation by rememberSaveable { mutableStateOf(false) }

  val sedeSelected = selectedSede != null
  val transportEnabled = hasReservation

  var showSedeSheet by remember { mutableStateOf(false) }

  // Mock sedes list (replace with backend data later)
  val sedes = listOf(
    Sede(
      "Cáritas Monterrey - Centro",
      "Av. Pino Suárez 305, Centro, Monterrey, N.L.",
      "Tel: 81 1234 5678"
    ),
    Sede(
      "Cáritas Monterrey - Norte",
      "Calle Lincoln 1220, Col. Industrial, Monterrey, N.L.",
      "Tel: 81 8765 4321"
    ),
    Sede(
      "Cáritas Monterrey - Sur",
      "Av. Garza Sada 4500, Contry, Monterrey, N.L.",
      "Tel: 81 1357 2468"
    ),
    Sede(
      "Cáritas Monterrey - Guadalupe",
      "Av. Miguel Alemán 2100, Guadalupe, N.L.",
      "Tel: 81 9753 8642"
    )
  )

  val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
  val scope = rememberCoroutineScope()

  if (showSedeSheet) {
    ModalBottomSheet(
      onDismissRequest = { showSedeSheet = false },
      sheetState = sheetState,
      containerColor = White,
      shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
          Text(
            text = "Selecciona tu sede",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = CaritasNavy,
            modifier = Modifier.padding(bottom = 8.dp)
          )
          Divider()

          LazyColumn(
            modifier = Modifier
              .fillMaxWidth()
              .padding(top = 12.dp, bottom = 40.dp)
          ) {
            items(sedes) { sede ->
              Column(
                modifier = Modifier
                  .fillMaxWidth()
                  .clickable {
                    selectedSede = sede.name
                    hasReservation = false
                    scope.launch { sheetState.hide() }.invokeOnCompletion {
                      showSedeSheet = false
                    }
                  }
                  .padding(vertical = 14.dp)
              ) {
                Text(
                  text = sede.name,
                  fontSize = 20.sp,
                  color = CaritasNavy,
                  fontWeight = FontWeight.Bold
                )
                Text(
                  text = sede.address,
                  fontSize = 16.sp,
                  color = CaritasNavy.copy(alpha = 0.7f)
                )
                Text(
                  text = sede.contact,
                  fontSize = 16.sp,
                  color = CaritasNavy.copy(alpha = 0.6f)
                )
              }
              Divider()
            }
          }
        }
      }
    }


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
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .background(CaritasBlueTeal.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
          .clickable { showSedeSheet = true }
          .padding(vertical = 18.dp, horizontal = 16.dp)
      ) {
        Text(
          text = selectedSede ?: "Seleccionar Sede",
          fontSize = 22.sp,
          fontWeight = FontWeight.SemiBold,
          color = CaritasNavy
        )
      }

      Spacer(modifier = Modifier.height(30.dp))

      Text(
        text = "Seleccionar el servicio deseado",
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 25.dp)
      )

      ServiceButton(
        text = "Reservar alojamiento en sede",
        color = CaritasBlueTeal,
        enabled = sedeSelected && !hasReservation,
        onClick = {
          hasReservation = true
          navController.navigate(Screen.Reserve.route)
        }
      )

      ServiceButton(
        text = "Transporte",
        color = CaritasBlueTeal,
        enabled = transportEnabled,
        onClick = { navController.navigate(Screen.Transporte.route) }
      )

      ServiceButton(
        text = "Consultar servicios del sede",
        color = CaritasBlueTeal,
        enabled = sedeSelected,
        onClick = { navController.navigate(Screen.ConsultarServicios.route) }
      )

      ServiceButton(
        text = "Reseña y valoración",
        color = CaritasBlueTeal,
        enabled = sedeSelected,
        onClick = { navController.navigate(Screen.Terms.route) }
      )

      Spacer(modifier = Modifier.height(10.dp))

      Button(
        onClick = { navController.navigate(Screen.Terms.route) },
        enabled = transportEnabled,
        colors = ButtonDefaults.buttonColors(
          containerColor = if (transportEnabled) CaritasNavy else CaritasNavy.copy(alpha = 0.4f)
        ),
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

      Spacer(modifier = Modifier.height(20.dp))
    }
  }
}

@Composable
fun ServiceButton(
  text: String,
  color: androidx.compose.ui.graphics.Color,
  enabled: Boolean,
  onClick: () -> Unit
) {
  Button(
    onClick = onClick,
    enabled = enabled,
    colors = ButtonDefaults.buttonColors(
      containerColor = if (enabled) color else color.copy(alpha = 0.4f)
    ),
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
