/** chinese-number 工具库的自测：`pnpm test:chinese-number`。 */
import assert from "node:assert/strict"

import {
  toChineseNumerals,
  toRmbUppercase,
} from "../src/registry/lib/chinese-number"

let count = 0
function check(actual: string, expected: string, label: string) {
  assert.equal(actual, expected, `${label}：期望 ${expected}，实际 ${actual}`)
  count++
}

// ---------- 人民币大写 ----------
const rmb: [number | string, string][] = [
  [1234.56, "壹仟贰佰叁拾肆元伍角陆分"],
  [1000, "壹仟元整"],
  [1001, "壹仟零壹元整"],
  [100000, "壹拾万元整"],
  [10.05, "壹拾元零伍分"],
  [0.5, "伍角"],
  [0.05, "伍分"],
  [0, "零元整"],
  [1, "壹元整"],
  [10, "壹拾元整"],
  [1.5, "壹元伍角"],
  [1.05, "壹元零伍分"],
  [1.55, "壹元伍角伍分"],
  [-1234.5, "负壹仟贰佰叁拾肆元伍角"],
  // 零的省略规则
  [100100, "壹拾万零壹佰元整"],
  [1000001, "壹佰万零壹元整"],
  [10000000.01, "壹仟万元零壹分"],
  [10010, "壹万零壹拾元整"],
  [100000001, "壹亿零壹元整"],
  [100010000, "壹亿零壹万元整"],
  [100001000, "壹亿零壹仟元整"],
  [1200000000, "壹拾贰亿元整"],
  [1000000000000, "壹万亿元整"],
  [1000000000005, "壹万亿零伍元整"],
  [123456789012, "壹仟贰佰叁拾肆亿伍仟陆佰柒拾捌万玖仟零壹拾贰元整"],
  [
    9007199254740991,
    "玖仟零柒万亿壹仟玖佰玖拾贰亿伍仟肆佰柒拾肆万零玖佰玖拾壹元整",
  ],
]
for (const [input, expected] of rmb)
  check(toRmbUppercase(input), expected, String(input))

// 字符串按十进制处理，不经过浮点
check(toRmbUppercase("0.1"), "壹角", '"0.1"')
check(toRmbUppercase(0.1 + 0.2), "叁角", "0.1 + 0.2")
check(toRmbUppercase("1,234.50"), "壹仟贰佰叁拾肆元伍角", "带千分位")
check(toRmbUppercase(" 12 "), "壹拾贰元整", "首尾空格")
check(toRmbUppercase("-0"), "零元整", "-0")
check(toRmbUppercase(-0.001), "零元整", "舍入为零的负数不带负号")
check(toRmbUppercase("+5"), "伍元整", "显式正号")
check(toRmbUppercase(".5"), "伍角", "省略整数部分")
check(toRmbUppercase("12."), "壹拾贰元整", "末尾小数点")
check(toRmbUppercase("007"), "柒元整", "前导零")
check(toRmbUppercase(1e15), "壹仟万亿元整", "科学计数法展开")
check(
  toRmbUppercase("9999999999999999.99"),
  "玖仟玖佰玖拾玖万亿玖仟玖佰玖拾玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖元玖角玖分",
  "字符串上限",
)

// 分以下：四舍五入 / 舍去
check(toRmbUppercase("1.005"), "壹元零壹分", "四舍五入进位")
check(toRmbUppercase("1.004"), "壹元整", "四舍五入舍去")
check(toRmbUppercase("0.995"), "壹元整", "进位到元")
check(toRmbUppercase("1.009", { rounding: "truncate" }), "壹元整", "舍去")
check(toRmbUppercase("-1.005"), "负壹元零壹分", "负数按绝对值进位")

// 非法与越界一律返回空串
for (const bad of [
  NaN,
  Infinity,
  -Infinity,
  "",
  " ",
  "abc",
  "1.2.3",
  "--1",
  "1e",
  ".",
  "-",
  "１２",
  "10000000000000000", // 17 位
  "9999999999999999.995", // 舍入后进到 17 位
  Number.MAX_SAFE_INTEGER + 2,
])
  check(toRmbUppercase(bad), "", `非法输入 ${String(bad)}`)
check(toRmbUppercase(undefined as unknown as number), "", "undefined")
check(toRmbUppercase(null as unknown as number), "", "null")

// ---------- 中文读法 ----------
const numerals: [number | string, string][] = [
  [0, "零"],
  [5, "五"],
  [10, "十"],
  [11, "十一"],
  [19, "十九"],
  [20, "二十"],
  [100, "一百"],
  [101, "一百零一"],
  [110, "一百一十"],
  [123, "一百二十三"],
  [1000, "一千"],
  [1001, "一千零一"],
  [2000, "二千"],
  [10000, "一万"],
  [10010, "一万零一十"],
  [100000, "十万"],
  [110000, "十一万"],
  [100100, "十万零一百"],
  [1000001, "一百万零一"],
  [10000000, "一千万"],
  [10000000.01, "一千万点零一"],
  [100000000, "一亿"],
  [100010000, "一亿零一万"],
  [1000000000000, "一万亿"],
  [3.14, "三点一四"],
  [0.5, "零点五"],
  [-12, "负十二"],
  [-0, "零"],
]
for (const [input, expected] of numerals)
  check(toChineseNumerals(input), expected, String(input))

const financial: [number, string][] = [
  [0, "零"],
  [10, "壹拾"],
  [123, "壹佰贰拾叁"],
  [10010, "壹万零壹拾"],
  [100000, "壹拾万"],
  [1000001, "壹佰万零壹"],
]
for (const [input, expected] of financial)
  check(
    toChineseNumerals(input, { financial: true }),
    expected,
    `financial ${input}`,
  )

check(toChineseNumerals(NaN), "", "NaN")
check(toChineseNumerals("abc"), "", "非法字符串")
check(toChineseNumerals("12345678901234567"), "", "超出 16 位")

console.log(`chinese-number 自测通过：${count} 项断言`)
