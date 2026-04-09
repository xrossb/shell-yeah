import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding, createComputed } from "gnim"
import BarItem from "@/src/components/BarItem"
import Icon from "@/src/components/Icon"
import { icons } from "@/src/lib/icons"

export default function Audio() {
  const wp = AstalWp.get_default()
  const volume = createBinding(wp.defaultSpeaker, "volume")
  const mute = createBinding(wp.defaultSpeaker, "mute")
  const icon = createComputed(() => {
    if (mute()) return icons.volume.off
    return icons.volume.byPercent(volume())
  })

  return (
    <BarItem>
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("audio-menu")}
      />
      <Icon icon={icon} />
    </BarItem>
  )
}
