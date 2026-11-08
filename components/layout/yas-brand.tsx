import { cn } from "@/lib/utils";
export function YasBrand({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center gap-2.5", className)}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="size-8 text-primary"><path d="M4 5h7l5 9 5-9h7L19.5 20v8h-7v-8L4 5Z" fill="currentColor" /><path d="m23 22 5-5v11h-5v-6Z" fill="currentColor" opacity=".4" /></svg><span className="text-2xl font-black tracking-[-.08em]">YAS<span className="text-primary">.</span></span></span>;
}
