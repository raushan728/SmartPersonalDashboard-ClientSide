"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Calendar, MessageSquare, Wallet } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      bg: "bg-green-600",
      title: "Task Management",
      description: "Organize and track your tasks efficiently with file attachments.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      bg: "bg-blue-600",
      title: "AI Assistant",
      description: "Smart AI chat that helps with daily tasks and questions.",
    },
    {
      icon: <Wallet className="h-6 w-6 text-white" />,
      bg: "bg-yellow-500",
      title: "Expense Tracking",
      description: "Monitor your expenses and income with detailed analytics.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-white" />,
      bg: "bg-purple-600",
      title: "Calendar Events",
      description: "Schedule and manage your events with reminders.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      bg: "bg-pink-600",
      title: "Analytics Dashboard",
      description: "Detailed insights and reports for your productivity.",
    },
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      bg: "bg-red-600",
      title: "Secure & Private",
      description: "Your data is completely secure with JWT authentication",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-float">
              <Zap className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Smart Dashboard for Productivity</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
              Your Personal
              <br />
              <span className="text-white">Smart Dashboard</span>
            </h1>

            <p className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed">
              Manage tasks, chat with AI, track expenses, aur organize events - sab kuch ek jagah. Boost karo apni
              productivity with our intelligent dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white bg-opacity-20 text-white px-8 py-4 text-lg font-semibold hover:bg-opacity-40 transition-colors hover:shadow-lg hover:shadow-white/50"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover-zoom px-8 py-4 text-lg border-white border-opacity-20 text-white hover:bg-white hover:bg-opacity-20 hover:text-white"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-300">
              Everything you need to stay organized aur productive in one beautiful dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`mb-4 p-3 rounded-full w-fit ${feature.bg}`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-xl text-white mb-8">
              Join thousands of users jo already use kar rahe hain our smart dashboard to boost their productivity aur
              organize their life.
            </p>
            <Link href="/register">
              <Button size="lg" className="gradient-hover hover-zoom px-12 py-4 text-lg font-semibold animate-glow">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
