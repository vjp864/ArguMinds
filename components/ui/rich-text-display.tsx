import { cn } from "@/lib/utils"

export function RichTextDisplay({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed",
        "[&_mark]:bg-yellow-200 [&_mark]:dark:bg-yellow-500/30",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
