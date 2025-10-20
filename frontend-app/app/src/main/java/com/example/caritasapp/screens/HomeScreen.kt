package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import com.example.caritasapp.network.ApiService
import com.example.caritasapp.network.RetrofitClient
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch

data class Sede(
  val id: Int,
  val nombre: String,
  val ubicacion: String,
  val ciudad: String,
  val horainicio: String,
  val horafinal: String,
  val descripcion: String,
  val capacidadtotal: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavHostController, viewModel: CaritasViewModel) {
  val selectedSedeName by viewModel.selectedSedeName
  val hasReservation by viewModel.hasActiveReservation
  val sedeSelected = selectedSedeName != null

  var showSedeSheet by remember { mutableStateOf(false) }
  val snackbarHostState = remember { SnackbarHostState() }
  val scope = rememberCoroutineScope()

  var sedes by remember { mutableStateOf<List<Sede>>(emptyList()) }
  var isLoading by remember { mutableStateOf(true) }
  var errorMessage by remember { mutableStateOf<String?>(null) }

  // ✅ Show snackbar when returning from reservation cancellation
  val resetReservation =
    navController.currentBackStackEntry?.savedStateHandle?.get<Boolean>("reservation_reset")
      ?: false

  LaunchedEffect(resetReservation) {
    if (resetReservation) {
      scope.launch {
        snackbarHostState.showSnackbar("Reserva finalizada. Puedes seleccionar una nueva sede.")
      }
      navController.currentBackStackEntry?.savedStateHandle?.set("reservation_reset", false)
    }
  }

  // ✅ Load sedes from backend
  LaunchedEffect(Unit) {
    scope.launch {
      try {
        val api = RetrofitClient.instance.create(ApiService::class.java)
        val response = api.getSedes()
        if (response.isSuccessful) {
          val data = response.body()
          if (data?.success == true) {
            sedes = data.sedes
          } else {
            errorMessage = "Error: No se pudo obtener las sedes"
          }
        } else {
          errorMessage = "Error ${response.code()}"
        }
      } catch (e: Exception) {
        errorMessage = "Error: ${e.message}"
      } finally {
        isLoading = false
      }
    }
  }

  val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

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

        when {
          isLoading -> {
            Box(
              modifier = Modifier.fillMaxWidth(),
              contentAlignment = Alignment.Center
            ) {
              CircularProgressIndicator(color = CaritasNavy)
            }
          }

          errorMessage != null -> {
            Text(
              text = errorMessage ?: "Error desconocido",
              color = Color.Red,
              modifier = Modifier.padding(16.dp)
            )
          }

          else -> {
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
                      viewModel.selectedSedeName.value = sede.nombre
                      viewModel.selectedSedeId.value = sede.id
                      viewModel.hasActiveReservation.value = false
                      scope.launch { sheetState.hide() }
                        .invokeOnCompletion { showSedeSheet = false }
                    }
                    .padding(vertical = 14.dp)
                ) {
                  Text(
                    text = sede.nombre,
                    fontSize = 20.sp,
                    color = CaritasNavy,
                    fontWeight = FontWeight.Bold
                  )
                  Text(
                    text = sede.ubicacion,
                    fontSize = 16.sp,
                    color = CaritasNavy.copy(alpha = 0.7f)
                  )
                  Text(
                    text = sede.ciudad,
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
    }
  }

  // ✅ Scaffold allows snackbar to show
  Scaffold(
    snackbarHost = { SnackbarHost(snackbarHostState) },
    containerColor = White
  ) { padding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .padding(horizontal = 20.dp, vertical = 36.dp)
        .padding(padding),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      // 🟩 Sede selector box
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .background(CaritasBlueTeal.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
          .clickable(enabled = !hasReservation) { showSedeSheet = true }
          .padding(vertical = 18.dp, horizontal = 16.dp)
      ) {
        Text(
          text = selectedSedeName ?: "Seleccionar Sede",
          fontSize = 22.sp,
          fontWeight = FontWeight.SemiBold,
          color = if (hasReservation) CaritasNavy.copy(alpha = 0.5f) else CaritasNavy
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

      // 🟩 Reservar alojamiento
      ServiceButton(
        text = "Reservar alojamiento en sede",
        color = CaritasBlueTeal,
        enabled = sedeSelected && !hasReservation,
        onClick = {
          viewModel.hasActiveReservation.value = true
          navController.navigate(Screen.Reserve.route)
        }
      )

      // 🟩 Transporte
      ServiceButton(
        text = "Transporte",
        color = CaritasBlueTeal,
        enabled = hasReservation,
        onClick = { navController.navigate(Screen.Transporte.route) }
      )

      // 🟩 Consultar servicios
      ServiceButton(
        text = "Consultar servicios del sede",
        color = CaritasBlueTeal,
        enabled = sedeSelected,
        onClick = { navController.navigate(Screen.ConsultarServicios.route) }
      )

      // 🟩 Reseña y valoración
      ServiceButton(
        text = "Reseña y valoración",
        color = CaritasBlueTeal,
        enabled = sedeSelected,
        onClick = { navController.navigate(Screen.Terms.route) }
      )

      Spacer(modifier = Modifier.height(10.dp))

      // 🟩 Consultar reservas
      Button(
        onClick = { navController.navigate(Screen.ConsultarReservas.route) },
        enabled = hasReservation,
        colors = ButtonDefaults.buttonColors(
          containerColor = if (hasReservation) CaritasNavy else CaritasNavy.copy(alpha = 0.4f)
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
  color: Color,
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
