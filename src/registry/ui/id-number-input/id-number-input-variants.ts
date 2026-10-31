import { cn } from "@/lib/utils"
import { barFieldVariants } from "@/registry/ui/bar-field/bar-field"

const idNumberInputControlVariants: typeof barFieldVariants = (props) =>
  cn(barFieldVariants(props), "motion-reduce:transition-none")

export { idNumberInputControlVariants }
