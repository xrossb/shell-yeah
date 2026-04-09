import { createBinding, createComputed, For } from "ags"
import { Gdk, Gtk } from "ags/gtk4"
import AstalNiri from "gi://AstalNiri?version=0.1"

export type Props = {
  monitor: Gdk.Monitor
}

export default function Workspaces({ monitor }: Props) {
  const niri = AstalNiri.get_default()
  const outputs = createBinding(niri, "outputs").as((outputs) =>
    outputs.filter((output) => output.model === monitor.model),
  )

  return (
    <box name="workspaces">
      <For each={outputs}>{(out) => <Output output={out} />}</For>
    </box>
  )
}

function Output(props: { output: AstalNiri.Output }) {
  const workspaces = createBinding(props.output, "workspaces")

  return (
    <box class="output">
      <For each={workspaces}>{(ws) => <Workspace workspace={ws} />}</For>
    </box>
  )
}

function Workspace({ workspace }: { workspace: AstalNiri.Workspace }) {
  const niri = AstalNiri.get_default()
  const focused = createBinding(niri, "focusedWorkspace")
  const windows = createBinding(workspace, "windows")
  const classes = createComputed(() => {
    const classes = ["workspace"]
    if (focused().id === workspace.id) {
      classes.push("active")
    }
    if (!windows().length) {
      classes.push("empty")
    }
    return classes
  })

  return (
    <box cssClasses={classes}>
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => workspace.focus()}
      />
      <label
        label={workspace.idx.toString()}
        valign={Gtk.Align.BASELINE_CENTER}
      />
    </box>
  )
}
