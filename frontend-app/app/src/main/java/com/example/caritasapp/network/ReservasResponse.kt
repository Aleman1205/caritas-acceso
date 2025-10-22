package com.example.caritasapp.navigation

data class ReservasResponse(
  val success: Boolean,
  val reservas: List<ReservasResponse>?
)
