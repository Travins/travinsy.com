import {
  EntryPage,
  entryMetadata,
  entryParams,
  type EntryRouteProps,
} from "@/components/docs/entry-page"
export const dynamicParams = false
export function generateStaticParams() {
  return entryParams("pages")
}
export function generateMetadata(props: EntryRouteProps) {
  return entryMetadata("pages", props)
}
export default function Page(props: EntryRouteProps) {
  return <EntryPage section="pages" {...props} />
}
