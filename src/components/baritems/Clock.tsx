import { createBinding, createComputed } from "ags"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { createPoll } from "ags/time"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import GLib from "gi://GLib?version=2.0"
import BarItem from "@/src/components/BarItem"
import Icon from "@/src/components/Icon"
import { icons } from "@/src/lib/icons"
import { config } from "@/src/lib/options"

export default function Clock() {
  const notifd = AstalNotifd.get_default()
  const dontDisturb = createBinding(notifd, "dontDisturb")
  const unreads = createBinding(notifd, "notifications").as((n) => n.length)
  const notifIcon = createComputed(() => {
    if (dontDisturb()) return icons.notifications.off
    if (unreads()) return icons.notifications.unread
  })

  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format(config.clock.format) || "",
  )

  return (
    <BarItem name="clock" spacing={8}>
      <label label={time} valign={Gtk.Align.BASELINE_CENTER} />
      <Icon
        visible={notifIcon.as((i) => !!i)}
        icon={notifIcon.as((i) => i || "")}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => app.toggle_window("notifications-menu")}
      />
    </BarItem>
  )
}
