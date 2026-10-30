"use client"
import * as React from "react"
import { encode } from "uqr"
import { Check, ArrowLeft, Info, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NumberStepper } from "@/registry/ui/number-stepper/number-stepper"
import { Steps } from "@/registry/ui/steps/steps"
import {
  CheckoutAddressForm,
  CheckoutAddressCard,
  CheckoutPaymentOptions,
} from "@/registry/blocks/checkout-01/form-parts"
import { CheckoutProgress } from "@/registry/blocks/checkout-01/checkout-01"
import { money } from "@/registry/blocks/checkout-01/config"
import {
  regions,
  items,
  paymentMethods,
} from "@/registry/blocks/checkout-01/demo"
import type { Address } from "@/registry/blocks/checkout-01/types"
const titles = [
  "门店开单",
  "等待顾客扫码",
  "顾客填写地址",
  "门店确认",
  "支付",
  "完成",
]
export default function CheckoutStoreMobileDemo() {
  const formId = React.useId()
  const [session, setSession] = React.useState(0)
  const [step, setStep] = React.useState(0)
  const [quantity, setQuantity] = React.useState(1)
  const [seconds, setSeconds] = React.useState(599)
  const [address, setAddress] = React.useState<Address | null>(null)
  const [payment, setPayment] = React.useState("wechat")
  const [state, setState] = React.useState<"select" | "waiting" | "failed">(
    "select",
  )
  const [editing, setEditing] = React.useState(false)
  const [originalTotal, setOriginalTotal] = React.useState(358)
  const [changed, setChanged] = React.useState(false)
  React.useEffect(() => {
    if (step !== 1) return
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [step])
  const matrix = React.useMemo(
    () =>
      encode("https://example.invalid/order/demo?session=" + session, {
        ecc: "M",
      }).data,
    [session],
  )
  const total = 269 * quantity + 89
  const goods = (
    <div className="grid gap-5">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex justify-between gap-3 border-b border-edge pb-4"
        >
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.variant}</p>
          </div>
          <div className="text-right">
            <p className="font-mono">{money(item.price)}</p>
            {i === 0 && (step === 0 || editing) ? (
              <NumberStepper
                aria-label="衬衫数量"
                min={1}
                max={99}
                value={quantity}
                onValueChange={(next) => {
                  setQuantity(next ?? 1)
                  if (step === 3) setChanged(true)
                }}
                className="mt-2 w-28"
              />
            ) : (
              <p>× {i === 0 ? quantity : 1}</p>
            )}
          </div>
        </div>
      ))}
      <p className="flex justify-between">
        合计{" "}
        <span className="flex items-baseline gap-2">
          {changed && total !== originalTotal && (
            <del className="font-mono text-sm text-muted-foreground">
              {money(originalTotal)}
            </del>
          )}
          <strong
            className={"font-mono text-2xl " + (changed ? "text-primary" : "")}
          >
            {money(total)}
          </strong>
        </span>
      </p>
    </div>
  )
  return (
    <div
      data-slot="checkout-store-mobile"
      className="max-w-full rounded-[3.875rem] border border-edge bg-muted p-2 max-sm:contents"
    >
      <div className="relative flex h-[874px] w-[402px] max-w-full flex-col overflow-hidden rounded-[3.375rem] bg-background text-foreground max-sm:h-[calc(100dvh-3rem)] max-sm:w-full max-sm:rounded-none">
        <div className="flex h-14 shrink-0 items-center justify-between px-8 text-sm">
          <span className="font-mono">9:41</span>
          <span>示例生活馆</span>
        </div>
        <div className="px-6">
          <Steps
            variant="compact"
            items={titles.map((title) => ({ title }))}
            value={step}
          />
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{titles[step]}</h2>
            <div className="flex items-center gap-1">
              {step === 3 && (
                <Button
                  size="default"
                  variant="ghost"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "完成修改" : "改单"}
                </Button>
              )}
              {step > 0 && step < 5 && (
                <Button
                  size="default"
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft aria-hidden="true" />
                  返回
                </Button>
              )}
            </div>
          </div>
          {step === 0 && goods}
          {step === 1 && (
            <div className="grid justify-items-center gap-5 py-6">
              <svg
                role="img"
                aria-label="顾客填写地址二维码"
                viewBox={
                  "0 0 " + (matrix.length + 8) + " " + (matrix.length + 8)
                }
                className="size-56 bg-background"
              >
                <path
                  fill="currentColor"
                  d={matrix
                    .flatMap((row, y) =>
                      row.map((dark, x) =>
                        dark ? "M" + (x + 4) + " " + (y + 4) + "h1v1h-1z" : "",
                      ),
                    )
                    .join("")}
                />
              </svg>
              <p className="font-mono text-2xl">
                {seconds === 0
                  ? "二维码已过期"
                  : String(Math.floor(seconds / 60)).padStart(2, "0") +
                    ":" +
                    String(seconds % 60).padStart(2, "0")}
              </p>
              <p className="text-sm text-muted-foreground">
                10 分钟内有效 ·{" "}
                <button
                  className="underline"
                  onClick={() => {
                    setSeconds(599)
                    setSession((s) => s + 1)
                  }}
                >
                  重新生成
                </button>
              </p>
              <button
                className="text-xs underline"
                onClick={() => setSeconds(0)}
              >
                模拟过期
              </button>
            </div>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                林小满，请填写收货地址
              </p>
              <CheckoutAddressForm
                formId={formId}
                hideSubmit
                regions={regions}
                labels={{ save: "提交收货地址" }}
                onSave={async (value) => {
                  setAddress(value)
                  setStep(3)
                }}
              />
            </>
          )}
          {step === 3 && (
            <>
              {address && <CheckoutAddressCard address={address} />}
              {goods}
              {changed && (
                <p
                  role="status"
                  className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground"
                >
                  <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  金额已变更，请顾客重新确认
                </p>
              )}
            </>
          )}
          {step === 4 && (
            <>
              <p className="font-mono text-3xl">{money(total)}</p>
              {state !== "waiting" ? (
                <>
                  {state === "failed" && (
                    <p
                      role="alert"
                      className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      <CircleAlert
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0"
                      />
                      支付失败：余额不足，请更换方式或重试
                    </p>
                  )}
                  <CheckoutPaymentOptions
                    label="支付方式"
                    methods={paymentMethods}
                    value={payment}
                    onValueChange={setPayment}
                  />
                </>
              ) : (
                <div className="grid gap-3">
                  <p role="status">等待支付结果…</p>
                  <Button size="default" onClick={() => setStep(5)}>
                    模拟支付成功
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    onClick={() => setState("failed")}
                  >
                    模拟支付失败
                  </Button>
                  <Button
                    size="default"
                    variant="ghost"
                    onClick={() => setState("select")}
                  >
                    取消
                  </Button>
                </div>
              )}
            </>
          )}
          {step === 5 && (
            <>
              <div className="flex justify-center">
                <span
                  data-slot="checkout-success-badge"
                  className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <Check className="size-8" />
                </span>
              </div>
              <p className="text-center font-mono text-3xl">{money(total)}</p>
              <p className="text-center text-sm text-muted-foreground">
                {paymentMethods.find((p) => p.id === payment)?.label}
              </p>
              <CheckoutProgress
                items={[
                  "已下单",
                  "顾客已填写地址",
                  "已支付",
                  "门店备货",
                  "已发货",
                ].map((title, i) => ({
                  title,
                  status: i < 3 ? ("done" as const) : ("upcoming" as const),
                  time: i < 3 ? ["14:20", "14:22", "14:25"][i] : undefined,
                }))}
              />
            </>
          )}
        </div>
        <div className="shrink-0 border-t border-edge bg-background px-6 pt-4 pb-10">
          {step === 2 ? (
            <Button type="submit" form={formId} size="lg" className="w-full">
              提交收货地址
            </Button>
          ) : (
            <Button
              size="lg"
              variant={step === 5 ? "outline" : "default"}
              className="w-full"
              disabled={
                (step === 1 && seconds === 0) ||
                (step === 4 && state === "waiting")
              }
              type="button"
              onClick={(event) => {
                event.preventDefault()
                if (step === 5) {
                  setStep(0)
                  setQuantity(1)
                  setChanged(false)
                  setAddress(null)
                  setState("select")
                } else if (step === 4) setState("waiting")
                else {
                  if (step === 0) {
                    setSeconds(599)
                    setOriginalTotal(total)
                  }
                  if (step === 3) {
                    setState("select")
                    setEditing(false)
                  }
                  setStep(step + 1)
                }
              }}
            >
              {
                [
                  "生成顾客填写二维码",
                  "模拟扫码",
                  "",
                  "确认并去支付",
                  state === "failed" ? "重新支付" : "去支付",
                  "再开一单",
                ][step]
              }
            </Button>
          )}
        </div>
        <span
          aria-hidden
          className="absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded bg-foreground max-sm:hidden"
        />
      </div>
    </div>
  )
}
