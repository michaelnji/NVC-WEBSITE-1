"use client"

import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language-context";
import type { Testimonial } from "@/lib/types";
import type React from "react";
import { useEffect, useState } from "react";
import { AdminItemCard } from "./admin-item-card";
import { AdminItemsListCard } from "./admin-items-list-card";
import { ButtonAdmin } from "./button-admin";
import {
  existingImagesToUrls,
  ImageUploader,
  uploadFiles,
  urlsToExistingImages,
  type ExistingImage,
  type SelectedFile,
} from "./image-uploader";

export function TestimonialsManager() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    title: "",
    description: "",
    position: "",
    photo_url: "",
    rating: 5,
  });
  const [selectedImage, setSelectedImage] = useState<SelectedFile[]>([]);
  const [existingImage, setExistingImage] = useState<ExistingImage[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsFetching(true);
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Start with existing image if not removed
      let photoUrl = existingImagesToUrls(existingImage);

      // Upload new image if selected, using author name as filename
      if (selectedImage.length > 0) {
        const uploaded = await uploadFiles(selectedImage, formData.author_name);
        if (uploaded.length > 0) {
          photoUrl = uploaded[0].url;
        }
      }

      // Fallback to form value if no existing or new image
      if (!photoUrl) {
        photoUrl = formData.photo_url;
      }

      const url = editingId
        ? `/api/testimonials/${editingId}`
        : "/api/testimonials";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photo_url: photoUrl,
          rating: formData.rating,
          order_index: testimonials.length,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setFormData({
        author_name: "",
        title: "",
        description: "",
        position: "",
        photo_url: "",
        rating: 5,
      });
      setSelectedImage([]);
      setExistingImage([]);
      setEditingId(null);
      await fetchTestimonials();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/testimonials/${deleteId}`, { method: "DELETE" });
      await fetchTestimonials();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AdminItemsListCard
        title={t.admin.testimonials.existingTestimonials}
        count={testimonials.length}
        max={999}
        isFetching={isFetching}
        emptyMessage={t.admin.testimonials.noTestimonials}
      >
        {testimonials.map((testimonial) => (
          <AdminItemCard
            key={testimonial.id}
            imageUrl={testimonial.photo_url}
            title={testimonial.author_name}
            description={testimonial.description}
            selected={editingId === testimonial.id}
            onSelect={() => {
              setEditingId(testimonial.id);
              setFormData({
                author_name: testimonial.author_name,
                title: testimonial.title,
                description: testimonial.description,
                position: testimonial.position || "",
                photo_url: testimonial.photo_url || "",
                rating: testimonial.rating,
              });
              setExistingImage(urlsToExistingImages(testimonial.photo_url));
              setSelectedImage([]);
            }}
            onDelete={() => handleDelete(testimonial.id)}
            imageSizeClass="h-16 w-16 mr-3 rounded-full"
            imageClassName="w-full h-full object-cover rounded-full"
          />
        ))}
      </AdminItemsListCard>

      <Card className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="mb-2 text-xs text-muted-foreground">
          {t.admin.testimonials.createOrEditTestimonial}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.admin.testimonials.authorName}</Label>
            <Input
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              placeholder={t.admin.testimonials.authorNamePlaceholder}
              required
            />
          </div>

          <div>
            <Label>{t.admin.testimonials.positionRole}</Label>
            <Input
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder={t.admin.testimonials.positionRolePlaceholder}
            />
          </div>

          <div>
            <Label>{t.admin.testimonials.title}</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t.admin.testimonials.titlePlaceholder}
              required
            />
          </div>

          <div>
            <Label>{t.admin.testimonials.testimonialDescription}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={
                t.admin.testimonials.testimonialDescriptionPlaceholder
              }
              required
            />
          </div>

          <div>
            <Label>{t.admin.testimonials.rating}</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={Number.isNaN(formData.rating) ? "" : formData.rating}
              onChange={(e) => {
                const next = e.target.value;
                const parsed = Number.parseInt(next, 10);
                setFormData({
                  ...formData,
                  // Si la saisie n'est pas un nombre, on retombe sur 1 pour éviter NaN
                  rating: Number.isNaN(parsed) ? 1 : parsed,
                });
              }}
            />
          </div>

          <div>
            <Label>{t.admin.team.photo}</Label>
            <ImageUploader
              value={selectedImage}
              onChange={setSelectedImage}
              existingImages={existingImage}
              onExistingImagesChange={setExistingImage}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <ButtonAdmin type="submit" disabled={isLoading} fullWidth={false}>
              {editingId
                ? t.admin.testimonials.updateTestimonial
                : t.admin.testimonials.addTestimonial}{" "}
              {t.admin.testimonials.testimonial}
            </ButtonAdmin>
            {editingId && (
              <ButtonAdmin
                type="button"
                fullWidth={false}
                className="bg-transparent text-muted-foreground border-transparent hover:bg-muted/30 h-9 px-4"
                onClick={() => {
                  setEditingId(null);
                  setSelectedImage([]);
                  setExistingImage([]);
                  setFormData({
                    author_name: "",
                    title: "",
                    description: "",
                    position: "",
                    photo_url: "",
                    rating: 5,
                  });
                }}
              >
                {t.admin.projects.cancel}
              </ButtonAdmin>
            )}
          </div>
        </form>
      </Card>

      <AdminConfirmModal
        open={deleteId !== null}
        title={t.admin.testimonials.deleteTestimonialTitle}
        message={t.admin.testimonials.deleteTestimonialMessage}
        confirmLabel={t.admin.projects.delete}
        cancelLabel={t.admin.projects.cancel}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
