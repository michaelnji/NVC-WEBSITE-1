"use client"

import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language-context";
import type { TeamMember } from "@/lib/types";
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

export function TeamManager() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    photo_url: "",
  });
  const [selectedImage, setSelectedImage] = useState<SelectedFile[]>([]);
  const [existingImage, setExistingImage] = useState<ExistingImage[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsFetching(true);
      const res = await fetch("/api/team-members", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch members:", res.status);
        setMembers([]);
        return;
      }
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setMembers([]);
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

      // Upload new image if selected, using member name as filename
      if (selectedImage.length > 0) {
        const uploaded = await uploadFiles(selectedImage, formData.name);
        if (uploaded.length > 0) {
          photoUrl = uploaded[0].url;
        }
      }

      // Fallback to form value if no existing or new image
      if (!photoUrl) {
        photoUrl = formData.photo_url;
      }

      const url = editingId
        ? `/api/team-members/${editingId}`
        : "/api/team-members";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photo_url: photoUrl,
          order_index: members.length,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setFormData({ name: "", position: "", description: "", photo_url: "" });
      setSelectedImage([]);
      setExistingImage([]);
      setEditingId(null);
      await fetchMembers();
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
      await fetch(`/api/team-members/${deleteId}`, { method: "DELETE" });
      await fetchMembers();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AdminItemsListCard
        title={t.admin.team.existingMembers}
        count={members.length}
        max={999}
        isFetching={isFetching}
        emptyMessage={t.admin.team.noMembers}
      >
        {members.map((member) => {
          const selected = editingId === member.id;
          const combinedDescription = member.description
            ? `${member.position}\n${member.description}`
            : member.position;
          return (
            <AdminItemCard
              key={member.id}
              imageUrl={member.photo_url}
              title={member.name}
              description={combinedDescription}
              selected={selected}
              onSelect={() => {
                setEditingId(member.id);
                setFormData({
                  name: member.name,
                  position: member.position,
                  description: member.description || "",
                  photo_url: member.photo_url || "",
                });
                setExistingImage(urlsToExistingImages(member.photo_url));
                setSelectedImage([]);
              }}
              onDelete={() => handleDelete(member.id)}
            />
          );
        })}
      </AdminItemsListCard>

      <Card className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="mb-2 text-xs text-muted-foreground">
          {t.admin.team.createOrEditMember}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.admin.team.name}</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t.admin.team.namePlaceholder}
              required
            />
          </div>

          <div>
            <Label>{t.admin.team.position}</Label>
            <Input
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder={t.admin.team.positionPlaceholder}
              required
            />
          </div>

          <div>
            <Label>{t.admin.projects.description}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t.admin.team.descriptionOptional}
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
              {editingId ? t.admin.team.updateMember : t.admin.team.addMember}{" "}
              {t.admin.team.member}
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
                    name: "",
                    position: "",
                    description: "",
                    photo_url: "",
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
        title={t.admin.team.deleteMemberTitle}
        message={t.admin.team.deleteMemberMessage}
        confirmLabel={t.admin.projects.delete}
        cancelLabel={t.admin.projects.cancel}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
