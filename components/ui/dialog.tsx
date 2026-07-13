"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogContent({
  children,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[1px] transition duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <DialogPrimitive.Popup
          className={cn(
            "relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal transition duration-200 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 sm:p-8",
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-6 space-y-2", className)}>{children}</div>;
}

function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-[length:var(--text-section-title)] font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "text-[length:var(--text-supporting)] leading-6 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogDismiss({ className, ...props }: ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      aria-label="Close dialog"
      className={cn(
        "absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition duration-120 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <X aria-hidden="true" className="size-5" />
    </DialogPrimitive.Close>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogDismiss,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
