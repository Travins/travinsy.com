import {
  DocsPage,
  docsMetadata,
  docsParams,
  type DocsRouteProps,
} from "@/components/docs/docs-page"
export const dynamicParams = false
export function generateStaticParams() {
  return docsParams("components")
}
export function generateMetadata(props: DocsRouteProps) {
  return docsMetadata("components", props)
}
export default function Page(props: DocsRouteProps) {
  return <DocsPage section="components" {...props} />
}
