import { Astal, Gtk } from "ags/gtk4"
import Popup from "../components/Popup"

const name = "audio-menu"

/**
 * Audio settings modal.
 */
export default function AudioMenu() {
  const { TOP, RIGHT } = Astal.WindowAnchor
  return (
    <Popup
      name={name}
      namespace={name}
      width={300}
      anchor={TOP | RIGHT}
      margin={8}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <Gtk.DropDown model={Gtk.StringList.new(["hello", "world"])} />
        <slider />
        <Gtk.DropDown model={Gtk.StringList.new(["hello", "world"])} />
        <slider />
      </box>
    </Popup>
  )
}
