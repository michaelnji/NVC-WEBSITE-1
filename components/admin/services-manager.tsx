"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { AdminItemCard } from "./admin-item-card"
import { AdminItemsListCard } from "./admin-items-list-card"
import { ButtonAdmin } from "./button-admin"

import { useState, useEffect } from "react"
import type { Service } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "./image-uploader"

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const MAX_SERVICES = 6

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsFetching(true)
      const res = await fetch("/api/services")
      if (!res.ok) {
        console.error("Failed to fetch services:", res.status)
        setServices([])
        return
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : []
      setServices(arr)
    } catch (error) {
      console.error("Failed to fetch services:", error)
      setServices([])
    } finally {
      setIsFetching(false)
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingServiceId && services.length >= MAX_SERVICES) {
      return
    }
    setIsLoading(true)

    try {
      const url = editingServiceId ? `/api/services/${editingServiceId}` : "/api/services"

      const method = editingServiceId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...serviceForm,
          order_index: services.length,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      setServiceForm({ title: "", description: "", image_url: "" })
      setEditingServiceId(null)
      await fetchServices()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/services/${id}`, { method: "DELETE" })
        await fetchServices()
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AdminItemsListCard
        title="Services existants"
        count={services.length}
        max={MAX_SERVICES}
        isFetching={isFetching}
        emptyMessage="Aucun service pour l'instant. Créez votre premier service avec le formulaire à droite."
      >
        {services.map((service) => {
          const selected = editingServiceId === service.id
          return (
            <AdminItemCard
              key={service.id}
              imageUrl={service.image_url}
              title={service.title}
              description={service.description}
              selected={selected}
              onSelect={() => {
                setEditingServiceId(service.id)
                setServiceForm({
                  title: service.title,
                  description: service.description,
                  image_url: service.image_url || "",
                })
              }}
              onDelete={() => handleDeleteService(service.id)}
            />
          )
        })}
      </AdminItemsListCard>

      <Card className="p-6">
        <div className="mb-2 text-xs text-muted-foreground">
          Créez ou modifiez un service. Les services sont utilisés pour lier les projets dans la section portfolio.
          Vous pouvez créer jusqu'à {MAX_SERVICES} services. Si la limite est atteinte, supprimez ou modifiez un service existant.
        </div>
        <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
            <Label className="pb-2">Image/GIF</Label>
            <ImageUploader onUpload={(url) => setServiceForm({ ...serviceForm, image_url: url })} />
            {serviceForm.image_url && (
              <ImageWithSkeleton
                src={serviceForm.image_url || "/placeholder.svg"}
                alt="Preview"
                wrapperClassName="mt-2 h-32 w-32"
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
          <div>
            <Label className="pb-2">Titre</Label>
            <Input
              value={serviceForm.title}
              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
              placeholder="Titre du service"
              required
            />
          </div>

          <div>
            <Label className="pb-2">Description</Label>
            <Textarea
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              placeholder="Description du service"
              required
            />
          </div>

        

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <ButtonAdmin
              type="submit"
              fullWidth={false}
              disabled={
                isLoading ||
                !serviceForm.image_url ||
                (!editingServiceId && services.length >= MAX_SERVICES)
              }
            >
              {editingServiceId
                ? "Mettre à jour Service"
                : services.length >= MAX_SERVICES
                ? `Limite atteinte (${MAX_SERVICES})`
                : "Créer Service"}
            </ButtonAdmin>
            {editingServiceId && (
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                onClick={() => {
                  setEditingServiceId(null)
                  setServiceForm({ title: "", description: "", image_url: "" })
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
