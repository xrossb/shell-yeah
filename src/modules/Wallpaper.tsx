import { Config } from "@/config"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Gio from "gi://Gio"
import { datadir } from "../../app"

export default function Wallpaper(monitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  let revealer: Gtk.Revealer

  const wallpaper = Gio.File.new_for_path(`${datadir}/wallpaper.png`)

  return (
    <window
      visible
      name="wallpaper"
      namespace="wallpaper"
      gdkmonitor={monitor}
      layer={Astal.Layer.BACKGROUND}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      $={() => (revealer.revealChild = true)}
    >
      <revealer
        transitionType={Gtk.RevealerTransitionType.CROSSFADE}
        transitionDuration={Config.animation.long}
        $={(self) => (revealer = self)}
      >
        <Gtk.Overlay>
          <Gtk.Picture
            file={wallpaper}
            contentFit={Gtk.ContentFit.COVER}
            canShrink
            hexpand
            vexpand
          />
          <box $type="overlay" class="vignette" hexpand vexpand />
        </Gtk.Overlay>
      </revealer>
    </window>
  )
}
