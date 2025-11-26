import AstalNotifd from "gi://AstalNotifd"
import { createBinding } from "ags"
import { Config } from "@/config"
import BarItem from "../BarItem"
import { Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"

const notifd = AstalNotifd.get_default()

export default function NotificationIndicator() {
  const count = createBinding(notifd, "notifications").as((n) => n.length)

  const visible = count.as((c) => !!c)
  const label = count.as((c) => (c > 99 ? "99+" : c.toString()))
  const icon = count.as((c) =>
    c ? "sy-notifications-unread-symbolic" : "sy-notifications-symbolic"
  )

  return (
    <BarItem spacing={Config.spacing.small}>
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => {
          const window = app.get_window("notifications")
          if (!window) {
            return
          }
          if (window.visible) {
            window.hide()
          } else {
            window.show()
          }
        }}
      />
      <image iconName={icon} pixelSize={Config.sizing.indicatorIcon} />
      <label visible={visible} label={label} />
    </BarItem>
  )
}
