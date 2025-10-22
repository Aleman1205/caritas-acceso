package com.example.caritasapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.network.TransporteRequest
import com.example.caritasapp.ui.components.CaritasScaffold
import com.example.caritasapp.ui.theme.*
import com.example.caritasapp.viewmodel.CaritasViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransporteScreen(navController: NavController, viewModel: CaritasViewModel) {
  val scope = rememberCoroutineScope()
  val snackbarHostState = remember { SnackbarHostState() }

  val sedeDestino by viewModel.selectedSedeName
  val telefonoUsuario by viewModel.telefono

  var direccionRecogida by rememberSaveable { mutableStateOf("") }
  var descripcionEntorno by rememberSaveable { mutableStateOf("") }
  var direccionError by remember { mutableStateOf(false) }

  CaritasScaffold(navController) { padding ->
    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { innerPadding ->
      Surface(
        modifier = Modifier
          .fillMaxSize()
          .padding(padding)
          .padding(innerPadding),
        color = Color.White
      ) {
        Column(
          modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp, vertical = 36.dp),
          horizontalAlignment = Alignment.CenterHorizontally
        ) {
          Text(
            text = "Solicitud de Transporte",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = CaritasNavy,
            modifier = Modifier.padding(bottom = 30.dp)
          )

          OutlinedTextField(
            value = sedeDestino ?: "",
            onValueChange = {},
            label = { Text("Destino (Sede)") },
            singleLine = true,
            enabled = false,
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              disabledTextColor = CaritasNavy,
              disabledBorderColor = CaritasBlueTeal.copy(alpha = 0.4f),
              focusedBorderColor = CaritasBlueTeal
            )
          )

          OutlinedTextField(
            value = telefonoUsuario,
            onValueChange = {},
            label = { Text("Teléfono") },
            singleLine = true,
            enabled = false,
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              disabledTextColor = CaritasNavy,
              disabledBorderColor = CaritasBlueTeal.copy(alpha = 0.4f),
              focusedBorderColor = CaritasBlueTeal
            )
          )

          OutlinedTextField(
            value = direccionRecogida,
            onValueChange = {
              direccionRecogida = it
              direccionError = it.isBlank()
            },
            label = { Text("Dirección de recogida") },
            isError = direccionError,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
            modifier = Modifier
              .fillMaxWidth()
              .height(120.dp)
              .padding(vertical = 8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              focusedBorderColor = CaritasBlueTeal,
              unfocusedBorderColor = CaritasBlueTeal.copy(alpha = 0.5f),
              cursorColor = CaritasBlueTeal,
              errorBorderColor = Color.Red
            )
          )

          OutlinedTextField(
            value = descripcionEntorno,
            onValueChange = { descripcionEntorno = it },
            label = { Text("Descripción del entorno") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
            modifier = Modifier
              .fillMaxWidth()
              .height(120.dp)
              .padding(vertical = 8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
              focusedBorderColor = CaritasBlueTeal,
              unfocusedBorderColor = CaritasBlueTeal.copy(alpha = 0.5f),
              cursorColor = CaritasBlueTeal
            )
          )

          if (direccionError) {
            Text(
              text = "Por favor, ingrese una dirección válida",
              color = Color.Red,
              fontSize = 14.sp,
              modifier = Modifier.align(Alignment.Start)
            )
          }

          Spacer(modifier = Modifier.height(40.dp))

          Button(
            onClick = {
              direccionError = direccionRecogida.isBlank()
              if (!direccionError) {
                val request = TransporteRequest(
                  telefono = telefonoUsuario,
                  direccion = direccionRecogida,
                  descripcion = descripcionEntorno
                )

                viewModel.solicitarTransporte(
                  request,
                  onSuccess = {
                    scope.launch {
                      snackbarHostState.showSnackbar("Solicitud de transporte enviada correctamente")
                    }
                    navController.popBackStack(Screen.Home.route, false)
                  },
                  onError = { msg ->
                    scope.launch { snackbarHostState.showSnackbar(msg) }
                  }
                )
              }
            },
            colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier
              .fillMaxWidth()
              .height(70.dp)
          ) {
            Text(
              text = "Solicitar transporte",
              fontSize = 20.sp,
              fontWeight = FontWeight.Bold,
              color = Color.White
            )
          }
        }
      }
    }
  }
}
