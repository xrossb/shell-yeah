import { createBinding, createComputed } from "ags"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { createPoll } from "ags/time"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import BarItem from "@/src/components/BarItem"
import Icon from "../Icon"

const lang = Gtk.get_default_language().to_string()
const format = new Intl.DateTimeFormat(lang, {
  month: "short",
  day: "numeric",
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
})
const icons = {
  off: "sy-notifications-off",
  unread: "sy-notifications-unread",
}

export default function Clock() {
  const notifd = AstalNotifd.get_default()
  const dontDisturb = createBinding(notifd, "dontDisturb")
  const unreads = createBinding(notifd, "notifications").as(n => n.length)
  const notifIcon = createComputed(() => {
    if (dontDisturb()) return icons.off
    if (unreads()) return icons.unread
  })

  const time = createPoll("", 1000, () =>
    format.format(Temporal.Now.plainDateTimeISO()),
  )

  return (
    <BarItem name="clock" spacing={8}>
      <label label={time} valign={Gtk.Align.BASELINE_CENTER} />
      <Icon
        visible={notifIcon.as(i => !!i)}
        icon={notifIcon.as(i => i || "")}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("notifications-menu")}
      />
    </BarItem>
  )
}
