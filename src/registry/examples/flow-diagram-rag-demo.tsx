import {
  FlowBeam,
  FlowDiagram,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowSpinner,
  FlowTypedText,
  flowArrival,
  flowRoute,
} from "@/registry/ui/flow-diagram/flow-diagram"

const QUESTION = "如何退款？"
const QUESTION_INTERVAL = 0.12
const ANSWER = "7 天内可退款"
const ANSWER_INTERVAL = 0.1

// 上排：文档切片后写入向量库（建索引）
const SLICE = flowRoute([
  [64, 34],
  [92, 34],
])
const EMBED = flowRoute([
  [148, 34],
  [198, 34],
])
// 下排：问题 → 检索 → 向量库（查询，从左侧竖线进入）→ top-3 片段（从右侧竖线下行）→ LLM → 回答
const ASK = flowRoute([
  [80, 104],
  [106, 104],
])
const QUERY = flowRoute([
  [162, 104],
  [224, 104],
  [224, 47],
])
const HITS = flowRoute([
  [248, 47],
  [248, 159],
])
const COMPOSE = flowRoute([
  [216, 170],
  [168, 170],
])

// 时间轴（秒）：先建索引，再提问，最后检索、生成、逐字给出回答
const SLICE_AT = 0.5
const EMBED_AT = flowArrival(SLICE_AT, SLICE) + 0.1
const STORE_AT = flowArrival(EMBED_AT, EMBED)
const QUESTION_AT = STORE_AT + 0.4
const ASK_AT =
  QUESTION_AT + Array.from(QUESTION).length * QUESTION_INTERVAL + 0.15
const SEARCH_AT = flowArrival(ASK_AT, ASK)
const QUERY_AT = SEARCH_AT + 0.15
const HITS_AT = flowArrival(QUERY_AT, QUERY) + 0.25
const MODEL_AT = flowArrival(HITS_AT, HITS)
const THINK_END = MODEL_AT + 1
const COMPOSE_AT = THINK_END + 0.1
const REPLY_AT = flowArrival(COMPOSE_AT, COMPOSE)
const ANSWER_AT = REPLY_AT + 0.15

const REST = ANSWER_AT + Array.from(ANSWER).length * ANSWER_INTERVAL + 0.5
const EXIT = REST + 0.8
const DURATION = EXIT + 0.8

/** RAG 检索增强：文档切片入库，提问时先检索相关片段，再交给 LLM 生成回答。 */
export default function FlowDiagramRagDemo() {
  return (
    <FlowDiagram
      background="lines"
      width={320}
      height={204}
      duration={DURATION}
      exit={EXIT}
      rest={REST}
      className="w-full max-w-md"
    >
      <FlowBeam route={SLICE} at={SLICE_AT} />
      <FlowBeam route={EMBED} at={EMBED_AT} />
      <FlowBeam route={ASK} at={ASK_AT} />
      <FlowBeam route={QUERY} at={QUERY_AT} />
      <FlowBeam route={HITS} at={HITS_AT} />
      <FlowBeam route={COMPOSE} at={COMPOSE_AT} />

      <FlowNode x={36} y={34} width={56} litAt={0.2}>
        <FlowLabel x={36} y={34}>
          文档
        </FlowLabel>
      </FlowNode>
      <FlowNode x={120} y={34} width={56} litAt={flowArrival(SLICE_AT, SLICE)}>
        <FlowLabel x={120} y={34}>
          切片
        </FlowLabel>
      </FlowNode>
      <FlowReveal at={EMBED_AT}>
        <FlowLabel x={173} y={22} className="fill-muted-foreground text-[9px]">
          嵌入
        </FlowLabel>
      </FlowReveal>
      <FlowNode
        x={236}
        y={34}
        width={76}
        height={26}
        radius={5}
        litAt={STORE_AT}
      >
        <FlowLabel x={236} y={34}>
          向量库
        </FlowLabel>
      </FlowNode>

      <FlowNode x={44} y={104} width={72} litAt={QUESTION_AT}>
        <FlowTypedText
          text={QUESTION}
          at={QUESTION_AT}
          interval={QUESTION_INTERVAL}
          x={14}
          y={104}
        />
      </FlowNode>
      <FlowNode x={134} y={104} width={56} litAt={SEARCH_AT}>
        <FlowLabel x={134} y={104}>
          检索
        </FlowLabel>
      </FlowNode>
      <FlowReveal at={HITS_AT}>
        <FlowLabel
          x={256}
          y={104}
          anchor="start"
          className="fill-muted-foreground text-[9px]"
        >
          top-3
        </FlowLabel>
      </FlowReveal>

      <FlowNode x={248} y={170} width={64} litAt={MODEL_AT}>
        <FlowSpinner
          x={228}
          y={170}
          size={10}
          at={MODEL_AT}
          until={THINK_END}
        />
        <FlowLabel x={252} y={170}>
          LLM
        </FlowLabel>
      </FlowNode>
      <FlowNode
        x={96}
        y={170}
        width={140}
        height={24}
        radius={5}
        litAt={REPLY_AT}
      >
        <FlowTypedText
          text={ANSWER}
          at={ANSWER_AT}
          interval={ANSWER_INTERVAL}
          x={36}
          y={170}
        />
      </FlowNode>
    </FlowDiagram>
  )
}
