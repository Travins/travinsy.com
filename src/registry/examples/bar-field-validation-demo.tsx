"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { BarField } from "@/registry/ui/bar-field/bar-field"
export default function BarFieldValidationDemo() {
  const [value, setValue] = React.useState("123")
  const [hint, setHint] = React.useState(false)
  return (
    <div data-slot="bar-field-validation-demo" className="w-full max-w-sm">
      <BarField
        label="密码"
        type="password"
        value={value}
        onValueChange={setValue}
        error={value.length < 8 ? "密码至少需要 8 个字符" : undefined}
        description={
          hint ? "请联系团队管理员重置密码。" : "使用至少 8 个字符。"
        }
        footerAction={
          <Button type="button" variant="link" onClick={() => setHint(true)}>
            忘记密码
          </Button>
        }
      />
    </div>
  )
}
