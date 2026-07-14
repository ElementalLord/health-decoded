import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = HTMLAttributes<HTMLElement> & { reading?: boolean };

function PageContainer({ className, reading = false, ...props }: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-5 py-6 md:px-6 md:py-8 lg:px-8",
        reading ? "max-w-[680px]" : "max-w-[1152px]",
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
