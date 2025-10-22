package com.example.caritasapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.caritasapp.data.UserPreferences
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.CaritasBlueTeal
import com.example.caritasapp.ui.theme.CaritasNavy
import kotlinx.coroutines.launch

@Composable
fun TermsScreen(navController: NavHostController) {
  // 🔹 Agregado: conexión con DataStore
  val context = LocalContext.current
  val prefs = remember { UserPreferences(context.applicationContext) }
  val coroutine = rememberCoroutineScope()

  Surface(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 24.dp, vertical = 32.dp)
  ) {
    // 🔹 Contenedor con scroll
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState()),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      // 🔹 Título
      Text(
        text = "Aviso de Privacidad 2025",
        fontSize = 26.sp,
        fontWeight = FontWeight.Bold,
        color = CaritasNavy,
        textAlign = TextAlign.Center,
        modifier = Modifier.padding(bottom = 20.dp)
      )

      // 🔹 Texto
      Text(
        text = """
CÁRITAS DE MONTERREY, A.B.P., hace de su conocimiento el presente Aviso de Privacidad
de acuerdo a lo dispuesto por la Ley Federal de Protección de Datos Personales en Posesión
de los Particulares (LFPDPPP) y su Reglamento, para informarle cuáles son los datos
personales que podemos obtener, sus finalidades, así como los términos en que los estaremos
utilizando, buscando garantizar su confidencialidad y protección de acuerdo a las medidas de
seguridad físicas, técnicas y administrativas que hemos dispuesto para dicho fin.

Se cuidarán en todo momento los datos personales de nuestros beneficiarios, donantes,
voluntarios, prestadores de servicio social y personal que labora en nuestra institución.

¿Quién es el responsable de proteger los Datos Personales recabados?
CÁRITAS DE MONTERREY, A.B.P con domicilio en FRANCISCO G. SADA PTE 2810
OBISPADO MONTERREY, NUEVO LEON, MEXICO 64040 es responsable de recabar sus
datos personales, del uso que se le dé a los mismos y de su protección.

¿Para qué fines utilizaremos sus datos personales?
1. Captación de donativos.
2. Ofrecer servicio de registro de donantes y pagos en línea.
3. Trámite de recibo deducible.
4. Difusión de información de áreas de servicio y campañas.
5. Donativos directos: únicos y/o recurrentes.
6. Invitaciones para presentación de campañas y nuevos programas.
7. Programas de apadrinamiento.
8. Voluntariado.
9. Generación de bases de datos.

De manera adicional, utilizaremos su información personal para las siguientes finalidades
secundarias que no son indispensables para servirle, pero que nos permiten y facilitan brindarle
una mejor atención:
1. Evaluar la calidad del servicio que brindamos.
2. Envío de Boletines Electrónicos.
3. Mercadotecnia o publicidad.
4. Elaborar estudios y programas que son necesarios para determinar hábitos de consumo.

¿Cómo puede limitar el uso de sus datos personales para finalidades secundarias?
En caso de que no desee que sus datos personales sean utilizados para las finalidades
secundarias descritas en el presente Aviso de Privacidad, ponemos a su disposición el siguiente
correo electrónico para manifestar su negativa: caritas@caritas.org.mx

Cambios al Aviso de Privacidad
Los cambios que se pudieran realizar al Aviso de Privacidad derivados de cambios en la
administración, operación y/o actualizaciones a la propia Ley y Reglamento que lo sustentan,
se los estaremos notificando a través de nuestro sitio web.

El titular de los datos personales podrá ejercer en todo momento su derecho de acceso,
rectificación, cancelación y oposición (A.R.C.O.) de datos personales que proporcione,
pudiendo ejercer tal derecho mediante aviso por escrito en las oficinas de la institución,
debidamente identificado.

Fecha de última de actualización: 08/01/2025.
                """.trimIndent(),
        fontSize = 17.sp,
        color = CaritasNavy,
        textAlign = TextAlign.Justify,
        modifier = Modifier.padding(bottom = 36.dp)
      )

      // 🔹 Botón Aceptar
      Button(
        onClick = {
          // Guarda el valor en DataStore
          coroutine.launch {
            prefs.setTermsAccepted(true)
          }
          // Navega al inicio
          navController.navigate(Screen.Start.route) {
            popUpTo(Screen.Terms.route) { inclusive = true }
          }
        },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
        shape = MaterialTheme.shapes.medium,
        modifier = Modifier
          .fillMaxWidth()
          .height(60.dp)
      ) {
        Text("Aceptar", fontSize = 18.sp, color = MaterialTheme.colorScheme.onPrimary)
      }
    }
  }
}
