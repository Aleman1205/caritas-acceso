package com.example.caritasapp.network

data class ServicioSimple(
  val id: Int,
  val nombre: String,
  val descripcion: String?
)

data class SedeInfoItem(
  val id: Int,
  val nombre: String,
  val ubicacion: String?,
  val ciudad: String?,
  val horainicio: String?,
  val horafinal: String?,
  val descripcion: String?,
  val servicios: List<ServicioSimple>
)

data class SedesInfoResponse(
  val success: Boolean,
  val message: String?,
  val data: List<SedeInfoItem>
)
