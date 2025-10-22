package com.example.caritasapp.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import com.example.caritasapp.R
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel

data class CaritasSede(
  val name: String,
  val imageRes: Int,
  val mapsUrl: String,
  val phone: String,
  val horario: String = "Todos los dias: 24hrs",
  val servicios: List<String> = listOf(
    "Alojamiento",
    "Alimientos",
    "Transporte Solidario",
    "Atencion Medica",
    "Lavanderia"
    )
)

@Composable
fun StartScreen(navController: NavHostController, viewModel: CaritasViewModel) {
  val context = LocalContext.current
  val sedes = viewModel.sedesInfo.value
  val isLoading = viewModel.isLoadingSedesInfo.value
  val error = viewModel.errorSedesInfo.value

  LaunchedEffect(Unit) {
    viewModel.getSedesConServicios()
  }

  Surface(modifier = Modifier.fillMaxSize(), color = Color.White) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(10.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      Image(
        painter = painterResource(id = R.drawable.logo_caritas),
        contentDescription = "Logo Cáritas",
        modifier = Modifier
          .size(200.dp)
          .padding(top = 10.dp, bottom = 10.dp)
      )

      Button(
        onClick = { navController.navigate(Screen.Home.route) },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
        shape = RoundedCornerShape(28.dp),
        modifier = Modifier
          .fillMaxWidth(0.8f)
          .height(65.dp)
      ) {
        Text(
          text = "¡Reserva ya!",
          fontSize = 22.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
      }

      Spacer(modifier = Modifier.height(30.dp))

      Text(
        text = "Sedes de Cáritas",
        fontSize = 22.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        textAlign = TextAlign.Start,
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp)
      )

      when {
        isLoading -> {
          Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = CaritasNavy)
          }
        }

        error != null -> {
          Text(
            text = error,
            color = Color.Red,
            modifier = Modifier.padding(16.dp),
            textAlign = TextAlign.Center
          )
        }

        else -> {
          LazyColumn(
            modifier = Modifier
              .fillMaxWidth()
              .padding(bottom = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
          ) {
            items(sedes) { sede ->
              var expanded by remember { mutableStateOf(false) }

              Card(
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                  .fillMaxWidth()
                  .background(Color.White)
                  .clickable { expanded = !expanded },
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
              ) {
                Column(modifier = Modifier.padding(12.dp)) {
                  // keep hardcoded image and phone per sede.id
                  val imageRes = when (sede.id) {
                    1 -> R.drawable.sede1
                    2 -> R.drawable.sede2
                    3 -> R.drawable.sede3
                    4 -> R.drawable.sede4
                    else -> R.drawable.sede1
                  }
                  val phone = when (sede.id) {
                    1 -> "8123456789"
                    2 -> "8187654321"
                    3 -> "8185567788"
                    else -> "8197538642"
                  }

                  Image(
                    painter = painterResource(id = imageRes),
                    contentDescription = sede.nombre,
                    modifier = Modifier
                      .fillMaxWidth()
                      .height(180.dp)
                      .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                  )

                  Spacer(modifier = Modifier.height(8.dp))

                  Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                  ) {
                    Text(
                      text = sede.nombre,
                      fontSize = 20.sp,
                      fontWeight = FontWeight.Bold,
                      color = CaritasNavy
                    )
                    Icon(
                      imageVector = if (expanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown,
                      contentDescription = if (expanded) "Colapsar" else "Expandir",
                      tint = CaritasBlueTeal,
                      modifier = Modifier.size(28.dp)
                    )
                  }

                  AnimatedVisibility(
                    visible = expanded,
                    enter = fadeIn() + expandVertically(),
                    exit = fadeOut() + shrinkVertically()
                  ) {
                    Column(
                      modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                    ) {
                      Divider(color = CaritasBlueTeal.copy(alpha = 0.2f))

                      // ✅ Hardcoded Google Maps links for each sede
                      val mapsUrl = when (sede.id) {
                        1 -> "https://maps.app.goo.gl/w57kTJAMnULSx6oRA?g_st=ipc"
                        2 -> "https://maps.app.goo.gl/hNU4aY6Jfo5EDmzR6?g_st=ipc"
                        3 -> "https://maps.app.goo.gl/v3vpKYeMJWWcxM9y6?g_st=ipc"
                        4 -> "https://maps.app.goo.gl/491JYAXPMJifmjWC8?g_st=ipc"
                        else -> "https://maps.google.com"
                      }

                      Text(
                        text = "Ver en Google Maps",
                        color = CaritasBlueTeal,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier
                          .padding(top = 6.dp)
                          .clickable {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(mapsUrl))
                            context.startActivity(intent)
                          }
                      )

                      Text(
                        text = "Llamar: $phone",
                        color = CaritasBlueTeal,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier
                          .padding(top = 4.dp)
                          .clickable {
                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
                            context.startActivity(intent)
                          }
                      )

                      Text(
                        text = "Horario: ${sede.horainicio ?: "N/A"} - ${sede.horafinal ?: "N/A"}",
                        color = CaritasNavy,
                        fontSize = 15.sp,
                        modifier = Modifier.padding(top = 6.dp)
                      )

                      Text(
                        text = "Servicios disponibles:",
                        color = CaritasNavy,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(top = 6.dp)
                      )

                      sede.servicios.forEach { servicio ->
                        Text(
                          text = "• ${servicio.nombre}",
                          color = CaritasNavy,
                          fontSize = 15.sp,
                          modifier = Modifier.padding(start = 8.dp, top = 2.dp)
                        )
                      }

                  var promedio by remember { mutableStateOf<Double?>(null) }
                      var totalReviews by remember { mutableStateOf<Int?>(null) }

                      LaunchedEffect(sede.id) {
                        viewModel.getPromedioRating(sede.id) { promedioResult, total ->
                          promedio = promedioResult
                          totalReviews = total
                        }
                      }

                      Spacer(modifier = Modifier.height(8.dp))

                      if (promedio != null && totalReviews != null) {
                        Row(
                          verticalAlignment = Alignment.CenterVertically,
                          modifier = Modifier.padding(top = 4.dp)
                        ) {
                          repeat(5) { i ->
                            val filled = (i + 1) <= promedio!!.toInt()
                            Icon(
                              painter = painterResource(
                                id = if (filled) R.drawable.ic_star_filled else R.drawable.ic_star_outline
                              ),
                              contentDescription = null,
                              tint = Color.Yellow,
                              modifier = Modifier.size(20.dp)
                            )
                          }
                          Text(
                            text = " ${String.format("%.1f", promedio)} / 5  (${totalReviews} reseñas)",
                            fontSize = 14.sp,
                            color = CaritasNavy,
                            modifier = Modifier.padding(start = 4.dp)
                          )
                        }
                      }

                      Spacer(modifier = Modifier.height(8.dp))
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
