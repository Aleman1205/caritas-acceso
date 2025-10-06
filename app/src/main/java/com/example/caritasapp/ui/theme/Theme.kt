package com.example.caritasapp.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = CaritasNavy,
    onPrimary = Color.White,
    secondary = CaritasBlueTeal,
    onSecondary = Color.White,
    tertiary = CaritasOrange,
    background = Color(0xFF0F172A),
    surface = Color(0xFF1E293B),
    onBackground = Color.White,
    onSurface = Color.White
)

private val LightColorScheme = lightColorScheme(
    primary = CaritasBlueTeal,
    onPrimary = Color.White,
    secondary = CaritasNavy,
    onSecondary = Color.White,
    tertiary = CaritasOrange,
    background = CaritasLight,
    surface = Color.White,
    onBackground = Color.Black,
    onSurface = CaritasNavy
)

@Composable
fun CaritasAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
      SideEffect {
        val window = (view.context as Activity).window
        window.statusBarColor = colorScheme.primary.toArgb()
        WindowCompat.getInsetsController(window, view)
          .isAppearanceLightStatusBars = !darkTheme
      }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
  )
}
