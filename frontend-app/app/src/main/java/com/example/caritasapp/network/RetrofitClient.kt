package com.example.caritasapp.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
  private const val BASE_URL = "http://10.22.235.223:3000/"

  val instance: Retrofit by lazy {
    Retrofit.Builder()
      .baseUrl(BASE_URL)
      .addConverterFactory(GsonConverterFactory.create())
      .build()
  }
}
