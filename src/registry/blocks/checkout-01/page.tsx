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
// 支付方式图标：微信支付 / 支付宝的品牌图形（路径取自 Simple Icons，CC0），颜色跟随色调变量
const paymentMethods = [
  {
    id: "wechat",
    label: "微信支付",
    icon: (
      <span className="grid size-6 place-items-center rounded-md bg-(--flow-green)/12 text-(--flow-green)">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4 fill-current"
        >
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
        </svg>
      </span>
    ),
  },
  {
    id: "alipay",
    label: "支付宝",
    icon: (
      <span className="grid size-6 place-items-center rounded-md bg-(--flow-blue)/12 text-(--flow-blue)">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4 fill-current"
        >
          <path d="M19.695 15.07c3.426 1.158 4.203 1.22 4.203 1.22V3.846c0-2.124-1.705-3.845-3.81-3.845H3.914C1.808.001.102 1.722.102 3.846v16.31c0 2.123 1.706 3.845 3.813 3.845h16.173c2.105 0 3.81-1.722 3.81-3.845v-.157s-6.19-2.602-9.315-4.119c-2.096 2.602-4.8 4.181-7.607 4.181-4.75 0-6.361-4.19-4.112-6.949.49-.602 1.324-1.175 2.617-1.497 2.025-.502 5.247.313 8.266 1.317a16.796 16.796 0 0 0 1.341-3.302H5.781v-.952h4.799V6.975H4.77v-.953h5.81V3.591s0-.409.411-.409h2.347v2.84h5.744v.951h-5.744v1.704h4.69a19.453 19.453 0 0 1-1.986 5.06c1.424.52 2.702 1.011 3.654 1.333m-13.81-2.032c-.596.06-1.71.325-2.321.869-1.83 1.608-.735 4.55 2.968 4.55 2.151 0 4.301-1.388 5.99-3.61-2.403-1.182-4.438-2.028-6.637-1.809" />
        </svg>
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
