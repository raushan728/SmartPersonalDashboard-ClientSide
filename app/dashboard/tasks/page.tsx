"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Paperclip, Trash2, Edit, CheckCircle, Circle, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface Task {
  _id: string
  title: string
  description: string
  dueDate: string
  priority: "Low" | "Medium" | "High"
  completed: boolean
  attachments: Array<{
    _id: string
    filename: string
    filepath: string
    filetype: string
  }>
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  })
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchTasks()
  }, [router])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("dueDate", formData.dueDate)
    formDataToSend.append("priority", formData.priority)

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formDataToSend.append("attachments", selectedFiles[i])
      }
    }

    try {
      const url = editingTask
        ? `http://localhost:5000/api/tasks/${editingTask._id}`
        : "http://localhost:5000/api/tasks"
      const method = editingTask ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      })

      if (response.ok) {
        fetchTasks()
        setShowCreateDialog(false)
        setEditingTask(null)
        setFormData({ title: "", description: "", dueDate: "", priority: "Medium" })
        setSelectedFiles(null)
      } else {
        const errorText = await response.text();
        alert("Task creation failed: " + errorText);
      }
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (response.ok) fetchTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
      case "Medium":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
      case "Low":
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      priority: task.priority,
    })
    setShowCreateDialog(true)
  }

  const closeDialog = () => {
    setShowCreateDialog(false)
    setEditingTask(null)
    setFormData({ title: "", description: "", dueDate: "", priority: "Medium" })
    setSelectedFiles(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="text-white">Manage your tasks in style 🚀</p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/40 backdrop-blur-lg border border-white/10 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-primary">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </DialogTitle>
                <DialogDescription>
                  {editingTask ? "Update your task details" : "Add a new task to your list"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title"
                    required
                    className="hover:border-primary focus:ring focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description"
                    className="hover:border-primary focus:ring focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="hover:border-primary focus:ring focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "Low" | "Medium" | "High") =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="hover:border-primary focus:ring focus:ring-primary/40 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                    className="hover:border-primary focus:ring focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold hover:scale-105 transition-transform"
                  >
                    {editingTask ? "Update Task" : "Create Task"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    className="hover:scale-105 transition-transform"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div whileHover={{ scale: 1.03 }} key={task._id} transition={{ duration: 0.2 }}>
              <Card
                className={`bg-white/30 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl transition-all ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTaskComplete(task._id, task.completed)}
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                      <CardTitle
                        className={`text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </CardTitle>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  {task.description && <CardDescription className="text-sm">{task.description}</CardDescription>}
                </CardHeader>

                <CardContent className="space-y-4">
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}

                  {task.attachments.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        Attachments ({task.attachments.length})
                      </div>
                      <div className="space-y-1">
                        {task.attachments.map((attachment) => (
                          <div
                            key={attachment._id}
                            className="flex items-center justify-between bg-muted/50 p-2 rounded text-xs"
                          >
                            <span className="truncate">{attachment.filename}</span>
                            <a
                              href={attachment.filepath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <Download className="h-3 w-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(task)}
                      className="hover:bg-primary hover:text-white transition-all flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTask(task._id)}
                      className="hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-white">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="mb-4">Create your first task to get started</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Task
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
