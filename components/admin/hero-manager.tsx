"use client"

import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
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
import type { HeroImage } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  ImageUploader,
  uploadFiles,
  urlsToExistingImages,
  type ExistingImage,
  type SelectedFile,
} from "./image-uploader";

export function HeroManager() {
  const { t } = useLanguage();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
  });
  const [selectedImages, setSelectedImages] = useState<SelectedFile[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const MAX_TILES = 8;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/hero-images");
      if (!res.ok) {
        console.error("Failed to fetch images: ", res.status);
        setImages([]);
        return;
      }
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setImages([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!editingId && images.length >= MAX_TILES) {
        return;
      }

      // Upload images if new files selected, using 'hero' as filename prefix
      if (selectedImages.length > 0) {
        const uploaded = await uploadFiles(
          selectedImages,
          formData.title || "hero"
        );

        if (editingId) {
          // In edit mode, use the first uploaded image
          const first = uploaded[0];
          if (first) {
            const fileName = first.name.replace(/\.[^/.]+$/, "");
            const payload = {
              ...formData,
              image_url: first.url,
              title: formData.title || fileName,
            };
            await fetch(`/api/hero-images/${editingId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
        } else {
          // In create mode, create multiple hero images
          const remaining = Math.max(0, MAX_TILES - images.length);
          const toCreate = uploaded.slice(0, remaining);
          const payload = toCreate.map((f, i) => ({
            image_url: f.url,
            title: f.name.replace(/\.[^/.]+$/, ""),
            description: "",
            order_index: images.length + i,
          }));
          await fetch("/api/hero-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        setFormData({ image_url: "", title: "", description: "" });
        setSelectedImages([]);
        setEditingId(null);
        await fetchImages();
        return;
      }

      // If no new images selected but editing existing
      if (editingId && formData.image_url) {
        await fetch(`/api/hero-images/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        setFormData({ image_url: "", title: "", description: "" });
        setSelectedImages([]);
        setEditingId(null);
        await fetchImages();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/hero-images/${deleteId}`, { method: "DELETE" });
      await fetchImages();
      if (editingId === deleteId) {
        setEditingId(null);
        setFormData({ image_url: "", title: "", description: "" });
      }
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
          title={t.admin.hero.heroImages}
          count={images.length}
          max={MAX_TILES}
          isFetching={isFetching}
          emptyMessage={t.admin.hero.noHeroImages}
        >
          {images.map((image) => {
            const selected = editingId === image.id;
            return (
              <AdminItemCard
                key={image.id}
                imageSizeClass="h-30 w-50"
                imageUrl={image.image_url}
                title={null}
                description={image.description}
                selected={selected}
                onSelect={() => {
                  setEditingId(image.id);
                  setFormData({
                    image_url: image.image_url,
                    title: image.title || "",
                    description: image.description || "",
                  });
                  setExistingImages(urlsToExistingImages(image.image_url));
                  setSelectedImages([]);
                }}
                onDelete={() => handleDelete(image.id)}
              />
            );
          })}
        </AdminItemsListCard>

        <Card className="p-6">
          <div className="mb-2 text-xs text-muted-foreground">
            {t.admin.hero.maxImagesNote}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <ImageUploader
                multiple
                maxFiles={Math.max(1, MAX_TILES - images.length)}
                value={selectedImages}
                onChange={setSelectedImages}
                existingImages={existingImages}
                onExistingImagesChange={setExistingImages}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="mb-1 block">{t.admin.hero.titleOptional}</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={t.admin.hero.titlePlaceholder}
              />
            </div>

            <div>
              <Label className="mb-1 block">
                {t.admin.hero.descriptionOptional}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t.admin.hero.descriptionPlaceholder}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <ButtonAdmin
                type="submit"
                fullWidth={false}
                className="h-9 px-4"
                disabled={
                  !formData.image_url ||
                  isLoading ||
                  (!editingId && images.length >= MAX_TILES)
                }
              >
                {editingId
                  ? t.admin.hero.update
                  : images.length >= MAX_TILES
                  ? `${t.admin.services.limitReached} (${MAX_TILES})`
                  : t.admin.hero.add}
              </ButtonAdmin>
              {editingId && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white h-9 px-4"
                    onClick={() => handleDelete(editingId)}
                  >
                    {t.admin.projects.delete}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-muted/30 h-9 px-4"
                    onClick={() => {
                      setEditingId(null);
                      setSelectedImages([]);
                      setExistingImages([]);
                      setFormData({
                        image_url: "",
                        title: "",
                        description: "",
                      });
                    }}
                  >
                    {t.admin.projects.cancel}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Card>
      </div>

      <AdminConfirmModal
        open={deleteId !== null}
        title={t.admin.hero.deleteHeroImageTitle}
        message={t.admin.hero.deleteHeroImageMessage}
        confirmLabel={t.admin.projects.delete}
        cancelLabel={t.admin.projects.cancel}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
