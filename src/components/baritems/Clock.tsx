import BarItem from "@/src/components/BarItem"
import Symbol from "@/src/components/Symbol"
import { createBinding, createComputed } from "ags"
import { createPoll } from "ags/time"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import GLib from "gi://GLib?version=2.0"

const format = "%a, %d %b · %I:%M %P"
const glyphs = {
  off: "\ue7f6",
  unread: "\uf4fe",
}

export default function Clock() {
  const notifd = AstalNotifd.get_default()
  const dontDisturb = createBinding(notifd, "dontDisturb")
  const unreads = createBinding(notifd, "notifications").as((n) => n.length)
  const notifGlyph = createComputed(() => {
    if (dontDisturb()) return glyphs.off
    if (unreads()) return glyphs.unread
  })

  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format(format) || "",
  )

  return (
    <BarItem name="clock" spacing={8}>
      <label label={time} />
      <Symbol
        visible={notifGlyph.as((glyph) => !!glyph)}
        glyph={notifGlyph.as((glyph) => glyph || "")}
      />
    </BarItem>
  )
}
