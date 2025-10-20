package com.example.caritasapp.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReserveScreen(navController: NavHostController, viewModel: CaritasViewModel) {

  val selectedDate by viewModel.selectedDate
  val selectedHour by viewModel.selectedHour
  val selectedMinute by viewModel.selectedMinute
  val amPm by viewModel.amPm
  val sedeName by viewModel.selectedSedeName

  val openDatePicker = remember { mutableStateOf(false) }
  val showError = remember { mutableStateOf(false) }

  if (openDatePicker.value) {
    val datePickerState = rememberDatePickerState()
    DatePickerDialog(
      onDismissRequest = { openDatePicker.value = false },
      confirmButton = {
        TextButton(
          onClick = {
            datePickerState.selectedDateMillis?.let {
              val formatter = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
              viewModel.selectedDate.value = formatter.format(Date(it)) // ✅ save directly
            }
            openDatePicker.value = false
          }
        ) { Text("Aceptar", color = CaritasBlueTeal) }
      },
      dismissButton = {
        TextButton(onClick = { openDatePicker.value = false }) {
          Text("Cancelar", color = CaritasBlueTeal)
        }
      }
    ) {
      DatePicker(state = datePickerState, showModeToggle = false)
    }
  }

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
        text = "Reservación",
        fontSize = 26.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 28.dp)
      )

      Text(
        text = sedeName ?: "Sin sede seleccionada",
        fontSize = 18.sp,
        color = CaritasNavy.copy(alpha = 0.7f),
        modifier = Modifier.padding(bottom = 16.dp)
      )

      Box(
        modifier = Modifier
          .fillMaxWidth()
          .background(CaritasBlueTeal, RoundedCornerShape(24.dp))
          .padding(vertical = 40.dp),
        contentAlignment = Alignment.Center
      ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Text(
            text = if (selectedDate.isEmpty()) "Seleccionar fecha"
            else "Fecha seleccionada: $selectedDate",
            color = Color.White,
            fontSize = 20.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(bottom = 12.dp)
          )
          Button(
            onClick = { openDatePicker.value = true },
            colors = ButtonDefaults.buttonColors(containerColor = CaritasNavy),
            shape = RoundedCornerShape(16.dp)
          ) {
            Text("Elegir fecha", color = Color.White)
          }
        }
      }

      Spacer(modifier = Modifier.height(40.dp))

      Text(
        text = "Horario",
        fontSize = 22.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        modifier = Modifier.padding(bottom = 16.dp)
      )

      // ✅ Directly update ViewModel values on change
      TimeSelector(
        selectedHour = selectedHour,
        selectedMinute = selectedMinute,
        amPm = amPm,
        onHourChange = { viewModel.selectedHour.value = it },
        onMinuteChange = { viewModel.selectedMinute.value = it },
        onPeriodChange = { viewModel.amPm.value = it }
      )

      Spacer(modifier = Modifier.height(48.dp))

      if (showError.value) {
        Text(
          text = "Selecciona una fecha antes de continuar",
          color = Color.Red,
          textAlign = TextAlign.Center,
          modifier = Modifier.padding(bottom = 12.dp)
        )
      }

      Button(
        onClick = {
          if (viewModel.selectedDate.value.isEmpty()) {
            showError.value = true
          } else {
            showError.value = false
            navController.navigate(Screen.ReservationForm.route)
          }
        },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier
          .fillMaxWidth()
          .height(70.dp)
      ) {
        Text(
          text = "Confirmar reserva",
          fontSize = 20.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
      }
    }
  }
}


@Composable
fun TimeSelector(
  selectedHour: String,
  selectedMinute: String,
  amPm: String,
  onHourChange: (String) -> Unit,
  onMinuteChange: (String) -> Unit,
  onPeriodChange: (String) -> Unit
) {
  val hours = (1..12).map { it.toString() }
  val minutes = listOf("00", "15", "30", "45")
  val periods = listOf("AM", "PM")

  Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceEvenly,
    verticalAlignment = Alignment.CenterVertically
  ) {
    DropdownBox(label = "Hora", options = hours, selected = selectedHour, onSelect = onHourChange)
    DropdownBox(label = "Minuto", options = minutes, selected = selectedMinute, onSelect = onMinuteChange)
    DropdownBox(label = "Periodo", options = periods, selected = amPm, onSelect = onPeriodChange)
  }
}

@Composable
fun DropdownBox(label: String, options: List<String>, selected: String, onSelect: (String) -> Unit) {
  var expanded by remember { mutableStateOf(false) }

  Column(horizontalAlignment = Alignment.CenterHorizontally) {
    Text(
      text = label,
      color = CaritasNavy,
      fontSize = 18.sp,
      fontWeight = FontWeight.SemiBold
    )
    Spacer(modifier = Modifier.height(10.dp))
    Box {
      Box(
        modifier = Modifier
          .size(width = 100.dp, height = 70.dp)
          .background(CaritasLight, RoundedCornerShape(16.dp))
          .clickable { expanded = true },
        contentAlignment = Alignment.Center
      ) {
        Text(
          text = selected,
          color = CaritasNavy,
          fontSize = 22.sp,
          fontWeight = FontWeight.Bold
        )
      }

      DropdownMenu(
        expanded = expanded,
        onDismissRequest = { expanded = false },
        modifier = Modifier.background(Color.White)
      ) {
        options.forEach { option ->
          DropdownMenuItem(
            text = { Text(option, fontSize = 20.sp, fontWeight = FontWeight.Medium) },
            onClick = {
              onSelect(option)
              expanded = false
            }
          )
        }
      }
    }
  }
}
