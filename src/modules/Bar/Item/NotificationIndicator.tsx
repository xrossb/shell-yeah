import AstalNotifd from "gi://AstalNotifd"
import { createBinding, createState } from "ags"
import { Config } from "@/config"
import BarItem from "../BarItem"
import { Gdk, Gtk } from "ags/gtk4"
import NotificationList from "@/modules/NotificationList"

const notifd = AstalNotifd.get_default()

export default function NotificationIndicator() {
  const count = createBinding(notifd, "notifications").as((n) => n.length)

  const visible = count.as((c) => !!c)
  const label = count.as((c) => (c > 99 ? "99+" : c.toString()))
  const icon = count.as((c) =>
    c ? "sy-notifications-unread-symbolic" : "sy-notifications-symbolic"
  )

  const open = createState(false)
  const [getOpen, setOpen] = open

  return (
    <BarItem spacing={Config.spacing.small}>
      <NotificationList open={open} />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={() => {
          setOpen(!getOpen.get())
        }}
      />
      <image iconName={icon} pixelSize={Config.sizing.indicatorIcon} />
      <label visible={visible} label={label} />
    </BarItem>
  )
}
