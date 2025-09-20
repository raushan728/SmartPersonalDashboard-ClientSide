"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Default welcome message
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I am your AI assistant. I can help you with your tasks, events, expenses, and also answer general questions. How can I help you?",
        timestamp: new Date(),
      },
    ])
  }, [router])

  useEffect(() => {
    // Keep input focused and prevent scroll jump on new message
    const inputElement = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement | null
    if (inputElement) {
      inputElement.focus()
    }
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: conversationHistory,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setConversationHistory(data.updatedConversationHistory)
      } else {
        throw new Error("Failed to get AI response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, main abhi response nahi de pa raha. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! need new help?",
        timestamp: new Date(),
      },
    ])
    setConversationHistory([])
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
            <p className="text-gray-400">Chat with your intelligent assistant</p>
          </div>
          <Button
            variant="outline"
            onClick={clearChat}
            className="border-slate-600 text-gray-300 hover:bg-red-600 hover:text-white transition-all"
          >
            Clear Chat
          </Button>
        </div>

        {/* Chat Container */}
        <Card className="bg-[#0f172a] border border-slate-700 rounded-xl flex-1 min-h-[600px] flex flex-col shadow-lg">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5 text-blue-400" />
              AI Chat
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a] pb-24">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-slate-700 text-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-purple-400" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="bg-slate-700 text-gray-300 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-700 p-4 sticky bottom-0 bg-[#0f172a] z-10">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 bg-blue-900 border border-blue-700 text-white placeholder-blue-300 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
