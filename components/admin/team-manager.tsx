"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { useState, useEffect } from "react"
import type { TeamMember } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "./image-uploader"
import { AdminItemsListCard } from "./admin-items-list-card"
import { AdminItemCard } from "./admin-item-card"
import { ButtonAdmin } from "./button-admin"

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    photo_url: "",
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setIsFetching(true)
      const res = await fetch("/api/team-members")
      if (!res.ok) {
        console.error("Failed to fetch members:", res.status)
        setMembers([])
        return
      }
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch members:", error)
      setMembers([])
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingId ? `/api/team-members/${editingId}` : "/api/team-members"

      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order_index: members.length,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      setFormData({ name: "", position: "", description: "", photo_url: "" })
      setEditingId(null)
      await fetchMembers()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/team-members/${id}`, { method: "DELETE" })
        await fetchMembers()
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AdminItemsListCard
        title="Membres existants"
        count={members.length}
        max={999}
        isFetching={isFetching}
        emptyMessage="Aucun membre pour l’instant."
      >
        {members.map((member) => {
          const selected = editingId === member.id
          const combinedDescription = member.description
            ? `${member.position}\n${member.description}`
            : member.position
          return (
            <AdminItemCard
              key={member.id}
              imageUrl={member.photo_url}
              title={member.name}
              description={combinedDescription}
              selected={selected}
              onSelect={() => {
                setEditingId(member.id)
                setFormData({
                  name: member.name,
                  position: member.position,
                  description: member.description || "",
                  photo_url: member.photo_url || "",
                })
              }}
              onDelete={() => handleDelete(member.id)}
            />
          )
        })}
      </AdminItemsListCard>

      <Card className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="mb-2 text-xs text-muted-foreground">
          Créez ou modifiez un membre de l’équipe. Ces membres alimentent la section "Team" du site.
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom du membre"
              required
            />
          </div>

          <div>
            <Label>Poste</Label>
            <Input
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Poste/Titre"
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description optionnelle"
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
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <ButtonAdmin type="submit" disabled={isLoading} fullWidth={false}>
              {editingId ? "Mettre à jour" : "Ajouter"} Membre
            </ButtonAdmin>
            {editingId && (
              <ButtonAdmin
                type="button"
                fullWidth={false}
                className="bg-transparent text-muted-foreground border-transparent hover:bg-muted/30 h-9 px-4"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ name: "", position: "", description: "", photo_url: "" })
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
