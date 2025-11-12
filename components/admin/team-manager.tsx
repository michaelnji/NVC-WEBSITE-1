"use client"

import type React from "react"

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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Team Members</h3>

      <Card className="p-6">
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
              <img
                src={formData.photo_url || "/placeholder.svg"}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-full"
              />
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {editingId ? "Mettre à jour" : "Ajouter"} Membre
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="flex gap-4">
              {member.photo_url && (
                <img
                  src={member.photo_url || "/placeholder.svg"}
                  alt={member.name}
                  className="h-24 w-24 object-cover rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.position}</p>
                <p className="text-sm mt-2">{member.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="border border-border text-foreground hover:bg-muted/30"
                  size="sm"
                  onClick={() => {
                    setEditingId(member.id)
                    setFormData({
                      name: member.name,
                      position: member.position,
                      description: member.description || "",
                      photo_url: member.photo_url || "",
                    })
                  }}
                >
                  Éditer
                </Button>
                <Button
                  variant="secondary"
                  className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
                >
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
