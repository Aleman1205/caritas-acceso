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
import androidx.compose.runtime.LaunchedEffect
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
import androidx.compose.ui.layout.ModifierInfo
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.network.ApiService
import com.example.caritasapp.network.RetrofitClient
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch
import java.lang.Exception

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
fun HomeScreen(navController: NavHostController) {
  var selectedSede by rememberSaveable { mutableStateOf<String?>(null) }
  var selectedSedeId by remember { mutableStateOf<Int?>(null) }
  var hasReservation by rememberSaveable { mutableStateOf(false) }

  val sedeSelected = selectedSede != null
  val transportEnabled = hasReservation
  val viewModel: CaritasViewModel = viewModel()
  var showSedeSheet by remember { mutableStateOf(false) }

  val scope = rememberCoroutineScope()
  var sedes by remember { mutableStateOf<List<Sede>>(emptyList()) }
  var isLoading by remember { mutableStateOf(true) }
  var errorMessage by remember { mutableStateOf<String?>(null) }

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
              Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
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
                        hasReservation = false
                        scope.launch { sheetState.hide() }.invokeOnCompletion {
                          showSedeSheet = false
                        }
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
