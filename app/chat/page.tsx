"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send } from "lucide-react"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatSidebar } from "@/components/chat-sidebar"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI legal assistant. How can I help you with your legal questions today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock response based on user input
      let responseContent = ""

      if (input.toLowerCase().includes("divorce")) {
        responseContent =
          "## Divorce in India\n\nDivorce in India is governed by various personal laws depending on your religion:\n\n1. **Hindu Marriage Act, 1955** - For Hindus, Buddhists, Jains, and Sikhs\n2. **Muslim Personal Law** - For Muslims\n3. **Indian Divorce Act, 1869** - For Christians\n4. **Special Marriage Act, 1954** - For inter-religious marriages\n\nThe general grounds for divorce include:\n- Cruelty (mental or physical)\n- Desertion for at least 2 years\n- Conversion to another religion\n- Mental disorder\n- Communicable disease\n- Presumption of death\n- Mutual consent\n\nWould you like more specific information about divorce procedures under any particular law?"
      } else if (input.toLowerCase().includes("tenant") || input.toLowerCase().includes("rent")) {
        responseContent =
          "## Tenant Rights in India\n\nAs a tenant in India, you have several rights protected by law:\n\n1. **Right to a proper rental agreement**\n2. **Protection against arbitrary eviction**\n3. **Right to essential services** like water and electricity\n4. **Right to privacy** - landlord cannot enter without notice\n5. **Right to receipt** for rent payment\n\nRent control laws vary by state, but most states have regulations on:\n- Rent increases\n- Security deposit limits\n- Eviction procedures\n\nDo you have a specific tenant rights issue you'd like to discuss?"
      } else {
        responseContent =
          "Thank you for your question. Legal matters can be complex, and I'd be happy to provide some general information.\n\nHowever, please note that this is general guidance and not specific legal advice. Each case is unique, and laws can vary by state in India.\n\nCould you provide more details about your situation so I can give you more relevant information?"
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-teal-600 text-white dark:bg-teal-700"
                          : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <div
                        className={`text-xs mt-1 ${
                          message.role === "user" ? "text-teal-100" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {format(message.timestamp, "h:mm a")}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-100 dark:bg-slate-800">
                      <div className="flex space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="border-t bg-white dark:bg-slate-900 dark:border-slate-700 p-4">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your legal question..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center max-w-3xl mx-auto">
            This AI assistant provides general legal information, not specific legal advice. For personalized advice,
            please consult a qualified legal professional.
          </p>
        </div>
      </div>
    </div>
  )
}
