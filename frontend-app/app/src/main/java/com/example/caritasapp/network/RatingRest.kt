package com.example.caritasapp.network

import retrofit2.http.GET
import retrofit2.http.Path

data class RatingPromedioResponse(
  val success: Boolean,
  val message: String,
  val data: RatingData?
)

data class RatingData(
  val id_sede: Int,
  val sede: String,
  val promedio: Double,
  val total_reviews: Int
)
