"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { AdminItemCard } from "./admin-item-card"
import { AdminItemsListCard } from "./admin-items-list-card"
import { ButtonAdmin } from "./button-admin"

import { useState, useEffect } from "react"
import type { Service, Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUploader } from "./image-uploader"

export function ProjectsManager() {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeService, setActiveService] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingProjects, setIsFetchingProjects] = useState(true)
  const [isFetchingServices, setIsFetchingServices] = useState(true)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (activeService) {
      fetchProjects(activeService)
    } else {
      setProjects([])
    }
  }, [activeService])

  const fetchServices = async () => {
    setIsFetchingServices(true)
    try {
      const res = await fetch("/api/services")
      if (!res.ok) {
        console.error("Failed to fetch services:", res.status)
        setServices([])
        return
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : []
      setServices(arr)
      if (arr.length > 0 && !activeService) {
        setActiveService(arr[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
      setServices([])
    } finally {
      setIsFetchingServices(false)
    }
  }

  const fetchProjects = async (serviceId: string) => {
    setIsFetchingProjects(true)
    try {
      const res = await fetch(`/api/projects?service_id=${serviceId}`)
      if (!res.ok) {
        console.error("Failed to fetch projects:", res.status)
        setProjects([])
        return
      }
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      setProjects([])
    } finally {
      setIsFetchingProjects(false)
    }
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeService) return
    setIsLoading(true)
    try {
      const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects"
      const method = editingProjectId ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          service_id: activeService,
          order_index: projects.length,
        }),
      })
      if (!response.ok) throw new Error("Failed to save")
      setProjectForm({ title: "", description: "", image_url: "" })
      setEditingProjectId(null)
      await fetchProjects(activeService)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/projects/${id}`, { method: "DELETE" })
        if (activeService) {
          await fetchProjects(activeService)
        }
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  if (isFetchingServices) {
    return (
      <div className="min-h-[260px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F15A25] border-t-transparent" />
          <p>Chargement des services…</p>
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Aucun service n'est encore créé. Créez d'abord un service dans la section "Services" pour pouvoir gérer ses projets.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeService} onValueChange={setActiveService}>
        <TabsList className="mb-4 flex flex-wrap">
          {services.map((service) => (
            <TabsTrigger key={service.id} value={service.id} className="text-xs sm:text-sm">
              {service.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminItemsListCard
            title="Projets du service sélectionné"
            count={projects.length}
            max={projects.length || 0}
            isFetching={isFetchingProjects}
            emptyMessage="Aucun projet pour ce service pour l’instant."
          >
            {projects.map((project) => {
              const selected = editingProjectId === project.id
              return (
                <AdminItemCard
                  key={project.id}
                  imageUrl={project.image_url}
                  title={project.title}
                  description={project.description}
                  selected={selected}
                  onSelect={() => {
                    setEditingProjectId(project.id)
                    setProjectForm({
                      title: project.title,
                      description: project.description,
                      image_url: project.image_url,
                    })
                  }}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              )
            })}
          </AdminItemsListCard>

          <Card className="p-6">
            <div className="mb-2 text-xs text-muted-foreground">
              Créez ou modifiez un projet pour le service sélectionné. Les projets apparaissent dans la section portfolio.
            </div>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <Label className="pb-2">Image</Label>
                <ImageUploader onUpload={(url) => setProjectForm({ ...projectForm, image_url: url })} />
                {projectForm.image_url && (
                  <ImageWithSkeleton
                    src={projectForm.image_url || "/placeholder.svg"}
                    alt="Preview"
                    wrapperClassName="mt-2 h-32 w-32"
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>

              <div>
                <Label className="pb-2">Titre du Projet</Label>
                <Input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Titre du projet"
                  required
                />
              </div>

              <div>
                <Label className="pb-2">Description</Label>
                <Textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Description du projet"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <ButtonAdmin
                  type="submit"
                  fullWidth={false}
                  disabled={!projectForm.image_url || isLoading}
                >
                  {editingProjectId ? "Mettre à jour Projet" : "Ajouter Projet"}
                </ButtonAdmin>
                {editingProjectId && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                    onClick={() => {
                      setEditingProjectId(null)
                      setProjectForm({ title: "", description: "", image_url: "" })
                    }}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}
