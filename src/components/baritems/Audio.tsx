import BarItem from "@/src/components/BarItem"
import Icon from "../Icon"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"

export default function Audio() {
  return (
    <BarItem>
      <Icon icon="sy-volume-high" />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("audio-menu")}
      />
    </BarItem>
  )
}
