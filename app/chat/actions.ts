"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createConversation(title: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({
      user_id: session.user.id,
      title,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Add initial assistant message
  await supabase.from("chat_messages").insert({
    conversation_id: data.id,
    content: "Hello! I'm your AI legal assistant. How can I help you with your legal questions today?",
    role: "assistant",
  })

  revalidatePath("/chat")
  return data
}

export async function getConversations() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return []
  }

  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    return []
  }

  return data
}

export async function getMessages(conversationId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return []
  }

  // First verify the conversation belongs to the user
  const { data: conversation, error: conversationError } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", session.user.id)
    .single()

  if (conversationError || !conversation) {
    console.error("Error fetching conversation:", conversationError)
    return []
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return data
}

export async function addMessage(conversationId: string, content: string, role: "user" | "assistant") {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  // First verify the conversation belongs to the user
  const { data: conversation, error: conversationError } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", session.user.id)
    .single()

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or access denied")
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: conversationId,
      content,
      role,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Update conversation's updated_at
  await supabase.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

  revalidatePath(`/chat`)
  return data
}

export async function deleteConversation(conversationId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  // First verify the conversation belongs to the user
  const { data: conversation, error: conversationError } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", session.user.id)
    .single()

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or access denied")
  }

  const { error } = await supabase.from("chat_conversations").delete().eq("id", conversationId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/chat")
}
