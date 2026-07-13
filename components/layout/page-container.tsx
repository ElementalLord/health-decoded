import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = HTMLAttributes<HTMLElement> & { reading?: boolean };

function PageContainer({ className, reading = false, ...props }: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
        reading ? "max-w-[760px]" : "max-w-[1100px]",
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
