import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = HTMLAttributes<HTMLElement> & { reading?: boolean };

function PageContainer({ className, reading = false, ...props }: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-5 py-8 md:px-8 md:py-12 lg:px-10",
        reading ? "max-w-[760px]" : "max-w-[1240px]",
        className,
      )}
      {...props}
    />
  );
}

export { PageContainer };
