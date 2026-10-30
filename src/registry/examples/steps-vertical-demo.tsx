import { Steps } from "@/registry/ui/steps/steps"

export default function StepsVerticalDemo() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <p className="text-sm font-medium">实名认证</p>
        <p className="font-mono text-[11px] text-muted-foreground">3 / 4</p>
      </div>
      <Steps
        orientation="vertical"
        defaultValue={2}
        items={[
          { title: "验证手机号", description: "138 **** 8000" },
          { title: "填写身份信息", description: "张 * · 1101 **** 001X" },
          { title: "上传证件", description: "反面不清晰", status: "error" },
          { title: "人脸核验", description: "等待上传完成" },
        ]}
      />
      <p className="mt-3 text-xs text-muted-foreground">
        请重新拍摄证件反面，确保文字清晰、边角完整。
      </p>
    </div>
  )
}
