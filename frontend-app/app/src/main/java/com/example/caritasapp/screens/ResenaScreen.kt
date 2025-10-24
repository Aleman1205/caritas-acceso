package com.example.caritasapp.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.caritasapp.R
import com.example.caritasapp.ui.components.CaritasScaffold
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ResenaScreen(navController: NavController, viewModel: CaritasViewModel) {
  val selectedSedeId by viewModel.selectedSedeId
  val selectedSedeName by viewModel.selectedSedeName

  var rating by remember { mutableStateOf(0) }
  var comment by remember { mutableStateOf("") }
  var loading by remember { mutableStateOf(false) }
  val context = LocalContext.current

  CaritasScaffold(navController) { padding ->
    Surface(
      modifier = Modifier
        .fillMaxSize()
        .padding(padding)
        .background(Color.White)
        .padding(horizontal = 24.dp, vertical = 36.dp)
    ) {
      Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally
      ) {
        Text(
          text = "Califica tu experiencia en:",
          fontSize = 22.sp,
          color = CaritasNavy,
          fontWeight = FontWeight.Medium
        )

        Text(
          text = selectedSedeName ?: "—",
          fontSize = 26.sp,
          color = CaritasBlueTeal,
          fontWeight = FontWeight.Bold,
          textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        RatingBar(rating = rating, onRatingChanged = { rating = it })

        Spacer(modifier = Modifier.height(28.dp))

        TextField(
          value = comment,
          onValueChange = { comment = it },
          label = { Text("Escribe un comentario (opcional)") },
          modifier = Modifier
            .fillMaxWidth()
            .height(140.dp),
          shape = RoundedCornerShape(16.dp),
          colors = TextFieldDefaults.colors(
            focusedContainerColor = CaritasLight,
            unfocusedContainerColor = CaritasLight,
            focusedIndicatorColor = CaritasBlueTeal,
            unfocusedIndicatorColor = CaritasBlueTeal.copy(alpha = 0.4f)
          )
        )

        Spacer(modifier = Modifier.height(36.dp))

        Button(
          onClick = {
            when {
              rating == 0 -> Toast.makeText(
                context,
                "Selecciona una calificación",
                Toast.LENGTH_SHORT
              ).show()

              selectedSedeId == null -> Toast.makeText(
                context,
                "Selecciona una sede primero",
                Toast.LENGTH_SHORT
              ).show()

              else -> {
                loading = true
                viewModel.enviarRating(
                  selectedSedeId!!,
                  rating,
                  comment
                ) { success, msg ->
                  loading = false
                  Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                  if (success) navController.popBackStack()
                }
              }
            }
          },
          enabled = !loading,
          colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
          shape = RoundedCornerShape(24.dp),
          modifier = Modifier
            .fillMaxWidth()
            .height(65.dp)
        ) {
          Text(
            text = if (loading) "Enviando..." else "Enviar",
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
          )
        }
      }
    }
  }
}

@Composable
fun RatingBar(
  rating: Int,
  onRatingChanged: (Int) -> Unit,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier,
    horizontalArrangement = Arrangement.Center,
    verticalAlignment = Alignment.CenterVertically
  ) {
    for (i in 1..5) {
      val icon = if (i <= rating) R.drawable.ic_star_filled else R.drawable.ic_star_outline
      Icon(
        painter = painterResource(id = icon),
        contentDescription = null,
        tint = Color(0xFFFFC107), // soft yellow, matches Cáritas palette
        modifier = Modifier
          .size(42.dp)
          .clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication = null
          ) { onRatingChanged(i) }
      )
      Spacer(modifier = Modifier.width(6.dp))
    }
  }
}
