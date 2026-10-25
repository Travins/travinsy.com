import type { Metadata } from "next"
import { ViewFrame } from "@/components/docs/view-frame"
import { getRegistryItem, viewItems } from "@/components/docs/registry-items"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false
export function generateStaticParams() {
  return viewItems().map((item) => ({ name: item.name }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getRegistryItem((await params).name).title }
}
export default async function Page({ params }: Props) {
  return <ViewFrame name={(await params).name} />
}
