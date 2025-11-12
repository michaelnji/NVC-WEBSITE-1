"use client"

import type React from "react"
import { useRef, useState } from "react"

interface FileMeta {
  url: string
  name: string
  size: number
  type: string
}

interface ImageUploaderProps {
  onUpload?: (url: string) => void
  onUploadMany?: (urls: string[]) => void
  onUploadMeta?: (file: FileMeta) => void
  onUploadManyMeta?: (files: FileMeta[]) => void
  isLoading?: boolean
  multiple?: boolean
}

export function ImageUploader({
  onUpload,
  onUploadMany,
  onUploadMeta,
  onUploadManyMeta,
  isLoading = false,
  multiple = false,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const uploadOne = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/upload", { method: "POST", body: formData })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Upload failed")
    }
    const data = await response.json()
    const url = data.url as string
    const meta: FileMeta = { url, name: file.name, size: file.size, type: file.type }
    return meta
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError(null)
    try {
      if (multiple && files.length > 1) {
        const metas: FileMeta[] = []
        for (const f of files) {
          const meta = await uploadOne(f)
          metas.push(meta)
        }
        if (onUploadManyMeta) onUploadManyMeta(metas)
        else if (onUploadMany) onUploadMany(metas.map((m) => m.url))
      } else {
        const meta = await uploadOne(files[0])
        if (onUploadMeta) onUploadMeta(meta)
        else if (onUpload) onUpload(meta.url)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      console.error("[v0] Upload error:", errorMessage)
      setError(errorMessage)
    } finally {
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.gif"
        multiple={multiple}
        onChange={handleUpload}
        disabled={isLoading}
        className="block w-full cursor-pointer text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#F15A25] file:px-3 file:py-2 file:font-medium file:text-white hover:file:bg-[#F15A25]/90 file:cursor-pointer"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
