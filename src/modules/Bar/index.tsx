import { Astal, Gdk, Gtk } from "ags/gtk4"
import Clock from "./Item/Clock"
import Tray from "./Item/Tray"
import NiriWorkspaces from "./Item/NiriWorkspaces"
import BatteryIndicator from "./Item/BatteryIndicator"
import NotificationIndicator from "./Item/NotificationIndicator"
import { createState } from "gnim"
import { Config } from "@/config"
import NetworkIndicator from "./Item/NetworkIndicator"
import VolumeIndicator from "./Item/VolumeIndicator"
import BluetoothIndicator from "./Item/BluetoothIndicator"
import BarItem from "./BarItem"

export default function Bar(props: { monitor: Gdk.Monitor }) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  const [revealed, setRevealed] = createState(false)

  return (
    <window
      visible
      name={Config.windowName.bar}
      gdkmonitor={props.monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      anchor={TOP | LEFT | RIGHT}
      $={() => setRevealed(true)}
    >
      <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={Config.animation.short}
        revealChild={revealed}
      >
        <centerbox heightRequest={Config.sizing.bar}>
          <BarStart gdkmonitor={props.monitor} />
          <BarCenter />
          <BarEnd />
        </centerbox>
      </revealer>
    </window>
  )
}

function BarStart({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  return (
    <box class="left" $type="start" spacing={Config.spacing.mid}>
      <NiriWorkspaces gdkmonitor={gdkmonitor} />
    </box>
  )
}

function BarCenter() {
  return (
    <box class="center" $type="center" spacing={Config.spacing.mid}>
      <Clock />
    </box>
  )
}

function BarEnd() {
  return (
    <box class="right" $type="end" spacing={Config.spacing.mid}>
      <Tray />
      <BatteryIndicator />
      <NotificationIndicator />
      <BarItem spacing={Config.spacing.small}>
        <NetworkIndicator />
        <BluetoothIndicator />
        <VolumeIndicator />
      </BarItem>
    </box>
  )
}
