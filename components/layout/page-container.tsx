import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = HTMLAttributes<HTMLElement> & { reading?: boolean };

function PageContainer({ className, reading = false, ...props }: PageContainerProps) {
  return (
    <main
      className={cn(
        "app-page-container mx-auto w-full px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(1.5rem,4vw,3rem)]",
        reading ? "max-w-[800px]" : "max-w-[1400px]",
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
