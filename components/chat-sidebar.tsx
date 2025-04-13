"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type ChatHistory = {
  id: string
  title: string
  preview: string
  date: Date
}

export function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock chat history data
  const chatHistory: ChatHistory[] = [
    {
      id: "1",
      title: "Tenant Rights Question",
      preview: "What are my rights as a tenant in Delhi?",
      date: new Date(2023, 10, 15),
    },
    {
      id: "2",
      title: "Divorce Procedure",
      preview: "How do I file for divorce in India?",
      date: new Date(2023, 10, 10),
    },
    {
      id: "3",
      title: "Consumer Complaint",
      preview: "How to file a consumer complaint against an e-commerce company?",
      date: new Date(2023, 10, 5),
    },
    {
      id: "4",
      title: "Property Dispute",
      preview: "My neighbor has encroached on my property. What legal actions can I take?",
      date: new Date(2023, 9, 28),
    },
    {
      id: "5",
      title: "Employment Contract",
      preview: "Is my non-compete clause legally enforceable?",
      date: new Date(2023, 9, 20),
    },
  ]

  // Filter chat history based on search query
  const filteredHistory = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r dark:border-slate-700">
        <SidebarHeader className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="text-slate-500 md:hidden">
                  <SidebarTrigger />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New Chat</span>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {filteredHistory.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredHistory.map((chat) => (
                  <Button key={chat.id} variant="ghost" className="w-full justify-start text-left h-auto py-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium truncate">{chat.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{format(chat.date, "MMM d")}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{chat.preview}</p>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">No conversations found</div>
            )}
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="space-y-4">
            <Separator className="dark:bg-slate-700" />
            <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
