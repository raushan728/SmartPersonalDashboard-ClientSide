"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number | undefined
  icon: string
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [city, setCity] = useState("Delhi")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWeather("Delhi")
  }, [])

  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/weather/current/${cityName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Transform API response to WeatherData interface
        const transformedData = {
          location: data.name,
          temperature: data.main?.temp,
          description: data.weather?.[0]?.description,
          humidity: data.main?.humidity,
          windSpeed: data.wind?.speed,
          pressure: data.main?.pressure,
          visibility: data.visibility ? data.visibility / 1000 : undefined, // convert meters to km
          icon: data.weather?.[0]?.icon,
        }
        setWeather(transformedData)
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city.trim())
    }
  }

  const getWeatherIcon = (description: string | undefined) => {
    if (!description) return <Cloud className="h-16 w-16 text-gray-400" />
    const desc = description.toLowerCase()
    if (desc.includes("rain")) return <CloudRain className="h-16 w-16 text-blue-400" />
    if (desc.includes("cloud")) return <Cloud className="h-16 w-16 text-gray-400" />
    if (desc.includes("sun") || desc.includes("clear")) return <Sun className="h-16 w-16 text-yellow-400" />
    return <Cloud className="h-16 w-16 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Weather Dashboard</h1>
          <p className="text-slate-300">Get current weather information for any city</p>
        </div>

        {/* Search Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? "Searching..." : "Get Weather"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {weather && (
          <>
            {/* Main Weather Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">{weather.location}</h2>
                  <div className="flex items-center justify-center space-x-6">
                    {getWeatherIcon(weather.description)}
                    <div>
                      <p className="text-5xl font-bold text-white">{Math.round(weather.temperature)}°C</p>
                      <p className="text-xl text-slate-300 capitalize">{weather.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Droplets className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Humidity</p>
                  <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Wind className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Wind Speed</p>
                  <p className="text-2xl font-bold text-white">{weather.windSpeed} km/h</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Gauge className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Pressure</p>
                  <p className="text-2xl font-bold text-white">{weather.pressure} hPa</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Visibility</p>
                  <p className="text-2xl font-bold text-white">{weather.visibility} km</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!weather && !loading && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Cloud className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Enter a city name to get weather information</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
