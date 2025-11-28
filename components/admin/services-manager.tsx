"use client"

import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
import ImageWithSkeleton from "@/components/image-with-skeleton";
import { useLanguage } from "@/contexts/language-context";
import type React from "react";
import { AdminItemCard } from "./admin-item-card";
import { AdminItemsListCard } from "./admin-items-list-card";
import { ButtonAdmin } from "./button-admin";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Service } from "@/lib/types";
import { toastStyles } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImageUploader } from "./image-uploader";

export function ServicesManager() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const MAX_SERVICES = 6;

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsFetching(true);
      const res = await fetch("/api/services");
      if (!res.ok) {
        console.error("Failed to fetch services:", res.status);
        setServices([]);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setServices(arr);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setServices([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId && services.length >= MAX_SERVICES) {
      return;
    }
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

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.error(
            errorData.error || "A service with this name already exists",
            { style: toastStyles() }
          );
        } else {
          throw new Error("Failed to save");
        }
        return;
      }

      toast.success(
        editingServiceId
          ? "Service updated successfully"
          : "Service created successfully",
        { style: toastStyles() }
      );

      setServiceForm({ title: "", description: "", image_url: "" });
      setEditingServiceId(null);
      await fetchServices();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving the service", {
        style: toastStyles(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/services/${deleteId}`, { method: "DELETE" });
      await fetchServices();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminItemsListCard
          title={t.admin.services.existingServices}
          count={services.length}
          max={MAX_SERVICES}
          gridClassName="grid gap-4"
          isFetching={isFetching}
          emptyMessage={t.admin.services.noServices}
        >
          {services.map((service) => {
            const selected = editingServiceId === service.id;
            return (
              <AdminItemCard
                key={service.id}
                imageUrl={service.image_url}
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
                onDelete={() => handleDeleteService(service.id)}
              />
            );
          })}
        </AdminItemsListCard>

        <Card className="p-6">
          <div className="mb-2 text-xs text-muted-foreground">
            {t.admin.services.createOrEditService}
          </div>
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
              <Label className="pb-2">{t.admin.services.imageGif}</Label>
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
              <Label className="pb-2">{t.admin.services.title}</Label>
              <Input
                value={serviceForm.title}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, title: e.target.value })
                }
                placeholder={t.admin.services.titlePlaceholder}
                required
              />
            </div>

            <div>
              <Label className="pb-2">{t.admin.projects.description}</Label>
              <Textarea
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    description: e.target.value,
                  })
                }
                placeholder={t.admin.services.descriptionPlaceholder}
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
                  ? t.admin.services.updateService
                  : services.length >= MAX_SERVICES
                  ? `${t.admin.services.limitReached} (${MAX_SERVICES})`
                  : t.admin.services.createService}
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
                  {t.admin.projects.cancel}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      <AdminConfirmModal
        open={deleteId !== null}
        title={t.admin.services.deleteServiceTitle}
        message={t.admin.services.deleteServiceMessage}
        confirmLabel={t.admin.projects.delete}
        cancelLabel={t.admin.projects.cancel}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
