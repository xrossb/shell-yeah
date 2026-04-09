import BarItem from "@/src/components/BarItem"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Icon from "../Icon"

export default function Launcher() {
  return (
    <BarItem>
      <Icon icon="sy-launcher" />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("launcher")}
      />
    </BarItem>
  )
}
