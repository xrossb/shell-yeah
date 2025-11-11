import { Gtk } from "ags/gtk4"
import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"

const format = "%a, %d %b · %I:%M %p"

export default function Clock() {
  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format(format) || ""
  )

  return (
    <box>
      <label label={time} />
    </box>
  )
}
