package com.example.caritasapp.screens

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import com.example.caritasapp.R
import com.example.caritasapp.navigation.Screen
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(navController: NavHostController) {
  val alpha = remember { Animatable(0f) }

  LaunchedEffect(Unit) {
    alpha.animateTo(1f, animationSpec = tween(durationMillis = 1200))
    delay(1500)
    alpha.animateTo(0f, animationSpec = tween(durationMillis = 800))

    // TODO: reemplazar esta parte luego con DataStore (aceptacion de terminos)
    val hasAcceptedTerms = false
    navController.navigate(
      if (hasAcceptedTerms) Screen.Home.route else Screen.Terms.route
    ) {
      popUpTo(Screen.Splash.route) { inclusive = true }
    }
  }

  Box(
    modifier = Modifier.fillMaxSize(),
    contentAlignment = Alignment.Center
  ) {
    Image(
      painterResource(id = R.drawable.logo_caritas),
      contentDescription = "App Logo",
      modifier = Modifier.size(260.dp).alpha(alpha.value)
    )
  }
}
