package com.example.caritasapp.network

import com.example.caritasapp.navigation.ReservasResponse
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
  @GET("movil/sedes")
  suspend fun getSedes(): Response<SedesResponse>

  @POST("movil/reservas")
  suspend fun crearReserva(
    @Body reserva: ReservaRequest
  ): Response<ReservaResponse>

  @GET("movil/reservas/{telefono}")
  suspend fun getReservasPorTelefono(
    @Path("telefono") telefono: String
  ): Response<ReservasResponse>

  @GET("movil/sedes/{id}/servicios")
  suspend fun getServiciosPorSede(
    @Path("id") id: Int
  ): ServiciosResponse

  @POST("movil/transporte")
  suspend fun solicitarTransporte(
    @Body request: TransporteRequest
  ): Response<Unit>

  @POST("movil/ratings/crear")
  suspend fun crearRating(
    @Body ratingRequest: RatingRequest
  ): Response<GenericResponse>

  @GET("movil/sedes-info")
  suspend fun getSedesConServicios(): Response<SedesInfoResponse>

  @GET("movil/ratings/promedio/{id_sede}")
  suspend fun obtenerPromedioRating(@Path("id_sede") idSede: Int): Response<RatingPromedioResponse>
}
