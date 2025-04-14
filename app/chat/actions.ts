import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // Required for Groq
});

export async function addMessage(conversationId: string, content: string, role: "user" | "assistant", model: string){
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", session.user.id)
    .single();

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or access denied");
  }

  // Store user message
  const { data: userMessage, error: userMsgErr } = await supabase
    .from("chat_messages")
    .insert({
      conversation_id: conversationId,
      content,
      role,
    })
    .select()
    .single();

  if (userMsgErr) {
    throw new Error(userMsgErr.message);
  }

  if (role === "user") {
    // Fetch previous messages
    const { data: previousMessages } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    const formattedMessages = previousMessages?.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })) ?? [];

    // Call Groq API (LLaMA 3)
    const chatResponse = await openai.chat.completions.create({
      model,
      messages: formattedMessages,
    });
    

    const aiMessage = chatResponse.choices[0].message.content;

    // Store assistant reply
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      content: aiMessage,
      role: "assistant",
    });
  }

  await supabase.from("chat_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath(`/chat`);
  return { success: true };
}
