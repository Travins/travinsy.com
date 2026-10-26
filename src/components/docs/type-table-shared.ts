/**
 * 表头与行头共用的列宽（名称 / 类型 / chevron）。名称列占约三成，类型列自适应；
 * 窄屏类型列固定宽度，让名称尽量不折断。
 */
export const typeTableGrid =
  "grid grid-cols-[minmax(0,1fr)_5.5rem_1rem] gap-x-3 sm:grid-cols-[minmax(9rem,32%)_minmax(0,1fr)_1rem]"

/** 展开面板：紧凑的「标签 / 值」两列。 */
export const typeTableBodyGrid =
  "grid grid-cols-[5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(9rem,32%)_minmax(0,1fr)]"
