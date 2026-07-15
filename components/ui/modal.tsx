"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ModalProps = {
  children: ReactNode;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title?: string;
  className?: string;
};

export function Modal({
  children,
  description,
  onOpenChange,
  open,
  title,
  className,
}: ModalProps) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px] transition duration-[var(--duration-normal)] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <DialogPrimitive.Popup
            className={cn(
              "relative w-full max-w-lg rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-modal transition duration-[var(--duration-normal)] data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 sm:p-8",
              className,
            )}
          >
            {title ? (
              <DialogPrimitive.Title className="mb-2 font-serif-display text-[length:var(--text-section-title)] font-semibold">
                {title}
              </DialogPrimitive.Title>
            ) : null}
            {description ? (
              <DialogPrimitive.Description className="mb-6 text-[length:var(--text-supporting)] leading-6 text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            ) : null}
            {children}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
