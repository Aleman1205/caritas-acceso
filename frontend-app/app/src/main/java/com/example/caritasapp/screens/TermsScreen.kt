package com.example.caritasapp.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import androidx.navigation.NavHostController
import com.example.caritasapp.R
import com.example.caritasapp.data.UserPreferences
import com.example.caritasapp.navigation.Screen
import com.example.caritasapp.ui.theme.CaritasBlueTeal
import com.example.caritasapp.ui.theme.CaritasNavy
import kotlinx.coroutines.launch

@Composable
fun TermsScreen(navController: NavHostController) {
  val context = LocalContext.current
  val prefs = remember { UserPreferences(context.applicationContext) }
  val coroutine = rememberCoroutineScope()

  Surface(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.White)
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(20.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      // 🔹 Header section
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .clip(RoundedCornerShape(16.dp))
          .background(CaritasBlueTeal.copy(alpha = 0.1f))
          .padding(vertical = 16.dp)
      ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Image(
            painter = painterResource(id = R.drawable.logo_caritas),
            contentDescription = "Logo Cáritas",
            modifier = Modifier
              .size(120.dp)
              .padding(bottom = 8.dp),
            contentScale = ContentScale.Fit
          )

          Text(
            text = "Aviso de Privacidad 2025",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = CaritasNavy,
            textAlign = TextAlign.Center
          )
        }
      }

      Spacer(modifier = Modifier.height(24.dp))

      // 🔹 Scrollable Privacy Text
      Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FAFB)),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        modifier = Modifier
          .fillMaxWidth()
          .weight(1f)
          .verticalScroll(rememberScrollState())
      ) {
        Column(modifier = Modifier.padding(20.dp)) {
          Text(
            text = """
CÁRITAS DE MONTERREY, A.B.P., hace de su conocimiento el presente Aviso de Privacidad de acuerdo a lo dispuesto por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, para informarle cuáles son los datos personales que podemos obtener, sus finalidades, así como los términos en que los estaremos utilizando, buscando garantizar su confidencialidad y protección de acuerdo a las medidas de seguridad físicas, técnicas y administrativas que hemos dispuesto para dicho fin.

Se cuidarán en todo momento los datos personales de nuestros beneficiarios, donantes, voluntarios, prestadores de servicio social y personal que labora en nuestra institución.

¿Quién es el responsable de proteger los Datos Personales recabados?
CÁRITAS DE MONTERREY, A.B.P. con domicilio en FRANCISCO G. SADA PTE 2810, OBISPADO MONTERREY, NUEVO LEÓN, MÉXICO 64040, es responsable de recabar sus datos personales, del uso que se le dé a los mismos y de su protección.

¿Para qué fines utilizaremos sus datos personales?
1. Captación de donativos.
2. Ofrecer servicio de registro de donantes y pagos en línea.
3. Trámite de recibo deducible.
4. Difusión de información de áreas de servicio y campañas.
5. Donativos directos: únicos y/o recurrentes.
6. Invitaciones a campañas y nuevos programas.
7. Programas de apadrinamiento.
8. Voluntariado.
9. Generación de bases de datos.

De manera adicional, utilizaremos su información personal para finalidades secundarias que no son indispensables, pero que nos permiten y facilitan brindarle una mejor atención:
1. Evaluar la calidad del servicio que brindamos.
2. Envío de boletines electrónicos.
3. Mercadotecnia o publicidad.
4. Elaborar estudios y programas que determinen hábitos de consumo.

¿Cómo puede limitar el uso de sus datos personales?
Si no desea que sus datos sean utilizados para las finalidades secundarias descritas, puede enviar su solicitud al correo: caritas@caritas.org.mx

Cambios al Aviso de Privacidad:
Los cambios derivados de actualizaciones administrativas o legales serán notificados a través de nuestro sitio web.

El titular podrá ejercer en todo momento su derecho de acceso, rectificación, cancelación y oposición (A.R.C.O.) de sus datos personales mediante aviso por escrito en las oficinas de la institución, debidamente identificado.

Fecha de última actualización: 08/01/2025.
""".trimIndent(),
            fontSize = 16.sp,
            color = CaritasNavy,
            textAlign = TextAlign.Justify,
            lineHeight = 22.sp
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // 🔹 Accept Button
      Button(
        onClick = {
          coroutine.launch { prefs.setTermsAccepted(true) }
          navController.navigate(Screen.Start.route) {
            popUpTo(Screen.Terms.route) { inclusive = true }
          }
        },
        colors = ButtonDefaults.buttonColors(containerColor = CaritasBlueTeal),
        shape = RoundedCornerShape(40.dp),
        modifier = Modifier
          .fillMaxWidth()
          .height(60.dp),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
      ) {
        Text(
          text = "Aceptar y continuar",
          fontSize = 18.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White
        )
      }
    }
  }
}
