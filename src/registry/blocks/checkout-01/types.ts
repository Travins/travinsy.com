import type { ComponentProps, ReactNode } from "react"
import type { RegionOption } from "@/registry/ui/region-picker/region-picker"
type Address = {
  id: string
  name: string
  phone: string
  regionCode: string
  region: string
  detail: string
}
type ShippingOption = {
  id: string
  label: string
  description?: string
  fee: number
  eta?: string
  pickup?: boolean
}
type CheckoutItem = {
  id: string
  title: string
  variant?: string
  quantity: number
  price: number
  image?: string
}
type PaymentMethod = {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
}
type Invoice = {
  type: "none" | "personal" | "company"
  title?: string
  taxId?: string
}
type CheckoutTimelineItem = {
  title: string
  description?: string
  time?: string
  status?: "done" | "current" | "upcoming"
}
type CheckoutPayload = {
  address?: Address
  shippingId: string
  paymentId: string
  invoice: Invoice
  items: CheckoutItem[]
  total: number
}
type CheckoutResult = { orderId: string; timeline?: CheckoutTimelineItem[] }
type Checkout01Props = Omit<ComponentProps<"div">, "onSubmit"> & {
  addresses: Address[]
  defaultAddressId?: string
  regions: RegionOption[]
  shippingOptions: ShippingOption[]
  items: CheckoutItem[]
  discount?: number
  paymentMethods: PaymentMethod[]
  invoice?: Invoice
  onAddressCreate?: (address: Address) => Promise<Address> | Address
  onSubmit: (payload: CheckoutPayload) => Promise<CheckoutResult>
  onViewOrder?: (orderId: string) => void
  onContinue?: () => void
  labels?: Partial<typeof import("./config").DEFAULT_LABELS>
}
export type {
  Address,
  ShippingOption,
  CheckoutItem,
  PaymentMethod,
  Invoice,
  CheckoutPayload,
  CheckoutResult,
  CheckoutTimelineItem,
  Checkout01Props,
}
