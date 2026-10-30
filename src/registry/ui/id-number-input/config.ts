const KIND_LABELS = {
  idcard: {
    placeholder: "请输入身份证号",
    invalid: "请输入正确的身份证号",
    required: "请输入身份证号",
  },
  bankcard: {
    placeholder: "请输入银行卡号",
    invalid: "请输入正确的银行卡号",
    required: "请输入银行卡号",
  },
  uscc: {
    placeholder: "请输入统一社会信用代码",
    invalid: "请输入正确的统一社会信用代码",
    required: "请输入统一社会信用代码",
  },
}

const DEFAULT_LABELS = {
  ...KIND_LABELS.idcard,
  male: "男",
  female: "女",
  parsed: "{birthDate} · {gender}",
  length: "{length} 位",
}

type IdNumberInputLabels = typeof DEFAULT_LABELS

export { DEFAULT_LABELS, KIND_LABELS }
export type { IdNumberInputLabels }
