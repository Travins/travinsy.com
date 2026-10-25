type Script = {
  match: RegExp
  reasoning: string
  tools: {
    name: string
    input: Record<string, string>
    output?: unknown
    error?: string
  }[]
  source: { title: string; url: string }
  answer: string
}

// 所有数据均为演示数据，不会查询或操作真实服务。reasoning 是预写的分析摘要。
const scripts: Script[] = [
  {
    match: /API|可用率|监控/i,
    reasoning: "先对比可用率与错误分布，再核对最近一次发布，缩小排查范围。",
    tools: [
      {
        name: "查询可用率",
        input: { service: "api-gateway", window: "15m" },
        output: {
          availability: "97.8%",
          baseline: "99.95%",
          status: "演示数据",
        },
      },
      {
        name: "关联错误与发布",
        input: { service: "api-gateway", groupBy: "upstream" },
        output: {
          upstream: "orders",
          errors: "连接池超时",
          deployment: "v2.8.1",
          correlation: "发布后 3 分钟开始升高",
        },
      },
    ],
    source: {
      title: "Prometheus 查询基础",
      url: "https://prometheus.io/docs/prometheus/latest/querying/basics/",
    },
    answer:
      "可用率下降与 `orders` 上游的连接池超时相关。演示窗口内可用率从 99.95% 降到 97.8%，错误集中在 `v2.8.1` 发布之后。\n\n- 先对照发布前后的连接池配置与慢查询。\n- 检查等待连接数、请求并发和数据库延迟。\n- 若错误持续扩大，按你的发布流程评估回滚。\n\n这些是模拟观测结果，尚未执行任何变更。",
  },
  {
    match: /vllm|显存|推理|GPU/i,
    reasoning:
      "先读取 GPU 显存快照，再对照 KV cache 与并发配置，区分预分配与实际压力。",
    tools: [
      {
        name: "读取 GPU 快照",
        input: {
          command:
            "nvidia-smi --query-gpu=memory.used,memory.total --format=csv",
        },
        output: {
          gpu: "A100 80GB",
          used: "72 GiB",
          utilization: "61%",
          status: "演示数据",
        },
      },
      {
        name: "检查 vLLM 配置",
        input: {
          service: "inference",
          metrics: "kv_cache_usage,requests_waiting",
        },
        output: {
          gpu_memory_utilization: 0.9,
          kv_cache_usage: "84%",
          requests_waiting: 12,
          max_model_len: 32768,
        },
      },
    ],
    source: {
      title: "vLLM 性能与调优",
      url: "https://docs.vllm.ai/en/latest/configuration/optimization/",
    },
    answer:
      "当前演示服务使用约 `72 / 80 GiB` 显存。`gpu_memory_utilization=0.9` 会预留大部分显存，因此高占用本身不等于泄漏。\n\n- KV cache 已用 84%，同时有 12 个请求排队，建议观察峰值并发。\n- 若长上下文并非必需，可评估降低 `max_model_len`。\n- 调整前记录吞吐、首 token 延迟与 OOM 次数，并做压测对比。\n\n我只展示了模拟检查结果，没有修改推理服务。",
  },
  {
    match: /pnpm|CI|install|前端/i,
    reasoning:
      "先查看 CI 安装日志，再检查 lockfile 和包管理器版本是否与本地一致。",
    tools: [
      {
        name: "读取 CI 安装日志",
        input: {
          job: "frontend-build",
          step: "pnpm install --frozen-lockfile",
        },
        error:
          "ERR_PNPM_OUTDATED_LOCKFILE：package.json 与 pnpm-lock.yaml 不一致（模拟失败）",
      },
      {
        name: "核对包管理器",
        input: { files: "package.json, pnpm-lock.yaml" },
        output: {
          local: "pnpm 10",
          ci: "pnpm 9",
          lockfile: "缺少新增依赖项",
          status: "演示数据",
        },
      },
    ],
    source: { title: "pnpm install 文档", url: "https://pnpm.io/cli/install" },
    answer:
      "这次模拟失败来自锁文件不同步：`--frozen-lockfile` 检测到依赖声明发生变化，CI 与本地 pnpm 版本也不一致。\n\n- 在 `packageManager` 中固定团队使用的 pnpm 版本。\n- 使用相同版本在本地运行 `pnpm install`，检查并提交锁文件差异。\n- 让 CI 使用固定版本，然后重新运行安装任务。\n\n保留 `--frozen-lockfile`，有助于保证安装可复现。",
  },
]
const fallback: Script = {
  match: /.*/,
  reasoning: "先明确问题范围，检查已有上下文，再整理可验证的下一步。",
  tools: [
    {
      name: "读取工作区摘要",
      input: { scope: "demo" },
      output: {
        services: ["应用监控", "模型部署", "前端工程"],
        mode: "离线演示",
      },
    },
    {
      name: "检查上下文",
      input: { source: "当前问题" },
      output: {
        missing: ["环境", "错误日志", "发生时间"],
        status: "需要更多信息",
      },
    },
  ],
  source: { title: "AI SDK 文档", url: "https://ai-sdk.dev/docs/introduction" },
  answer:
    "我可以帮你排查应用监控、模型部署和前端工程问题。当前使用离线演示数据。\n\n- 请补充问题发生的环境与时间。\n- 提供经过脱敏的错误日志或配置片段。\n- 说明预期行为与实际结果，便于逐项验证。",
}

export { scripts, fallback }
