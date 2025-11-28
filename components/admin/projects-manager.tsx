"use client"
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
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
import {
  existingImagesToUrls,
  ImageUploader,
  uploadFiles,
  urlsToExistingImages,
  type ExistingImage,
  type SelectedFile,
} from "./image-uploader";

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
  const [selectedServiceImage, setSelectedServiceImage] = useState<
    SelectedFile[]
  >([]);
  const [existingServiceImages, setExistingServiceImages] = useState<
    ExistingImage[]
  >([]);
  const [selectedProjectImage, setSelectedProjectImage] = useState<
    SelectedFile[]
  >([]);
  const [existingProjectImages, setExistingProjectImages] = useState<
    ExistingImage[]
  >([]);

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
      // Start with existing images that weren't removed
      const existingUrls = existingImagesToUrls(existingProjectImages);

      // Upload new image(s) if selected, using project title as filename
      let newUploadedUrls = "";
      if (selectedProjectImage.length > 0) {
        const uploaded = await uploadFiles(
          selectedProjectImage,
          projectForm.title
        );
        if (uploaded.length > 0) {
          newUploadedUrls = uploaded.map((u) => u.url).join(",");
        }
      }

      // Combine existing and new URLs
      const allUrls = [existingUrls, newUploadedUrls].filter(Boolean).join(",");
      const imageUrl = allUrls || projectForm.image_url;

      const url = editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          image_url: imageUrl,
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
      setSelectedProjectImage([]);
      setExistingProjectImages([]);
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
    <div className="space-y-8">
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
              <SelectItem
                className="capitalize!"
                key={service.id}
                value={service.id}
              >
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
        {/* Projects Tab (existing) */}
        <TabsContent value="projects">
          <div className="grid grid-cols-1 h-[calc(100vh-290px)] overflow-auto lg:grid-cols-2 gap-4">
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
                      // Load existing images for preview
                      setExistingProjectImages(
                        urlsToExistingImages(project.image_url)
                      );
                      setSelectedProjectImage([]); // Clear any new uploads
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
              <form onSubmit={handleProjectSubmit} className="space-y-8">
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

                <div>
                  <Label className="pb-2">{t.admin.projects.image}</Label>
                  <ImageUploader
                    value={selectedProjectImage}
                    onChange={setSelectedProjectImage}
                    existingImages={existingProjectImages}
                    onExistingImagesChange={setExistingProjectImages}
                    disabled={isLoading}
                    multiple={(() => {
                      const selectedService = services.find(
                        (s) =>
                          s.id === (projectForm.service_id || activeService)
                      );
                      return (
                        selectedService?.title
                          ?.toLowerCase()
                          .includes("photo") ?? false
                      );
                    })()}
                    maxFiles={4}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <ButtonAdmin
                    type="submit"
                    fullWidth={false}
                    disabled={
                      (existingProjectImages.length === 0 &&
                        selectedProjectImage.length === 0 &&
                        !projectForm.image_url) ||
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
                        setSelectedProjectImage([]);
                        setExistingProjectImages([]);
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
