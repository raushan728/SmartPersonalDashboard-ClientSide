"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, DollarSign } from "lucide-react"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "food",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    }
  }

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpense.amount || !newExpense.description) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(newExpense.amount),
          description: newExpense.description,
          category: newExpense.category.charAt(0).toUpperCase() + newExpense.category.slice(1).toLowerCase(),
          type: "Expense", // Capitalized type
        }),
      })

      if (response.ok) {
        setNewExpense({ amount: "", description: "", category: "food" })
        fetchExpenses()
      }
    } catch (error) {
      console.error("Error adding expense:", error)
    }
    setLoading(false)
  }

  const deleteExpense = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        fetchExpenses()
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Expense Tracker</h1>
            <p className="text-slate-300">Track and manage your expenses</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Total Expenses</p>
            <p className="text-2xl font-bold text-red-400">₹{totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Expense Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-400" />
              Add New Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="amount" className="text-slate-300">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Expense description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-slate-300">
                  Category
                </Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  {loading ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Category Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <Card
              key={category}
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2 bg-blue-600/20 text-blue-300 border-blue-500/30">
                    {category}
                  </Badge>
                  <p className="text-lg font-semibold text-white">₹{amount.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expenses List */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No expenses found. Add your first expense above!</p>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{expense.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {expense.category}
                          </Badge>
                          <span className="text-xs text-slate-400">{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-red-400">₹{expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
