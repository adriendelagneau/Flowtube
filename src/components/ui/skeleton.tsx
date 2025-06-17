import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("dark:bg-neutral-700 bg-sky-100 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
