import { Gdk, Gtk } from "ags/gtk4"
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
    <box>
      <For each={outputs}>{(output) => <Workspaces output={output} />}</For>
    </box>
  )
}

function Workspaces({ output }: { output: AstalNiri.Output }) {
  const workspaces = createBinding(output, "workspaces")

  return (
    <box class="workspaces">
      <For each={workspaces}>
        {(workspace) => <WorkspaceButton workspace={workspace} />}
      </For>
    </box>
  )
}

function WorkspaceButton({ workspace }: { workspace: AstalNiri.Workspace }) {
  const classes = createBinding(niri, "focusedWorkspace").as((focused) => {
    const classes = ["workspace"]

    if (focused.id === workspace.id) {
      classes.push("active")
    }

    return classes
  })

  return (
    <box cssClasses={classes} hexpand={false}>
      <label label={workspace.idx.toString()} hexpand />
      <Gtk.GestureClick
        onPressed={(ctrl) => {
          const button = ctrl.get_current_button()
          if (button === Gdk.BUTTON_PRIMARY) workspace.focus()
        }}
      />
    </box>
  )
}
