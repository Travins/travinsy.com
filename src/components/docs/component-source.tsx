import { getSourceFiles } from "./source-files"
import { SourceFile } from "./source-file"

export async function ComponentSource({ name }: { name: string }) {
  const files = await getSourceFiles(name)
  return files.map((file) => <SourceFile key={file.path} file={file} />)
}
