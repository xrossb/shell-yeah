import { Astal, Gdk } from "ags/gtk4"
import Clock from "./widgets/Clock"
import Tray from "./widgets/Tray"
import NiriWorkspaces from "./widgets/NiriWorkspaces"

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
        <box class="left" $type="start">
          <NiriWorkspaces gdkmonitor={gdkmonitor} />
        </box>
        <box class="center" $type="center">
          <Clock />
        </box>
        <box class="right" $type="end">
          <Tray />
        </box>
      </centerbox>
    </window>
  )

  // return (
  //   <window
  //     visible
  //     name="bar"
  //     class="Bar"
  //     gdkmonitor={gdkmonitor}
  //     exclusivity={Astal.Exclusivity.EXCLUSIVE}
  //     anchor={TOP | LEFT | RIGHT}
  //     application={app}
  //   >
  //     <centerbox cssName="centerbox">
  //       <button
  //         $type="start"
  //         onClicked={() => execAsync("echo hello").then(console.log)}
  //         hexpand
  //         halign={Gtk.Align.CENTER}
  //       >
  //         <label label="Welcome to AGS!" />
  //       </button>
  //       <box $type="center" />
  //       <menubutton $type="end" hexpand halign={Gtk.Align.CENTER}>
  //         <label label={time} />
  //         <popover>
  //           <Gtk.Calendar />
  //         </popover>
  //       </menubutton>
  //     </centerbox>
  //   </window>
  // )
}
