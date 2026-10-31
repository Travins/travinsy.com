import {
  EntryPage,
  entryMetadata,
  entryParams,
  type EntryRouteProps,
} from "@/components/docs/entry-page"
export const dynamicParams = false
export function generateStaticParams() {
  return entryParams("templates")
}
export function generateMetadata(props: EntryRouteProps) {
  return entryMetadata("templates", props)
}
export default function Page(props: EntryRouteProps) {
  return <EntryPage section="templates" {...props} />
}
