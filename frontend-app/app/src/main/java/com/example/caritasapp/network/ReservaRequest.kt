package com.example.caritasapp.network

data class ReservaRequest(
  val telefono: String,
  val nombre: String,
  val correo: String?,
  val idsede: Int?,
  val fechainicio: String,
  val horacheckin: String,
  val hombres: Int,
  val mujeres: Int
)
