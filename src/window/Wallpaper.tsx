import { Config } from "@/config"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import GdkPixbuf from "gi://GdkPixbuf?version=2.0"
import Gio from "gi://Gio"
import { createState } from "gnim"

export default function Wallpaper(monitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const [reveal, setReveal] = createState(false)
  const wallpaper = new Gtk.Picture({
    contentFit: Gtk.ContentFit.COVER,
    canShrink: true,
    hexpand: true,
    vexpand: true,
  })

  return (
    <window
      visible
      name="wallpaper"
      namespace="wallpaper"
      gdkmonitor={monitor}
      layer={Astal.Layer.BACKGROUND}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      $={() => {
        const file = Gio.File.new_for_path(`${SRC}/assets/wallpaper.png`)
        file.load_bytes_async(null, (file, res) => {
          const [bytes, _] = file!.load_bytes_finish(res)
          const loader = new GdkPixbuf.PixbufLoader()
          loader.write_bytes(bytes)
          loader.close()
          wallpaper.set_pixbuf(loader.get_pixbuf())
          setReveal(true)
        })
      }}
    >
      <revealer
        revealChild={reveal}
        transitionType={Gtk.RevealerTransitionType.CROSSFADE}
        transitionDuration={Config.animation.long}
      >
        {wallpaper}
      </revealer>
    </window>
  )
}
