import { PHONE_LENGTH } from "./config"

/** 全角数字转半角，其余非数字字符丢掉 */
function digitsOf(text: string) {
  let out = ""
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    if (code >= 0xff10 && code <= 0xff19)
      out += String.fromCharCode(code - 0xfee0)
    else if (ch >= "0" && ch <= "9") out += ch
  }
  return out
}

/**
 * 去掉国际区号：「+86 138…」「0086 138…」「86138…」都剩下 11 位。
 * 只在数字超过 11 位时才剥，免得把正在输入的号码误删。
 */
function stripCountryCode(digits: string) {
  if (digits.length > PHONE_LENGTH && digits.startsWith("0086"))
    return digits.slice(4)
  if (digits.length > PHONE_LENGTH && digits.startsWith("86"))
    return digits.slice(2)
  return digits
}

/** 11 位数字按 3-4-4 加空格：`13800138000` → `138 0013 8000`；不足 11 位时按已有位数分 */
function formatPhone(digits: string) {
  const d = digits.slice(0, PHONE_LENGTH)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3)}`
  return `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}`
}

/** 号码中间四位打码：`13800138000` → `138 **** 8000`；不是 11 位时原样返回 */
function maskPhone(digits: string, mask = "****") {
  const d = digitsOf(digits)
  if (d.length !== PHONE_LENGTH) return digits
  return `${d.slice(0, 3)} ${mask} ${d.slice(7)}`
}

/** 是否是有效的中国大陆手机号：11 位，以 13–19 开头 */
function isValidPhone(digits: string) {
  return /^1[3-9]\d{9}$/.test(digits)
}

/**
 * 整理一次输入：返回格式化后的文本、换算后的光标位置和纯数字值。
 * 光标按「它前面有几位数字」换算，所以增删空格、粘贴带横线的号码时光标都落在同一个数字后面。
 */
function sanitizePhone(raw: string, caret: number) {
  const before = digitsOf(raw.slice(0, caret)).length
  const all = digitsOf(raw)
  const stripped = stripCountryCode(all)
  const removed = all.length - stripped.length
  const digits = stripped.slice(0, PHONE_LENGTH)
  const text = formatPhone(digits)
  const want = Math.min(Math.max(before - removed, 0), digits.length)
  let position = 0
  let seen = 0
  while (position < text.length && seen < want) {
    if (text[position] !== " ") seen++
    position++
  }
  return { text, caret: position, digits }
}

export { digitsOf, formatPhone, isValidPhone, maskPhone, sanitizePhone }
