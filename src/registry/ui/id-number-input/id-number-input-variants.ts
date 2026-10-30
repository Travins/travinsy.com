import { cva } from "class-variance-authority"

const idNumberInputControlVariants = cva(
  "flex w-full min-w-0 cursor-text items-center gap-3 rounded-md border bg-muted/60 px-3 transition-colors motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "h-7 text-base pointer-coarse:h-9 md:text-xs",
        default: "h-8 text-base pointer-coarse:h-10 md:text-sm",
        lg: "h-9 text-base pointer-coarse:h-11 md:text-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
)

export { idNumberInputControlVariants }
