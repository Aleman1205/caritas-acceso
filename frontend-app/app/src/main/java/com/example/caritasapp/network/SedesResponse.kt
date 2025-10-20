package com.example.caritasapp.network

import com.example.caritasapp.screens.Sede

data class SedesResponse(
  val success: Boolean,
  val sedes: List<Sede>
)
