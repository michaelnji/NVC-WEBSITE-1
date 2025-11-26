"use client"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
import ImageWithSkeleton from "@/components/image-with-skeleton";
import { useLanguage } from "@/contexts/language-context";
import { AdminItemCard } from "./admin-item-card";
import { AdminItemsListCard } from "./admin-items-list-card";
import { ButtonAdmin } from "./button-admin";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Project, Service } from "@/lib/types";
import { useEffect, useState } from "react";
import { ImageUploader } from "./image-uploader";

export function ProjectsManager() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"categories" | "projects">("projects");
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeService, setActiveService] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [isFetchingServices, setIsFetchingServices] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image_url: "",
    service_id: "",
    theme: "",
  });
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [isCreatingNewTheme, setIsCreatingNewTheme] = useState(false);
  // Category (Service) form state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (activeService === "ALL") {
      // Fetch all projects for all services
      fetchAllProjects();
    } else if (activeService) {
      fetchProjects(activeService);
    } else {
      setProjects([]);
    }
  }, [activeService]);

  // Fetch all projects for all services
  const fetchAllProjects = async () => {
    setIsFetchingProjects(true);
    try {
      const res = await fetch(`/api/projects`);
      if (!res.ok) {
        console.error("Failed to fetch all projects:", res.status);
        setProjects([]);
        return;
      }
      const data = await res.json();
      const projectsData = Array.isArray(data) ? data : [];
      setProjects(projectsData);
      // Extract unique themes from all projects
      extractThemes(projectsData);
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
      setProjects([]);
    } finally {
      setIsFetchingProjects(false);
    }
  };

  // Extract unique themes from projects
  const extractThemes = (projectsList: Project[]) => {
    const themes = projectsList
      .map((p) => p.theme)
      .filter((theme): theme is string => !!theme && theme.trim() !== "");
    const uniqueThemes = Array.from(new Set(themes));
    setAvailableThemes(uniqueThemes);
  };

  const fetchServices = async () => {
    setIsFetchingServices(true);
    try {
      const res = await fetch("/api/services");
      if (!res.ok) {
        console.error("Failed to fetch services:", res.status);
        setServices([]);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setServices(arr);
      if (arr.length > 0 && !activeService) {
        setActiveService(arr[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setServices([]);
    } finally {
      setIsFetchingServices(false);
    }
  };

  const fetchProjects = async (serviceId: string) => {
    setIsFetchingProjects(true);
    try {
      const res = await fetch(`/api/projects?service_id=${serviceId}`);
      if (!res.ok) {
        console.error("Failed to fetch projects:", res.status);
        setProjects([]);
        return;
      }
      const data = await res.json();
      const projectsData = Array.isArray(data) ? data : [];
      setProjects(projectsData);
      // Extract unique themes from filtered projects
      extractThemes(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setIsFetchingProjects(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = projectForm.service_id || activeService;
    if (!serviceId) return;
    setIsLoading(true);
    try {
      const url = editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          service_id: serviceId,
          theme: projectForm.theme || null,
          order_index: projects.length,
        }),
      });
      if (!response.ok) throw new Error("Failed to save");
      setProjectForm({
        title: "",
        description: "",
        image_url: "",
        service_id: "",
        theme: "",
      });
      setEditingProjectId(null);
      setIsCreatingNewTheme(false);
      await fetchProjects(serviceId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
      if (activeService) {
        await fetchProjects(activeService);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteId(null);
    }
  };

  if (isFetchingServices) {
    return (
      <div className="min-h-[260px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p>{t.admin.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service filter select */}
      <div className="mb-4 max-w-xs">
        <Label className="pb-2">{t.admin.projects.filterByService}</Label>
        <Select value={activeService} onValueChange={setActiveService}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t.admin.projects.allServices} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t.admin.projects.allServices}</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "categories" | "projects")}
      >
        {/* <TabsList className="mb-4 flex flex-wrap gap-2 rounded-md bg-muted/40 p-1.5 border border-border/60">
          <TabsTrigger
            value="categories"
            className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-transparent data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-white text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Catégories
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-transparent data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-white text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Projets
          </TabsTrigger>
        </TabsList> */}

        {/* Categories Tab */}
        {/* <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AdminItemsListCard
              title="Catégories (Services)"
              count={services.length}
              max={services.length || 0}
              isFetching={isFetchingServices}
              emptyMessage="Aucune catégorie pour l’instant."
            >
              {services.map((service) => {
                const selected = editingServiceId === service.id;
                return (
                  <AdminItemCard
                    key={service.id}
                    imageUrl={service.image_url || undefined}
                    title={service.title}
                    description={service.description}
                    selected={selected}
                    onSelect={() => {
                      setEditingServiceId(service.id);
                      setServiceForm({
                        title: service.title,
                        description: service.description,
                        image_url: service.image_url || "",
                      });
                    }}
                    onDelete={() => setDeleteServiceId(service.id)}
                  />
                );
              })}
            </AdminItemsListCard>

            <Card className="p-6">
              <div className="mb-2 text-xs text-muted-foreground">
                Créez ou modifiez une catégorie (service). Les catégories sont
                utilisées pour organiser les projets.
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  try {
                    const url = editingServiceId
                      ? `/api/services/${editingServiceId}`
                      : "/api/services";
                    const method = editingServiceId ? "PUT" : "POST";
                    const response = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...serviceForm,
                        order_index: services.length,
                      }),
                    });
                    if (!response.ok) throw new Error("Failed to save");
                    setServiceForm({
                      title: "",
                      description: "",
                      image_url: "",
                    });
                    setEditingServiceId(null);
                    await fetchServices();
                  } catch (error) {
                    console.error("Error:", error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label className="pb-2">Image</Label>
                  <ImageUploader
                    onUpload={(url) =>
                      setServiceForm({ ...serviceForm, image_url: url })
                    }
                  />
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
                  <Label className="pb-2">Titre de la Catégorie</Label>
                  <Input
                    value={serviceForm.title}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, title: e.target.value })
                    }
                    placeholder="Titre de la catégorie"
                    required
                  />
                </div>

                <div>
                  <Label className="pb-2">Description</Label>
                  <Textarea
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description de la catégorie"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <ButtonAdmin
                    type="submit"
                    fullWidth={false}
                    disabled={
                      !serviceForm.title ||
                      !serviceForm.description ||
                      isLoading
                    }
                  >
                    {editingServiceId
                      ? "Mettre à jour Catégorie"
                      : "Ajouter Catégorie"}
                  </ButtonAdmin>
                  {editingServiceId && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceForm({
                          title: "",
                          description: "",
                          image_url: "",
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
          <AdminConfirmModal
            open={deleteServiceId !== null}
            title="Supprimer cette catégorie ?"
            message="Cette action est irréversible. La catégorie sera définitivement supprimée."
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            onCancel={() => setDeleteServiceId(null)}
            onConfirm={async () => {
              if (!deleteServiceId) return;
              try {
                await fetch(`/api/services/${deleteServiceId}`, {
                  method: "DELETE",
                });
                await fetchServices();
              } catch (error) {
                console.error("Delete failed:", error);
              } finally {
                setDeleteServiceId(null);
              }
            }}
          />
        </TabsContent> */}

        {/* Projects Tab (existing) */}
        <TabsContent value="projects">
          <div className="grid grid-cols-1 h-[calc(100vh-250px)] overflow-auto lg:grid-cols-2 gap-4">
            <AdminItemsListCard
              title={
                activeService === "ALL"
                  ? t.admin.projects.allProjects
                  : t.admin.projects.selectedServiceProjects
              }
              count={projects.length}
              max={projects.length || 0}
              isFetching={isFetchingProjects}
              gridClassName="grid gap-4"
              emptyMessage={
                activeService === "ALL"
                  ? t.admin.projects.noProjects
                  : t.admin.projects.noProjectsForService
              }
            >
              {projects.map((project) => {
                const selected = editingProjectId === project.id;
                return (
                  <AdminItemCard
                    key={project.id}
                    imageUrl={project.image_url}
                    title={project.title}
                    description={project.description}
                    selected={selected}
                    onSelect={() => {
                      setEditingProjectId(project.id);
                      setProjectForm({
                        title: project.title,
                        description: project.description,
                        image_url: project.image_url,
                        service_id: project.service_id || activeService || "",
                        theme: project.theme || "",
                      });
                      setIsCreatingNewTheme(false);
                    }}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                );
              })}
            </AdminItemsListCard>

            <Card className="p-6 overflow-auto">
              <div className="mb-2 text-xs text-muted-foreground">
                {t.admin.projects.createOrEditProject}
              </div>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <Label className="pb-2">
                    {t.admin.projects.projectCategory}
                  </Label>
                  <Select
                    value={projectForm.service_id || activeService}
                    onValueChange={(v) =>
                      setProjectForm({ ...projectForm, service_id: v })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t.admin.projects.selectCategory}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme selector - only for photography service */}
                {(() => {
                  const selectedService = services.find(
                    (s) => s.id === (projectForm.service_id || activeService)
                  );
                  const isPhotography = selectedService?.title
                    ?.toLowerCase()
                    .includes("photo");

                  if (!isPhotography) return null;

                  return (
                    <div className="space-y-3">
                      <Label className="pb-2">
                        {t.admin.projects.theme || "Theme"}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={
                            isCreatingNewTheme ? "new" : projectForm.theme || ""
                          }
                          onValueChange={(v) => {
                            if (v === "new") {
                              setIsCreatingNewTheme(true);
                              setProjectForm({ ...projectForm, theme: "" });
                            } else {
                              setIsCreatingNewTheme(false);
                              setProjectForm({ ...projectForm, theme: v });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                t.admin.projects.selectTheme ||
                                "Select or create theme"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableThemes.map((theme) => (
                              <SelectItem key={theme} value={theme}>
                                {theme}
                              </SelectItem>
                            ))}
                            <SelectItem value="new">
                              {t.admin.projects.createNewTheme ||
                                "+ Create new theme"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {isCreatingNewTheme && (
                        <div className="space-y-2">
                          <Input
                            value={projectForm.theme}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                theme: e.target.value,
                              })
                            }
                            placeholder={
                              t.admin.projects.newThemePlaceholder ||
                              "Enter new theme name"
                            }
                            className="w-full"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setIsCreatingNewTheme(false);
                              setProjectForm({ ...projectForm, theme: "" });
                            }}
                          >
                            {t.admin.projects.cancel || "Cancel"}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div>
                  <Label className="pb-2">{t.admin.projects.image}</Label>
                  <ImageUploader
                    onUpload={(url) =>
                      setProjectForm({ ...projectForm, image_url: url })
                    }
                  />
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
                  <Label className="pb-2">
                    {t.admin.projects.projectTitle}
                  </Label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    placeholder={t.admin.projects.projectTitlePlaceholder}
                    required
                  />
                </div>

                <div>
                  <Label className="pb-2">{t.admin.projects.description}</Label>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                    placeholder={t.admin.projects.projectDescriptionPlaceholder}
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <ButtonAdmin
                    type="submit"
                    fullWidth={false}
                    disabled={
                      !projectForm.image_url ||
                      !projectForm.service_id ||
                      isLoading
                    }
                  >
                    {editingProjectId
                      ? t.admin.projects.updateProject
                      : t.admin.projects.addProject}
                  </ButtonAdmin>
                  {editingProjectId && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({
                          title: "",
                          description: "",
                          image_url: "",
                          service_id: "",
                          theme: "",
                        });
                        setIsCreatingNewTheme(false);
                      }}
                    >
                      {t.admin.projects.cancel}
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
          <AdminConfirmModal
            open={deleteId !== null}
            title={t.admin.projects.deleteProjectTitle}
            message={t.admin.projects.deleteProjectMessage}
            confirmLabel={t.admin.projects.delete}
            cancelLabel={t.admin.projects.cancel}
            onCancel={() => setDeleteId(null)}
            onConfirm={handleConfirmDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
