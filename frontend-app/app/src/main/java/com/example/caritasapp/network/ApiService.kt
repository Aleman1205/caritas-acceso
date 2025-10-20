package com.example.caritasapp.network

import retrofit2.Response
import retrofit2.http.*

interface ApiService {
  @GET("movil/sedes")
  suspend fun getSedes(): Response<SedesResponse>

  @POST("movil/reservas")
  suspend fun crearReserva(
    @Body reserva: ReservaRequest
  ): Response<ReservaResponse>

  @GET("reservas/{telefono}")
  suspend fun getReservaByTelefono(@Path("telefono") telefono: String): Response<Map<String, Any>>
}
