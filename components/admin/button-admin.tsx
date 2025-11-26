"use client"

import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal"
import { useLanguage } from "@/contexts/language-context";
import * as React from "react";

type ButtonAdminProps = {
  children: React.ReactNode
  onClick?: () => Promise<void> | void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
  // Confirmation pop-up for critical actions
  confirm?: boolean
  confirmTitle?: string
  confirmMessage?: string
  confirmConfirmLabel?: string
  confirmCancelLabel?: string
}

export function ButtonAdmin({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = true,
  confirm = false,
  confirmTitle = "Are you sure?",
  confirmMessage,
  confirmConfirmLabel,
  confirmCancelLabel,
}: ButtonAdminProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const { t } = useLanguage();

  const runAction = async () => {
    if (disabled || isLoading) return;
    if (!onClick) return;
    try {
      setIsLoading(true);
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (disabled || isLoading) return;
    if (confirm) {
      setShowConfirm(true);
      return;
    }
    void runAction();
  };

  return (
    <>
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`${
          fullWidth ? "w-full" : ""
        } rounded-md border border-brand bg-brand text-white px-3 py-2 text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading && (
          <span className="inline-flex h-3 w-3 items-center justify-center">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
          </span>
        )}
        {children}
      </button>

      {confirm && (
        <AdminConfirmModal
          open={showConfirm}
          title={confirmTitle}
          message={confirmMessage || t.common.confirm.defaultMessage}
          confirmLabel={confirmConfirmLabel || t.common.confirm.confirm}
          cancelLabel={confirmCancelLabel || t.common.confirm.cancel}
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            setShowConfirm(false);
            await runAction();
          }}
        />
      )}
    </>
  );
}
