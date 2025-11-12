"use client"

import type React from "react"

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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Témoignages</h3>

      <Card className="p-6">
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
              <img
                src={formData.photo_url || "/placeholder.svg"}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-full"
              />
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {editingId ? "Mettre à jour" : "Ajouter"} Témoignage
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-4">
            <div className="flex gap-4">
              {testimonial.photo_url && (
                <img
                  src={testimonial.photo_url || "/placeholder.svg"}
                  alt={testimonial.author_name}
                  className="h-24 w-24 object-cover rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{testimonial.author_name}</p>
                <p className="text-sm text-yellow-500">{"⭐".repeat(testimonial.rating)}</p>
                <p className="font-medium mt-2">{testimonial.title}</p>
                <p className="text-sm text-muted-foreground">{testimonial.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
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
                >
                  Éditer
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
