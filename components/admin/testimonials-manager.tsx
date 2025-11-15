"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"

import { useState, useEffect } from "react"
import type { Testimonial } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "./image-uploader"

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      const res = await fetch("/api/testimonials")
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
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
      <Card className="p-4 min-h-[320px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-medium">Témoignages existants</p>
          <span className="text-xs text-muted-foreground">{testimonials.length}</span>
        </div>
        {testimonials.length === 0 ? (
          <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-sm text-muted-foreground">
            Aucun témoignage pour l’instant.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {testimonials.map((testimonial) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => {
                  setEditingId(testimonial.id)
                  setFormData({
                    author_name: testimonial.author_name,
                    title: testimonial.title,
                    description: testimonial.description,
                    photo_url: testimonial.photo_url || "",
                    rating: testimonial.rating,
                  })
                }}
                className={`group relative text-left rounded-lg border p-3 transition-all ${
                  editingId === testimonial.id
                    ? "border-[#F15A25] ring-1 ring-[#F15A25]/30"
                    : "border-border hover:border-[#F15A25] hover:ring-1 hover:ring-[#F15A25]/30"
                }`}
              >
                <div className="flex gap-3">
                  {testimonial.photo_url && (
                    <ImageWithSkeleton
                      src={testimonial.photo_url || "/placeholder.svg"}
                      alt={testimonial.author_name}
                      wrapperClassName="h-16 w-16"
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{testimonial.author_name}</p>
                    <p className="text-xs text-yellow-500">{"⭐".repeat(testimonial.rating)}</p>
                    <p className="text-xs font-medium mt-1 line-clamp-2">{testimonial.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{testimonial.description}</p>
                  </div>
                </div>
                {editingId === testimonial.id && (
                  <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[#F15A25]/30" />
                )}
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
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
                wrapperClassName="mt-2 h-32 w-32"
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {editingId ? "Mettre à jour" : "Ajouter"} Témoignage
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
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
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
