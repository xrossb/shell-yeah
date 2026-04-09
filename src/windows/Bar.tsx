import { Astal, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Window from "@/src/components/Window"
import Audio from "@/src/components/baritems/Audio"
import Battery from "@/src/components/baritems/Battery"
import Bluetooth from "@/src/components/baritems/Bluetooth"
import Clock from "@/src/components/baritems/Clock"
import Launcher from "@/src/components/baritems/Launcher"
import Network from "@/src/components/baritems/Network"
import Power from "@/src/components/baritems/Power"
import Tray from "@/src/components/baritems/Tray"
import Workspaces from "@/src/components/baritems/Workspaces"

export const name = "bar"

export type Props = {
  monitor: Gdk.Monitor
}

/**
 * Main bar for the shell.
 */
export default function Bar({ monitor }: Props) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <Window
      visible
      name={name}
      namespace={name}
      gdkmonitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      anchor={TOP | LEFT | RIGHT}
    >
      <centerbox name="bar">
        <Start monitor={monitor} />
        <Center />
        <End />
      </centerbox>
    </Window>
  )
}

function Start({ monitor }: Props) {
  return (
    <box $type="start" class="bar-start">
      <Launcher />
      <Workspaces monitor={monitor} />
    </box>
  )
}

function Center() {
  return (
    <box $type="center" class="bar-center">
      <Clock />
    </box>
  )
}

function End() {
  return (
    <box $type="end" class="bar-end">
      <Tray />
      <Battery />
      <Audio />
      <Bluetooth />
      <Network />
      <Power />
    </box>
  )
}

export function height() {
  return app.get_window(name)?.get_height() || 0
}
