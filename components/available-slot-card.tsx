"use client"

import { useLanguage } from "@/contexts/language-context";

type AvailableSlotCardProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function AvailableSlotCard({
  title,
  description,
  className = "",
}: AvailableSlotCardProps) {
  const { t } = useLanguage();
  const finalTitle = title ? t.common.slotAvailable.title : "";
  const finalDescription = description
    ? t.common.slotAvailable.description
    : "";
  const hasDescription = Boolean(description);
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center px-6 text-center ${className}`}
    >
      <h2
        className={`text-xs sm:text-sm  font-sans font-bold text-white leading-tight tracking-wide ${
          hasDescription ? "mb-2" : "mb-0"
        }`}
      >
        {finalTitle}
      </h2>
      {finalDescription && (
        <p className="font-sans text-white/75 text-xs  leading-relaxed max-w-xs">
          {finalDescription}
        </p>
      )}
    </div>
  );
}
