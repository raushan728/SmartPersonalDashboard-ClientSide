"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Trash2, Edit } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "meeting" | "personal" | "work" | "other"
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "personal" as Event["type"],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.date || !newEvent.time) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const url = editingEvent
        ? `http://localhost:5000/api/events/${editingEvent.id}`
        : "http://localhost:5000/api/events"

      const response = await fetch(url, {
        method: editingEvent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      })

      if (response.ok) {
        setNewEvent({ title: "", description: "", date: "", time: "", type: "personal" })
        setShowForm(false)
        setEditingEvent(null)
        fetchEvents()
      }
    } catch (error) {
      console.error("Error saving event:", error)
    }
    setLoading(false)
  }

  const deleteEvent = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        fetchEvents()
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const startEdit = (event: Event) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
    })
    setShowForm(true)
  }

  const cancelEdit = () => {
    setEditingEvent(null)
    setNewEvent({ title: "", description: "", date: "", time: "", type: "personal" })
    setShowForm(false)
  }

  const getTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-600/20 text-blue-300 border-blue-500/30"
      case "work":
        return "bg-purple-600/20 text-purple-300 border-purple-500/30"
      case "personal":
        return "bg-green-600/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-600/20 text-gray-300 border-gray-500/30"
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events
    .filter((event) => event.date >= today)
    .sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Calendar & Events</h1>
            <p className="text-slate-300">Manage your schedule and upcoming events</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Add/Edit Event Form */}
        {showForm && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">{editingEvent ? "Edit Event" : "Add New Event"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-300">
                      Event Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-slate-300">
                      Event Type
                    </Label>
                    <select
                      id="type"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event["type"] })}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-blue-400 transition-colors"
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="meeting">Meeting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-slate-300">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-slate-300">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Event description (optional)"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-200"
                  >
                    {loading ? "Saving..." : editingEvent ? "Update Event" : "Add Event"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No upcoming events. Add your first event above!</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                          <span className="text-sm text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                        </div>
                        {event.description && <p className="text-sm text-slate-300 mt-1">{event.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(event)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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