package com.example.caritasapp.network

data class RatingRequest(
  val int_estrellas: Int,
  val comentarios: String?,
  val id_sede: Int
)
