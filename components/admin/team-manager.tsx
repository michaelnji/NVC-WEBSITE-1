"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"

import { useState, useEffect } from "react"
import type { TeamMember } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "./image-uploader"

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      <Card className="p-4 min-h-[320px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-medium">Membres existants</p>
          <span className="text-xs text-muted-foreground">{members.length}</span>
        </div>
        {members.length === 0 ? (
          <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-sm text-muted-foreground">
            Aucun membre pour l’instant.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {members.map((member) => {
              const selected = editingId === member.id
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    setEditingId(member.id)
                    setFormData({
                      name: member.name,
                      position: member.position,
                      description: member.description || "",
                      photo_url: member.photo_url || "",
                    })
                  }}
                  className={`group relative text-left rounded-lg border p-3 transition-all ${
                    selected
                      ? "border-[#F15A25] ring-1 ring-[#F15A25]/30"
                      : "border-border hover:border-[#F15A25] hover:ring-1 hover:ring-[#F15A25]/30"
                  }`}
                >
                  <div className="flex gap-3">
                    {member.photo_url && (
                      <ImageWithSkeleton
                        src={member.photo_url || "/placeholder.svg"}
                        alt={member.name}
                        wrapperClassName="h-16 w-16"
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.position}</p>
                      {member.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{member.description}</p>
                      )}
                    </div>
                  </div>
                  {selected && (
                    <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-[#F15A25]/30" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </Card>

      <Card className="p-6">
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
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {editingId ? "Mettre à jour" : "Ajouter"} Membre
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ name: "", position: "", description: "", photo_url: "" })
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
