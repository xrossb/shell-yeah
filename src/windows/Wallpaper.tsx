import { datadir } from "@/app"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Gio from "gi://Gio?version=2.0"
import Window from "@/src/components/Window"

const name = "wallpaper"

export type Props = {
  monitor: Gdk.Monitor
}

/**
 * Desktop background for the shell.
 */
export default function Wallpaper({ monitor }: Props) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const wallpaper = Gio.File.new_for_path(`${datadir}/wallpaper.jpg`)

  return (
    <Window
      visible
      name={name}
      namespace={name}
      gdkmonitor={monitor}
      layer={Astal.Layer.BACKGROUND}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
    >
      <Gtk.Picture
        file={wallpaper}
        contentFit={Gtk.ContentFit.COVER}
        canShrink
        hexpand
        vexpand
      />
    </Window>
  )
}
