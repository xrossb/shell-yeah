import { Gdk } from "ags/gtk4"
import AstalNiri from "gi://AstalNiri"
import { createBinding, For } from "ags"

const niri = AstalNiri.get_default()

export default function NiriWorkspaces({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor
}) {
  const outputs = createBinding(niri, "outputs").as((outputs) =>
    outputs.filter((output) => output.model === gdkmonitor.model)
  )

  return (
    <box name="workspaces">
      <For each={outputs}>{(output) => <Workspaces output={output} />}</For>
    </box>
  )
}

function Workspaces({ output }: { output: AstalNiri.Output }) {
  const workspaces = createBinding(output, "workspaces")

  return (
    <box>
      <For each={workspaces}>
        {(workspace) => <WorkspaceButton workspace={workspace} />}
      </For>
    </box>
  )
}

function WorkspaceButton({ workspace }: { workspace: AstalNiri.Workspace }) {
  const classes = createBinding(niri, "focusedWorkspace").as((focused) => {
    if (focused.id === workspace.id) {
      return ["active"]
    }

    return []
  })

  return (
    <button
      cssClasses={classes}
      label={workspace.idx.toString()}
      onClicked={() => {
        workspace.focus()
      }}
    />
  )
}
