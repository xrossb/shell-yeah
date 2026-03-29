import BarItem from "@/src/components/BarItem"
import Symbol from "@/src/components/Symbol"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"

const glyph = "\ue8b6"

export default function Launcher() {
  return (
    <BarItem>
      <Symbol glyph={glyph} />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("launcher")}
      />
    </BarItem>
  )
}
