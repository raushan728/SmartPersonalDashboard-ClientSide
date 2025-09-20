"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Wallet,
  Calendar,
  Cloud,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "AI Chat", href: "/dashboard/ai-chat", icon: MessageSquare },
    { name: "Expenses", href: "/dashboard/expenses", icon: Wallet },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Weather", href: "/dashboard/weather", icon: Cloud },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">Smart Dashboard</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:text-white hover:shadow-md"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-500 bg-transparent transform hover:scale-105 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:bg-slate-700 transform hover:scale-105 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-300">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-[#0f172a]">{children}</main>
      </div>
    </div>
  )
}
