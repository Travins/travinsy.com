"use client"
import { Checkout01 } from "@/registry/blocks/checkout-01/checkout-01"

/**
 * 结算页入口：把下面的示例数据换成你的地址簿、购物车和支付方式，
 * onSubmit 里调用你的下单接口，返回订单号（和可选的进度时间线）。
 */
const regions = [
  {
    code: "330000",
    name: "浙江省",
    children: [
      {
        code: "330100",
        name: "杭州市",
        children: [{ code: "330106", name: "西湖区" }],
      },
    ],
  },
]
const addresses = [
  {
    id: "home",
    name: "林小满",
    phone: "13800138000",
    regionCode: "330106",
    region: "浙江省 杭州市 西湖区",
    detail: "示例路 18 号 302 室",
  },
]
const items = [
  {
    id: "shirt",
    title: "亚麻衬衫",
    variant: "原色 / M",
    quantity: 1,
    price: 269,
  },
  { id: "bag", title: "帆布托特包", variant: "米色", quantity: 1, price: 89 },
]
const paymentMethods = [
  {
    id: "wechat",
    label: "微信支付",
    icon: (
      <span className="rounded bg-(--flow-green)/15 p-1 text-(--flow-green)">
        微
      </span>
    ),
  },
  {
    id: "alipay",
    label: "支付宝",
    icon: (
      <span className="rounded bg-(--flow-blue)/15 p-1 text-(--flow-blue)">
        支
      </span>
    ),
  },
]
export default function CheckoutPage() {
  return (
    <Checkout01
      addresses={addresses}
      regions={regions}
      items={items}
      paymentMethods={paymentMethods}
      discount={20}
      shippingOptions={[
        { id: "express", label: "快递配送", fee: 8, eta: "预计 2–3 天送达" },
        {
          id: "pickup",
          label: "到店自提",
          fee: 0,
          pickup: true,
          description: "示例生活馆 · 示例路 18 号",
        },
      ]}
      onSubmit={async (payload) => {
        // TODO: 调用你的下单接口，失败时 throw new Error("中文原因")
        console.info("submit order", payload)
        await new Promise((resolve) => setTimeout(resolve, 600))
        return { orderId: "EX20261030001" }
      }}
    />
  )
}
export { regions, addresses, items, paymentMethods }
