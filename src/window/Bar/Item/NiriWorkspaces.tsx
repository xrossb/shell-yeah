import { Gdk, Gtk } from "ags/gtk4"
import AstalNiri from "gi://AstalNiri"
import { createBinding, For } from "ags"
import { Config } from "@/config"
import AstalApps from "gi://AstalApps"
import { Process } from "ags/process"

const apps = new AstalApps.Apps()
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
    <box spacing={16}>
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

  const windows = createBinding(workspace, "windows")

  return (
    <box cssClasses={classes} spacing={8} hexpand={false}>
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => workspace.focus()}
      />
      <label label={workspace.idx.toString()} hexpand />
      <For each={windows}>{(window) => <WindowButton window={window} />}</For>
    </box>
  )
}

function WindowButton({ window }: { window: AstalNiri.Window }) {
  const app = apps.list.find((app) => {
    const id = window.appId.toLowerCase()
    return (
      app.entry?.toLowerCase() === id ||
      app.iconName?.toLowerCase() === id ||
      app.name?.toLowerCase() === id ||
      app.wmClass?.toLowerCase() === id
    )
  })

  return (
    <box>
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => window.focus(window.id)}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_MIDDLE}
        onPressed={() =>
          Process.exec(`niri msg action close-window --id ${window.id}`)
        }
      />
      <image
        tooltipText={window.title}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        iconName={app?.iconName}
        pixelSize={Config.sizing.trayIcon}
      />
    </box>
  )
}
