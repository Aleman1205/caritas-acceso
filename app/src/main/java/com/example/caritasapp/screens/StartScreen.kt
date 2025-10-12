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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
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
fun StartScreen(navController: NavHostController) {
  val context = LocalContext.current

  val sedes = listOf(
    CaritasSede(
      name = "Cáritas Monterrey - Centro",
      imageRes = R.drawable.sede1,
      mapsUrl = "https://maps.google.com/?q=Cáritas Monterrey Centro",
      phone = "8123456789"
    ),
    CaritasSede(
      name = "Cáritas Monterrey - Norte",
      imageRes = R.drawable.sede2,
      mapsUrl = "https://maps.google.com/?q=Cáritas Monterrey Norte",
      phone = "8187654321"
    ),
    CaritasSede(
      name = "Cáritas Monterrey - Sur",
      imageRes = R.drawable.sede3,
      mapsUrl = "https://maps.google.com/?q=Cáritas Monterrey Sur",
      phone = "8185567788"
    ),
    CaritasSede(
      name = "Cáritas Monterrey - Guadalupe",
      imageRes = R.drawable.sede4,
      mapsUrl = "https://maps.google.com/?q=Cáritas Monterrey Guadalupe",
      phone = "8197538642"
    )
  )

  Surface(
    modifier = Modifier.fillMaxSize(),
    color = Color.White
  ) {
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

      LazyColumn(
        modifier = Modifier
          .fillMaxWidth()
          .padding(bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
      ) {
        items(sedes.size) { index ->
          val sede = sedes[index]
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
            Column(
              modifier = Modifier.padding(12.dp)
            ) {
              Image(
                painter = painterResource(id = sede.imageRes),
                contentDescription = sede.name,
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
                  text = sede.name,
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

                  Text(
                    text = "Ver en Google Maps",
                    color = CaritasBlueTeal,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier
                      .padding(top = 6.dp)
                      .clickable {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(sede.mapsUrl))
                        context.startActivity(intent)
                      }
                  )

                  Text(
                    text = "Llamar: ${sede.phone}",
                    color = CaritasBlueTeal,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier
                      .padding(top = 4.dp)
                      .clickable {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${sede.phone}"))
                        context.startActivity(intent)
                      }
                  )

                  Text(
                    text = "Horario: ${sede.horario}",
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
                      text = "• $servicio",
                      color = CaritasNavy,
                      fontSize = 15.sp,
                      modifier = Modifier.padding(start = 8.dp, top = 2.dp)
                    )
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
