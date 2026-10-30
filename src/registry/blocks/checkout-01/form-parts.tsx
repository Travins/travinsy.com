"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PhoneInput } from "@/registry/ui/phone-input/phone-input"
import {
  RegionPicker,
  type RegionOption,
} from "@/registry/ui/region-picker/region-picker"
import { cn } from "@/lib/utils"
import { DEFAULT_LABELS } from "./config"
import type { Address, PaymentMethod } from "./types"

function CheckoutTextField({
  label,
  error,
  className,
  ...props
}: React.ComponentProps<"input"> & { label: string; error?: string }) {
  const id = React.useId()
  return (
    <div
      data-slot="checkout-text-field"
      className="@container/field grid gap-1.5"
    >
      <label
        htmlFor={id}
        className="hidden text-xs text-muted-foreground @max-[20rem]/field:block"
      >
        {label}
      </label>
      <div
        className={cn(
          "flex h-8 min-w-0 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm focus-within:border-foreground/25 focus-within:bg-background pointer-coarse:h-10",
          error &&
            "border-destructive ring-3 ring-destructive/20 focus-within:border-destructive",
        )}
      >
        <label
          htmlFor={id}
          className="shrink-0 text-muted-foreground @max-[20rem]/field:sr-only"
        >
          {label}
        </label>
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? id + "-error" : undefined}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-right text-base font-medium outline-none @max-[20rem]/field:text-left pointer-fine:text-sm",
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={id + "-error"} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
function CheckoutAddressForm({
  regions,
  formId,
  hideSubmit = false,
  onSave,
  labels: overrides,
}: {
  regions: RegionOption[]
  formId?: string
  hideSubmit?: boolean
  onSave: (address: Address) => Promise<void>
  labels?: Partial<typeof DEFAULT_LABELS>
}) {
  const t = { ...DEFAULT_LABELS, ...overrides }
  const [value, setValue] = React.useState<Address>({
    id: "",
    name: "",
    phone: "",
    regionCode: "",
    region: "",
    detail: "",
  })
  const [attempt, setAttempt] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState("")
  const errors = {
    name: !value.name.trim() ? t.nameRequired : undefined,
    phone: !/^1[3-9]\d{9}$/.test(value.phone) ? t.phoneInvalid : undefined,
    region: !value.regionCode ? t.regionRequired : undefined,
    detail: !value.detail.trim() ? t.detailRequired : undefined,
  }
  const invalid = Object.values(errors).some(Boolean)
  return (
    <form
      id={formId}
      data-slot="checkout-address-form"
      className="grid gap-3"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault()
        setAttempt(true)
        if (invalid) {
          const fields =
            e.currentTarget.querySelectorAll<HTMLElement>("[data-field]")
          const first = Array.from(fields).find(
            (field) => errors[field.dataset.field as keyof typeof errors],
          )
          first?.scrollIntoView({ block: "center" })
          first
            ?.querySelector<HTMLElement>('input:not([type="hidden"]), button')
            ?.focus()
          return
        }
        setPending(true)
        setError("")
        try {
          await onSave({ ...value, id: crypto.randomUUID() })
        } catch (e) {
          setError(e instanceof Error ? e.message : t.failed)
        } finally {
          setPending(false)
        }
      }}
    >
      <div data-field="name">
        <CheckoutTextField
          error={attempt ? errors.name : undefined}
          label={t.name}
          autoComplete="shipping name"
          value={value.name}
          onChange={(e) => setValue({ ...value, name: e.target.value })}
        />
      </div>
      <div data-field="phone">
        <PhoneInput
          error={attempt ? errors.phone : undefined}
          label={t.phone}
          value={value.phone}
          onValueChange={(phone) => setValue({ ...value, phone })}
        />
      </div>
      <div data-field="region">
        <RegionPicker
          error={attempt ? errors.region : undefined}
          label={t.region}
          regions={regions}
          value={value.regionCode || null}
          onValueChange={(code, path) =>
            setValue({
              ...value,
              regionCode: code ?? "",
              region: path.map((x) => x.name).join(" "),
            })
          }
        />
      </div>
      <div data-field="detail">
        <CheckoutTextField
          error={attempt ? errors.detail : undefined}
          label={t.detail}
          autoComplete="shipping street-address"
          value={value.detail}
          onChange={(e) => setValue({ ...value, detail: e.target.value })}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <Button
        type="submit"
        size="default"
        className={hideSubmit ? "hidden" : undefined}
        disabled={pending}
      >
        {pending ? t.saving : t.save}
      </Button>
    </form>
  )
}
function CheckoutPaymentOptions({
  methods,
  value,
  onValueChange,
  label,
}: {
  methods: PaymentMethod[]
  value: string
  onValueChange: (value: string) => void
  label: string
}) {
  return (
    <RadioGroup
      data-slot="checkout-payment-options"
      aria-label={label}
      value={value}
      onValueChange={(v) => onValueChange(String(v))}
    >
      {methods.map((m) => (
        <label
          key={m.id}
          className="flex cursor-pointer items-center gap-3 rounded-md border border-edge p-4 has-checked:border-primary has-disabled:opacity-50"
        >
          <RadioGroupItem value={m.id} disabled={m.disabled} />
          {m.icon}
          <span className="flex-1">
            {m.label}
            <small className="block text-muted-foreground">
              {m.description}
            </small>
          </span>
        </label>
      ))}
    </RadioGroup>
  )
}
function CheckoutAddressCard({ address }: { address: Address }) {
  return (
    <div
      data-slot="checkout-address-card"
      className="min-w-0 flex-1 space-y-2 text-sm"
    >
      <p className="font-medium">
        {address.name}{" "}
        <span className="ml-3 font-mono">
          {address.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3")}
        </span>
      </p>
      <p className="text-muted-foreground">
        {address.region} {address.detail}
      </p>
    </div>
  )
}
export {
  CheckoutTextField,
  CheckoutAddressForm,
  CheckoutPaymentOptions,
  CheckoutAddressCard,
}
