"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogDismiss,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
  children: ReactNode;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: string;
};

function Modal({ children, description, onOpenChange, open, title }: ModalProps) {
  return (
    <Dialog onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)} open={open}>
      <DialogContent>
        <DialogDismiss />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export { Modal };
