package com.example.caritasapp.network

data class ServicioItem(
  val idservicio: Int,
  val nombreservicio: String,
  val descripcion: String?,
  val capacidad: Int?,
  val precio: Double?,
  val horainicio: String?,
  val horafinal: String?,
  val estatus: Boolean
)

data class ServiciosResponse(
  val success: Boolean,
  val servicios: List<ServicioItem>
)
