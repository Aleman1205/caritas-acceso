package com.example.caritasapp.network

data class ReservaRequest(
  val nombre: String,
  val telefono: String,
  val email: String?,
  val hombres: Int,
  val mujeres: Int,
  val fechainicio: String,
  val horacheckin: String,
  val idsede: Int
)
