import { Gtk } from "ags/gtk4"
import { CCProps } from "gnim"

export default function BarItem(
  props: CCProps<Gtk.Box, Partial<Gtk.Box.ConstructorProps>>
) {
  return <box class="bar-item" {...props} />
}
