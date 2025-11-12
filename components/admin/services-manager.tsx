"use client"

import type React from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"

import { useState, useEffect } from "react"
import type { Service, Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUploader } from "./image-uploader"

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeService, setActiveService] = useState<string>("")
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    image_url: "",
  })

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
    }
  }, [activeService])

  const fetchServices = async () => {
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
    }
  }

  const fetchProjects = async (serviceId: string) => {
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
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const handleDeleteService = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/services/${id}`, { method: "DELETE" })
        await fetchServices()
        if (activeService === id) {
          setActiveService(services[0]?.id || "")
        }
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        await fetch(`/api/projects/${id}`, { method: "DELETE" })
        await fetchProjects(activeService)
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeService} onValueChange={setActiveService}>
        <TabsList className="mb-6">
          {services.map((service) => (
            <TabsTrigger key={service.id} value={service.id}>
              {service.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ajouter/Modifier Service</h3>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="Titre du service"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Description du service"
                  required
                />
              </div>

              <div>
                <Label>Image/GIF</Label>
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

              <Button type="submit" disabled={isLoading}>
                {editingServiceId ? "Mettre à jour" : "Créer"} Service
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Projets du Service</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4 mb-6">
              <div>
                <Label>Titre du Projet</Label>
                <Input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Titre du projet"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Description du projet"
                  required
                />
              </div>

              <div>
                <Label>Image</Label>
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

              <Button type="submit" disabled={!projectForm.image_url || isLoading}>
                {editingProjectId ? "Mettre à jour" : "Ajouter"} Projet
              </Button>
            </form>

            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="p-4">
                  <div className="flex gap-4">
                    <ImageWithSkeleton
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      wrapperClassName="h-24 w-24"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="border border-border text-foreground hover:bg-muted/30"
                        size="sm"
                        onClick={() => {
                          setEditingProjectId(project.id)
                          setProjectForm({
                            title: project.title,
                            description: project.description,
                            image_url: project.image_url,
                          })
                        }}
                      >
                        Éditer
                      </Button>
                      <Button
                        variant="secondary"
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}
