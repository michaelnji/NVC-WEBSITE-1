"use client"

import ImageWithSkeleton from "@/components/image-with-skeleton";
import { getPrimaryImage } from "@/lib/utils";

export type AdminItemCardProps = {
  imageUrl?: string | null;
  title: string | null;
  description?: string | null;
  selected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  imageSizeClass?: string;
  imageClassName?: string;
};

export function AdminItemCard({
  imageUrl,
  title,
  description,
  selected = false,
  onSelect,
  onDelete,
  imageSizeClass = "h-24 w-24",
  imageClassName = "w-full h-full object-cover rounded",
}: AdminItemCardProps) {
  return (
    <div
      className={`group relative rounded-lg border p-3 transition-all h-full flex flex-col  ${
        selected
          ? "border-brand ring-1 ring-brand/30"
          : "border-border hover:border-brand hover:ring-1 hover:ring-brand/30"
      }`}
    >
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -right-3 -top-3 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-red-600"
        >
          ×
        </button>
      )}

      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left disabled:cursor-default flex-1"
        disabled={!onSelect}
      >
        <div className="flex   items-start">
          <ImageWithSkeleton
            src={getPrimaryImage(imageUrl)}
            alt={title || "Item"}
            wrapperClassName={imageSizeClass}
            className={imageClassName}
          />
          <div className="min-w-0 ml-2 flex-1 flex flex-col gap-1">
            <p className="font-medium truncate">{title}</p>
            {description !== undefined &&
              description !== null &&
              description !== "" && (
                <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-line">
                  {description}
                </p>
              )}
          </div>
        </div>
      </button>

      {selected && (
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-brand/30" />
      )}
    </div>
  );
}



