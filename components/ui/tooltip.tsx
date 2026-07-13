"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TooltipProps = {
  children: ReactElement;
  content: ReactNode;
  disabled?: boolean;
};

function Tooltip({ children, content, disabled = false }: TooltipProps) {
  return (
    <TooltipPrimitive.Root disabled={disabled}>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner sideOffset={8}>
          <TooltipPrimitive.Popup
            className={cn(
              "z-50 max-w-60 rounded-lg bg-foreground px-3 py-2 text-xs leading-4 text-background shadow-modal transition duration-120 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            )}
          >
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export { Tooltip };
