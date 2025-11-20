import AstalNotifd from "gi://AstalNotifd"
import { createBinding } from "ags"
import { Config } from "@/config"
import BarItem from "../BarItem"

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
      <image iconName={icon} pixelSize={Config.sizing.indicatorIcon} />
      <label visible={visible} label={label} />
    </BarItem>
  )
}
