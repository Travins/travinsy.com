import { ComponentSource } from "./component-source"
import { InstallCommandClient } from "./install-command-client"
export function InstallCommand({ name }: { name: string }) {
  return (
    <InstallCommandClient name={name}>
      <ComponentSource name={name} />
    </InstallCommandClient>
  )
}
