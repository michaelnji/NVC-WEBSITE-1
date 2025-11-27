"use client"

import { useLanguage } from "@/contexts/language-context";
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
  const [progress, setProgress] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { t } = useLanguage();

  const uploadOne = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/upload", { method: "POST", body: formData })
    if (!response.ok) {
      let message = t.common.upload.uploadFailed;
      try {
        const raw = await response.text()
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            message = parsed?.error || message
          } catch {
            message = raw
          }
        }
      } catch {
        // ignore and keep default message
      }
      throw new Error(message)
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
    setProgress(null)
    setIsUploading(true)
    try {
      if (multiple && files.length > 1) {
        const metas: FileMeta[] = []
        const CONCURRENCY = 3
        let index = 0
        let completed = 0
        const total = files.length

        const next = async () => {
          const i = index++
          if (i >= total) return
          try {
            const meta = await uploadOne(files[i])
            metas[i] = meta
          } catch (err) {
            metas[i] = { url: "", name: files[i].name, size: files[i].size, type: files[i].type }
          } finally {
            completed++
            setProgress(`${completed}/${total}`)
            await next()
          }
        }

        const workers = Array.from({ length: Math.min(CONCURRENCY, total) }, () => next())
        await Promise.all(workers)

        const filtered = metas.filter((m) => m && m.url)
        if (onUploadManyMeta) onUploadManyMeta(filtered)
        else if (onUploadMany) onUploadMany(filtered.map((m) => m.url))
      } else {
        const meta = await uploadOne(files[0])
        if (onUploadMeta) onUploadMeta(meta)
        else if (onUpload) onUpload(meta.url)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t.common.upload.uploadFailed;
      console.error(" Upload error:", errorMessage)
      setError(errorMessage)
    } finally {
      setProgress(null)
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.gif"
        multiple={multiple}
        onChange={handleUpload}
        disabled={isLoading}
        className="sr-only"
      />

      <button
        type="button"
        disabled={isLoading || isUploading}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md border border-[#F15A25] bg-[#F15A25] px-3 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {(isLoading || isUploading) && (
          <span className="inline-flex h-3 w-3 items-center justify-center">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
          </span>
        )}
        {isLoading || isUploading
          ? progress
            ? `${t.common.upload.uploadInProgress} (${progress})`
            : `${t.common.upload.uploadInProgress}...`
          : multiple
          ? t.common.upload.chooseImages
          : t.common.upload.chooseImage}
      </button>

      <p className="text-[11px] text-muted-foreground">
        Formats acceptés : JPG, PNG, GIF. Taille raisonnable recommandée pour de
        bonnes performances.
      </p>

      {progress && (
        <p className="text-[11px] text-muted-foreground">
          Téléversement : {progress}
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
