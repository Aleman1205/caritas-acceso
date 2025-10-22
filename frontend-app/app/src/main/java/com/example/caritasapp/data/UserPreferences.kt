package com.example.caritasapp.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import com.example.caritasapp.data.UserPreferences

// Instancia global de DataStore
val Context.dataStore by preferencesDataStore("user_prefs")

class UserPreferences(private val context: Context) {

  companion object {
    private val TERMS_ACCEPTED = booleanPreferencesKey("terms_accepted")
  }

  // Leer si ya aceptó los términos
  val termsAccepted: Flow<Boolean> = context.dataStore.data
    .map { prefs -> prefs[TERMS_ACCEPTED] ?: false }

  // Guardar que los aceptó
  suspend fun setTermsAccepted(value: Boolean) {
    context.dataStore.edit { prefs ->
      prefs[TERMS_ACCEPTED] = value
    }
  }
}
