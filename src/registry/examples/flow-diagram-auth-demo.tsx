import { Check } from "lucide-react"

import {
  FlowBeam,
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowSpinner,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

const LOGIN = flowRoute([
  [68, 46],
  [102, 46],
])
const VERIFY = flowRoute([
  [158, 46],
  [204, 46],
])
// 失败：从 Auth 下方绕一圈回到用户，形成重试环
const REJECT = flowRoute([
  [220, 57],
  [220, 92],
  [40, 92],
  [40, 57],
])
const ISSUE = flowRoute([
  [260, 57],
  [260, 139],
])
const ACCESS = flowRoute([
  [204, 150],
  [130, 150],
])

// 时间轴（秒）：第一次密码错误被拒绝，沿环路回到用户，重试后通过，拿到令牌访问资源
const LOGIN_AT = 0.5
const VERIFY_AT = flowArrival(LOGIN_AT, LOGIN) + 0.15
const CHECK_AT = flowArrival(VERIFY_AT, VERIFY)
const CHECK_END = CHECK_AT + 0.7
const REJECT_AT = CHECK_END + 0.1
const RETRY_LOGIN_AT = flowArrival(REJECT_AT, REJECT) + 0.3
const RETRY_VERIFY_AT = flowArrival(RETRY_LOGIN_AT, LOGIN) + 0.15
const RECHECK_AT = flowArrival(RETRY_VERIFY_AT, VERIFY)
const RECHECK_END = RECHECK_AT + 0.6
const ISSUE_AT = RECHECK_END + 0.1
const TOKEN_AT = flowArrival(ISSUE_AT, ISSUE)
const ACCESS_AT = TOKEN_AT + 0.3
const GRANTED_AT = flowArrival(ACCESS_AT, ACCESS)

const REST = GRANTED_AT + 0.7
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** 登录鉴权：首次失败后沿环路重试，通过后签发令牌并访问受保护资源。 */
export default function FlowDiagramAuthDemo() {
  return (
    <FlowDiagram
      width={320}
      height={190}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
    >
      <FlowBeam route={LOGIN} at={LOGIN_AT} />
      <FlowBeam route={VERIFY} at={VERIFY_AT} />
      <FlowBeam route={REJECT} at={REJECT_AT} tone="destructive" />
      <FlowBeam route={LOGIN} at={RETRY_LOGIN_AT} base={false} />
      <FlowBeam route={VERIFY} at={RETRY_VERIFY_AT} base={false} />
      <FlowBeam route={ISSUE} at={ISSUE_AT} />
      <FlowBeam route={ACCESS} at={ACCESS_AT} />

      <FlowNode x={40} y={46} width={56} litAt={0.2}>
        <FlowLabel x={40} y={46}>
          用户
        </FlowLabel>
      </FlowNode>
      <FlowNode x={130} y={46} width={56} litAt={flowArrival(LOGIN_AT, LOGIN)}>
        <FlowLabel x={130} y={46}>
          网关
        </FlowLabel>
      </FlowNode>
      <FlowNode x={240} y={46} width={72} height={22} litAt={CHECK_AT}>
        <FlowSpinner x={218} y={46} size={10} at={CHECK_AT} until={CHECK_END} />
        <FlowSpinner
          x={218}
          y={46}
          size={10}
          at={RECHECK_AT}
          until={RECHECK_END}
        />
        <FlowLabel x={246} y={46}>
          Auth
        </FlowLabel>
      </FlowNode>

      <FlowReveal at={REJECT_AT}>
        <FlowLabel x={130} y={80} className="fill-destructive text-[9px]">
          401 密码错误，重试
        </FlowLabel>
      </FlowReveal>
      <FlowReveal at={ISSUE_AT}>
        <FlowLabel
          x={268}
          y={98}
          anchor="start"
          className="fill-primary text-[9px]"
        >
          200
        </FlowLabel>
      </FlowReveal>

      <FlowNode x={240} y={150} width={72} height={22} litAt={TOKEN_AT}>
        <FlowLabel x={240} y={150}>
          JWT
        </FlowLabel>
      </FlowNode>
      <FlowReveal at={ACCESS_AT}>
        <FlowLabel x={167} y={136} className="fill-muted-foreground text-[9px]">
          Bearer
        </FlowLabel>
      </FlowReveal>
      <FlowNode x={90} y={150} width={80} height={22} litAt={GRANTED_AT}>
        <FlowReveal at={GRANTED_AT}>
          <Check
            x={56}
            y={144}
            width={12}
            height={12}
            strokeWidth={2}
            className="text-primary"
          />
        </FlowReveal>
        <FlowLabel x={96} y={150}>
          /orders
        </FlowLabel>
      </FlowNode>
    </FlowDiagram>
  )
}
