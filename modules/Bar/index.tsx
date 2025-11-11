import { Astal, Gdk } from "ags/gtk4"
import Clock from "./widgets/Clock"
import Tray from "./widgets/Tray"
import NiriWorkspaces from "./widgets/NiriWorkspaces"
import Battery from "./widgets/Battery"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
    >
      <centerbox heightRequest={30}>
        <box class="left" $type="start" spacing={16}>
          <NiriWorkspaces gdkmonitor={gdkmonitor} />
        </box>
        <box class="center" $type="center" spacing={16}>
          <Clock />
        </box>
        <box class="right" $type="end" spacing={16}>
          <Tray />
          <Battery />
        </box>
      </centerbox>
    </window>
  )
}
