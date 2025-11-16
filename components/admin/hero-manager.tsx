"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { AdminItemCard } from "./admin-item-card"
import { AdminItemsListCard } from "./admin-items-list-card"
import { ButtonAdmin } from "./button-admin"

import { useState, useEffect } from "react"
import type { HeroImage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "./image-uploader"

export function HeroManager() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
  })
  const MAX_TILES = 8

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setIsFetching(true)
    try {
      const res = await fetch("/api/hero-images")
      if (!res.ok) {
        console.error("Failed to fetch images: ", res.status)
        setImages([])
        return
      }
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch images:", error)
      setImages([])
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!editingId && images.length >= MAX_TILES) {
        return
      }
      const url = editingId ? `/api/hero-images/${editingId}` : "/api/hero-images"

      const method = editingId ? "PUT" : "POST"
      const payload = editingId
        ? { ...formData }
        : { ...formData, order_index: images.length }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to save")

      setFormData({ image_url: "", title: "", description: "" })
      setEditingId(null)
      await fetchImages()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/hero-images/${id}`, { method: "DELETE" })
        await fetchImages()
        if (editingId === id) {
          setEditingId(null)
          setFormData({ image_url: "", title: "", description: "" })
        }
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <AdminItemsListCard
          title="Images Hero"
          count={images.length}
          max={MAX_TILES}
          isFetching={isFetching}
          emptyMessage="Aucune image dans la Hero."
        >
          {images.map((image) => {
            const selected = editingId === image.id
            return (
              <AdminItemCard
                key={image.id}
                imageSizeClass="h-30 w-50"
                imageUrl={image.image_url}
                title={null}
                description={image.description}
                selected={selected}
                onSelect={() => {
                  setEditingId(image.id)
                  setFormData({
                    image_url: image.image_url,
                    title: image.title || "",
                    description: image.description || "",
                  })
                }}
                onDelete={() => handleDelete(image.id)}
              />
            )
          })}
        </AdminItemsListCard>

        <Card className="p-6">
          <div className="mb-2 text-xs text-muted-foreground">
            Maximum {MAX_TILES} images. Les emplacements vides sont remplis par placeholder.svg et remplacés par vos images.
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <ImageUploader
                multiple
                onUploadMeta={(file) => {
                  const fileName = file.name.replace(/\.[^/.]+$/, "")
                  setFormData({
                    ...formData,
                    image_url: file.url,
                    title: formData.title || fileName,
                  })
                }}
                onUploadManyMeta={async (files) => {
                  if (editingId) {
                    // En mode édition, on prend le premier fichier pour l'update via le formulaire
                    const first = files[0]
                    if (first) {
                      const fileName = first.name.replace(/\.[^/.]+$/, "")
                      setFormData({
                        ...formData,
                        image_url: first.url,
                        title: formData.title || fileName,
                      })
                    }
                    return
                  }
                  const remaining = Math.max(0, MAX_TILES - images.length)
                  const toCreate = files.slice(0, remaining)
                  try {
                    const payload = toCreate.map((f, i) => ({
                      image_url: f.url,
                      title: f.name.replace(/\.[^/.]+$/, ""),
                      description: "",
                      order_index: images.length + i,
                    }))
                    await fetch("/api/hero-images", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    })
                  } catch (e) {
                    console.error("Batch upload error", e)
                  }
                  await fetchImages()
                }}
              />
              {formData.image_url && (
                <ImageWithSkeleton
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Preview"
                  wrapperClassName="mt-2 h-32 w-32"
                  className="w-full h-full object-cover rounded"
                  sizes="128px"
                  eager
                  priority
                  unoptimized={(formData.image_url || "").includes(".public.blob.vercel-storage.com")}
                />
              )}
            </div>

            <div>
              <Label className="mb-1 block">Titre</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre optionnel"
              />
            </div>

            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description optionnelle"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <ButtonAdmin
                type="submit"
                fullWidth={false}
                className="h-9 px-4"
                disabled={!formData.image_url || isLoading || (!editingId && images.length >= MAX_TILES)}
              >
                {editingId ? "Mettre à jour" : images.length >= MAX_TILES ? `Limite atteinte (${MAX_TILES})` : "Ajouter"}
              </ButtonAdmin>
              {editingId && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white h-9 px-4"
                    onClick={() => handleDelete(editingId)}
                  >
                    Supprimer
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({ image_url: "", title: "", description: "" })
                    }}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </div>

            
          </form>
        </Card>
      </div>
  )
}
