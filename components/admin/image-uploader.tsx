"use client"

import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { ImagePlus, Upload, X } from "lucide-react";
import type React from "react"
import { useCallback, useRef, useState } from "react";

export interface SelectedFile {
  id: string;
  file: File;
  previewUrl: string;
}

interface ImageUploaderProps {
  /** Single or multiple file upload mode (default: false = single) */
  multiple?: boolean;
  /** Maximum number of files in multiple mode (default: 4) */
  maxFiles?: number;
  /** Maximum file size in bytes (default: 5MB) */
  maxFileSize?: number;
  /** Current selected files */
  value?: SelectedFile[];
  /** Callback when files change */
  onChange?: (files: SelectedFile[]) => void;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Custom class name for the container */
  className?: string;
}

const MAX_FILE_SIZE_DEFAULT = 5 * 1024 * 1024; // 5MB
const MAX_FILES_DEFAULT = 4;

export function ImageUploader({
  multiple = false,
  maxFiles = MAX_FILES_DEFAULT,
  maxFileSize = MAX_FILE_SIZE_DEFAULT,
  value = [],
  onChange,
  disabled = false,
  className,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useLanguage();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const effectiveMaxFiles = multiple ? maxFiles : 1;

  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; errors: string[] } => {
      const errors: string[] = [];
      const valid: File[] = [];

      for (const file of files) {
        // Check file type
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: Not an image file`);
          continue;
        }

        // Check file size
        if (file.size > maxFileSize) {
          errors.push(
            `${file.name}: File too large (max ${formatFileSize(maxFileSize)})`
          );
          continue;
        }

        valid.push(file);
      }

      return { valid, errors };
    },
    [maxFileSize]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      setError(null);

      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        setError(errors.join(". "));
      }

      if (valid.length === 0) return;

      // Calculate how many we can add
      const remainingSlots = effectiveMaxFiles - value.length;
      const filesToAdd = valid.slice(0, remainingSlots);

      if (valid.length > remainingSlots) {
        setError(
          (prev) =>
            (prev ? prev + ". " : "") +
            `Maximum ${effectiveMaxFiles} file(s) allowed`
        );
      }

      const newFiles: SelectedFile[] = filesToAdd.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      // In single mode, replace existing file
      if (!multiple && value.length > 0) {
        value.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        onChange?.(newFiles);
      } else {
        onChange?.([...value, ...newFiles]);
      }
    },
    [validateFiles, effectiveMaxFiles, value, multiple, onChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      const file = value.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.previewUrl);
      }
      onChange?.(value.filter((f) => f.id !== id));
      setError(null);
    },
    [value, onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const canAddMore = value.length < effectiveMaxFiles;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Dropzone */}
      <div
        onClick={() => canAddMore && !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
          isDragOver
            ? "border-brand bg-brand/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          !canAddMore && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled || !canAddMore}
          className="sr-only"
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {isDragOver ? (
            <Upload className="h-5 w-5 text-brand" />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragOver ? (
              "Drop image(s) here"
            ) : canAddMore ? (
              <>
                <span className="text-brand">Click to upload</span> or drag and
                drop
              </>
            ) : (
              `Maximum ${effectiveMaxFiles} file(s) reached`
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {multiple
              ? `JPG, PNG, GIF up to ${formatFileSize(
                  maxFileSize
                )} each (max ${maxFiles})`
              : `JPG, PNG, GIF up to ${formatFileSize(maxFileSize)}`}
          </p>
        </div>
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div
          className={cn("grid gap-2", multiple ? "grid-cols-2" : "grid-cols-1")}
        >
          {value.map((sf) => (
            <div
              key={sf.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={sf.previewUrl}
                alt={sf.file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(sf.id);
                }}
                disabled={disabled}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 disabled:opacity-50"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-2 py-1.5">
                <p className="text-[10px] text-white/90 truncate">
                  {sf.file.name}
                </p>
                <p className="text-[9px] text-white/70">
                  {formatFileSize(sf.file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/**
 * Helper function to upload files to the backend
 * Use this in your form submit handler
 */
export async function uploadFiles(
  files: SelectedFile[]
): Promise<{ url: string; name: string; size: number; type: string }[]> {
  const results: { url: string; name: string; size: number; type: string }[] =
    [];

  for (const sf of files) {
    const formData = new FormData();
    formData.append("file", sf.file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json();
    results.push({
      url: data.url,
      name: sf.file.name,
      size: sf.file.size,
      type: sf.file.type,
    });
  }

  return results;
}

/**
/**
 * Helper function to clean up preview URLs when component unmounts or files are cleared
 */
export function cleanupFiles(files: SelectedFile[]) {
  files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
}
