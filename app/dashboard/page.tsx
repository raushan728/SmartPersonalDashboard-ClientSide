"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Wallet, MessageSquare, TrendingUp, Clock } from "lucide-react"

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  totalExpenses: number
  totalIncome: number
  upcomingEvents: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalExpenses: 0,
    totalIncome: 0,
    upcomingEvents: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      // Fetch tasks
      const tasksResponse = await fetch("http://localhost:5000/api/tasks", { headers })
      const tasks = tasksResponse.ok ? await tasksResponse.json() : []

      // Fetch expenses
      const expensesResponse = await fetch("http://localhost:5000/api/expenses", { headers })
      const expenses = expensesResponse.ok ? await expensesResponse.json() : []

      // Fetch events
      const eventsResponse = await fetch("http://localhost:5000/api/events", { headers })
      const events = eventsResponse.ok ? await eventsResponse.json() : []

      // Calculate stats
      const completedTasks = tasks.filter((task: any) => task.completed).length
      const totalExpenses = expenses
        .filter((exp: any) => exp.type === "Expense")
        .reduce((sum: number, exp: any) => sum + exp.amount, 0)
      const totalIncome = expenses
        .filter((exp: any) => exp.type === "Income")
        .reduce((sum: number, exp: any) => sum + exp.amount, 0)
      const upcomingEvents = events.filter((event: any) => new Date(event.start) > new Date()).length

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        totalExpenses,
        totalIncome,
        upcomingEvents,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      description: `${stats.completedTasks} completed`,
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      color: "from-green-600/20 to-green-400/5",
    },
    {
      title: "Total Expenses",
      value: `₹${stats.totalExpenses.toLocaleString()}`,
      description: "This month",
      icon: <Wallet className="h-6 w-6 text-red-400" />,
      color: "from-red-600/20 to-red-400/5",
    },
    {
      title: "Total Income",
      value: `₹${stats.totalIncome.toLocaleString()}`,
      description: "This month",
      icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
      color: "from-emerald-600/20 to-emerald-400/5",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      description: "Next 30 days",
      icon: <Calendar className="h-6 w-6 text-blue-400" />,
      color: "from-blue-600/20 to-blue-400/5",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-300 text-lg">Here's what's happening with your productivity today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className={`transform hover:scale-105 bg-gradient-to-br ${stat.color} bg-slate-800/50 backdrop-blur-sm border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                <p className="text-xs text-slate-400">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="transform hover:scale-105 bg-slate-800/50 backdrop-blur-sm border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">Quick Task</CardTitle>
                  <CardDescription className="text-slate-400">Add a new task quickly</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="transform hover:scale-105 bg-slate-800/50 backdrop-blur-sm border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">AI Assistant</CardTitle>
                  <CardDescription className="text-slate-400">Chat with your AI helper</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="transform hover:scale-105 bg-slate-800/50 backdrop-blur-sm border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">Add Expense</CardTitle>
                  <CardDescription className="text-slate-400">Track your spending</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-blue-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">Your latest actions across the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-600/10 rounded-lg hover:bg-blue-600/20 transition-all duration-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">Dashboard loaded successfully</span>
                <span className="text-xs text-slate-400 ml-auto">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
