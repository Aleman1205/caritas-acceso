package com.example.caritasapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.caritasapp.network.ApiService
import com.example.caritasapp.network.RatingRequest
import com.example.caritasapp.network.RetrofitClient
import com.example.caritasapp.network.SedeInfoItem
import com.example.caritasapp.network.ServicioItem
import com.example.caritasapp.network.TransporteRequest
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException

class CaritasViewModel : ViewModel() {

  // ---- Existing state ----
  var selectedSedeId = mutableStateOf<Int?>(null)
  var selectedSedeName = mutableStateOf<String?>(null)

  var selectedDate = mutableStateOf("")  // fechaInicio
  var selectedHour = mutableStateOf("8")
  var selectedMinute = mutableStateOf("00")
  var amPm = mutableStateOf("AM")

  var nombre = mutableStateOf("")
  var telefono = mutableStateOf("")
  var correo = mutableStateOf("")
  var hombres = mutableStateOf(0)
  var mujeres = mutableStateOf(0)

  var reservationClave = mutableStateOf("")
  var hasActiveReservation = mutableStateOf(false)

  // ---- New state for ConsultarServicios ----
  var servicios = mutableStateOf<List<ServicioItem>>(emptyList())
  var isLoadingServicios = mutableStateOf(false)
  var errorServicios = mutableStateOf<String?>(null)

  private val apiService = RetrofitClient.instance.create(ApiService::class.java)

  // ---- Function to fetch servicios of selected sede ----
  fun getServiciosPorSede() {
    val sedeId = selectedSedeId.value ?: return
    viewModelScope.launch {
      try {
        isLoadingServicios.value = true
        errorServicios.value = null

        val response = apiService.getServiciosPorSede(sedeId)
        if (response.success) {
          servicios.value = response.servicios
        } else {
          servicios.value = emptyList()
          errorServicios.value = "No se encontraron servicios en esta sede."
        }
      } catch (e: IOException) {
        errorServicios.value = "Error de conexión. Verifica tu red."
      } catch (e: HttpException) {
        errorServicios.value = "Error del servidor (${e.code()})"
      } catch (e: Exception) {
        errorServicios.value = "Error inesperado: ${e.localizedMessage}"
      } finally {
        isLoadingServicios.value = false
      }
    }
  }

  fun solicitarTransporte(
    request: TransporteRequest,
    onSuccess: () -> Unit,
    onError: (String) -> Unit
  ) {
    viewModelScope.launch {
      try {
        val response = apiService.solicitarTransporte(request)
        if (response.isSuccessful) onSuccess()
        else onError("Error al enviar la solicitud")
      } catch (e: Exception) {
        e.printStackTrace()
        onError("Error de conexión con el servidor")
      }
    }
  }

  fun enviarRating(idSede: Int, estrellas: Int, comentario: String, onResult: (Boolean, String) -> Unit) {
    viewModelScope.launch {
      try {
        val response = apiService.crearRating(
          RatingRequest(estrellas, comentario.ifBlank { null }, idSede)
        )
        if (response.isSuccessful && response.body()?.success == true) {
          onResult(true, "Gracias por tu calificación <3")
        } else {
          onResult(false, response.body()?.message ?: "Error al enviar rating")
        }
      } catch (e: Exception) {
        e.printStackTrace()
        onResult(false, "Error de conexión con el servidor")
      }
    }
  }

  // --- Inside CaritasViewModel.kt ---
  var sedesInfo = mutableStateOf<List<SedeInfoItem>>(emptyList())
  var isLoadingSedesInfo = mutableStateOf(false)
  var errorSedesInfo = mutableStateOf<String?>(null)

  fun getSedesConServicios() {
    viewModelScope.launch {
      try {
        isLoadingSedesInfo.value = true
        errorSedesInfo.value = null

        val response = RetrofitClient.instance.create(ApiService::class.java)
          .getSedesConServicios()

        if (response.isSuccessful && response.body()?.success == true) {
          sedesInfo.value = response.body()!!.data
        } else {
          errorSedesInfo.value = "Error al obtener las sedes."
        }
      } catch (e: Exception) {
        errorSedesInfo.value = "Error: ${e.localizedMessage}"
      } finally {
        isLoadingSedesInfo.value = false
      }
    }
  }

  fun getPromedioRating(idSede: Int, onResult: (Double?, Int?) -> Unit) {
    viewModelScope.launch {
      try {
        val response = apiService.obtenerPromedioRating(idSede)
        if (response.isSuccessful && response.body()?.success == true) {
          val data = response.body()?.data
          val promedio = data?.promedio ?: 0.0
          val total = data?.total_reviews ?: 0
          onResult(promedio, total)
        } else {
          onResult(null, null)
        }
      } catch (e: Exception) {
        e.printStackTrace()
        onResult(null, null)
      }
    }
  }
}
