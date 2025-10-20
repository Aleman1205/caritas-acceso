package com.example.caritasapp.network

import com.google.gson.annotations.SerializedName

data class ReservaResponse(
  val success: Boolean,
  val clave: String?,
  @SerializedName(value = "transaccionid", alternate = ["transactionId"])
  val transactionid: String?,
  val message: String
)
