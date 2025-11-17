"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { useState, useEffect } from "react"
import type { Testimonial } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "./image-uploader"
import { AdminItemsListCard } from "./admin-items-list-card"
import { AdminItemCard } from "./admin-item-card"
import { ButtonAdmin } from "./button-admin"

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    author_name: "",
    title: "",
    description: "",
    photo_url: "",
    rating: 5,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsFetching(true)
      const res = await fetch("/api/testimonials")
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials"

      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: Number.parseInt(String(formData.rating)),
          order_index: testimonials.length,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      setFormData({
        author_name: "",
        title: "",
        description: "",
        photo_url: "",
        rating: 5,
      })
      setEditingId(null)
      await fetchTestimonials()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
        await fetchTestimonials()
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AdminItemsListCard
        title="Témoignages existants"
        count={testimonials.length}
        max={999}
        isFetching={isFetching}
        emptyMessage="Aucun témoignage pour l’instant."
      >
        {testimonials.map((testimonial) => (
          <AdminItemCard
            key={testimonial.id}
            imageUrl={testimonial.photo_url}
            title={testimonial.author_name}
            description={testimonial.description}
            selected={editingId === testimonial.id}
            onSelect={() => {
              setEditingId(testimonial.id)
              setFormData({
                author_name: testimonial.author_name,
                title: testimonial.title,
                description: testimonial.description,
                photo_url: testimonial.photo_url || "",
                rating: testimonial.rating,
              })
            }}
            onDelete={() => handleDelete(testimonial.id)}
            imageSizeClass="h-16 w-16 mr-3 rounded-full"
            imageClassName="w-full h-full object-cover rounded-full"
          />
        ))}
      </AdminItemsListCard>

      <Card className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="mb-2 text-xs text-muted-foreground">
          Créez ou modifiez un témoignage. Ces témoignages alimentent la section "Témoignages" du site.
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nom de l'auteur</Label>
            <Input
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              placeholder="Nom"
              required
            />
          </div>

          <div>
            <Label>Titre</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre du témoignage"
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Contenu du témoignage"
              required
            />
          </div>

          <div>
            <Label>Note (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label>Photo</Label>
            <ImageUploader onUpload={(url) => setFormData({ ...formData, photo_url: url })} />
            {formData.photo_url && (
              <ImageWithSkeleton
                src={formData.photo_url || "/placeholder.svg"}
                alt="Preview"
                wrapperClassName="mt-2 h-32 w-32 rounded-full"
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <ButtonAdmin type="submit" disabled={isLoading} fullWidth={false}>
              {editingId ? "Mettre à jour" : "Ajouter"} Témoignage
            </ButtonAdmin>
            {editingId && (
              <ButtonAdmin
                type="button"
                fullWidth={false}
                className="bg-transparent text-muted-foreground border-transparent hover:bg-muted/30 h-9 px-4"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    author_name: "",
                    title: "",
                    description: "",
                    photo_url: "",
                    rating: 5,
                  })
                }}
              >
                Annuler
              </ButtonAdmin>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
