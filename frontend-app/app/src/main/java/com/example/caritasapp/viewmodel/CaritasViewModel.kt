package com.example.caritasapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.compose.runtime.mutableStateOf

class CaritasViewModel : ViewModel() {
  var selectedSedeId = mutableStateOf<Int?>(null)
  var selectedSedeName = mutableStateOf<String?>(null)

  var selectedDate = mutableStateOf("")
  var selectedHour = mutableStateOf("8")
  var selectedMinute = mutableStateOf("00")
  var amPm = mutableStateOf("AM")

  var nombre = mutableStateOf("")
  var telefono = mutableStateOf("")
  var correo = mutableStateOf("")
  var hombres = mutableStateOf(0)
  var mujeres = mutableStateOf(0)

  var clave = mutableStateOf("")
}
