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
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    author_name: "",
    title: "",
    description: "",
    position: "",
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
          // rating est déjà un nombre contrôlé, inutile de le reconvertir ici
          rating: formData.rating,
          order_index: testimonials.length,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      setFormData({
        author_name: "",
        title: "",
        description: "",
        position: "",
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

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/testimonials/${deleteId}`, { method: "DELETE" })
      await fetchTestimonials()
    } catch (error) {
      console.error("Delete failed:", error)
    } finally {
      setDeleteId(null)
      setShowDeleteModal(false)
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
                position: testimonial.position || "",
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
            <Label>Poste / Rôle</Label>
            <Input
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Ex: CEO, Directrice Marketing…"
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
              value={Number.isNaN(formData.rating) ? "" : formData.rating}
              onChange={(e) => {
                const next = e.target.value
                const parsed = Number.parseInt(next, 10)
                setFormData({
                  ...formData,
                  // Si la saisie n'est pas un nombre, on retombe sur 1 pour éviter NaN
                  rating: Number.isNaN(parsed) ? 1 : parsed,
                })
              }}
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
                    position: "",
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

      <AdminConfirmModal
        open={deleteId !== null}
        title="Supprimer ce témoignage ?"
        message="Cette action est irréversible. Le témoignage sera définitivement supprimé."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
