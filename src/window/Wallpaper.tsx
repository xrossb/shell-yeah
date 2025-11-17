import { Astal, Gdk } from "ags/gtk4"

export default function Wallpaper(monitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="wallpaper"
      namespace="wallpaper"
      gdkmonitor={monitor}
      layer={Astal.Layer.BACKGROUND}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
    />
  )
}
