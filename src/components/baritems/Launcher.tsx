import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import BarItem from "@/src/components/BarItem"
import Icon from "@/src/components/Icon"
import { icons } from "@/src/lib/icons"

export default function Launcher() {
  return (
    <BarItem>
      <Icon icon={icons.search} />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("launcher")}
      />
    </BarItem>
  )
}
