"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function saveDocument(
  userId: string,
  originalName: string,
  filePath: string,
  fileType: string,
  fileSize: number,
  simplifiedContent: string | null = null,
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      original_name: originalName,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      simplified_content: simplifiedContent,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/simplify")
  return data
}

export async function updateDocumentSimplification(documentId: string, simplifiedContent: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  // First verify the document belongs to the user
  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", session.user.id)
    .single()

  if (documentError || !document) {
    throw new Error("Document not found or access denied")
  }

  const { data, error } = await supabase
    .from("documents")
    .update({ simplified_content: simplifiedContent })
    .eq("id", documentId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/simplify")
  return data
}

export async function getUserDocuments() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return []
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    return []
  }

  return data
}

export async function getDocument(documentId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", session.user.id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteDocument(documentId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw new Error("Not authenticated")
  }

  // First verify the document belongs to the user
  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", session.user.id)
    .single()

  if (documentError || !document) {
    throw new Error("Document not found or access denied")
  }

  const { error } = await supabase.from("documents").delete().eq("id", documentId)

  if (error) {
    throw new Error(error.message)
  }

  // Also delete the file from storage
  if (document.file_path) {
    const { error: storageError } = await supabase.storage.from("documents").remove([document.file_path])

    if (storageError) {
      console.error("Error deleting file from storage:", storageError)
    }
  }

  revalidatePath("/simplify")
}
