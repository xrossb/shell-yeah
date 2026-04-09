import BarItem from "@/src/components/BarItem"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding, createComputed } from "gnim"
import Icon from "../Icon"

export default function Audio() {
  const wp = AstalWp.get_default()
  const volume = createBinding(wp.defaultSpeaker, "volume")
  const mute = createBinding(wp.defaultSpeaker, "mute")
  const icon = createComputed(() => {
    if (mute()) return "sy-volume-off"
    if (volume() <= 0.25) return "sy-volume-low"
    if (volume() <= 0.5) return "sy-volume-mid"
    return "sy-volume-high"
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
