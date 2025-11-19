import AstalNotifd from "gi://AstalNotifd"
import { createBinding, With } from "ags"
import { Config } from "@/config"
import BarItem from "../BarItem"

const notifd = AstalNotifd.get_default()

export default function NotificationIndicator() {
  const notifications = createBinding(notifd, "notifications")

  return (
    <BarItem spacing={Config.spacing.small}>
      <image
        iconName={notifications((n) =>
          n.length
            ? "sy-notifications-unread-symbolic"
            : "sy-notifications-symbolic"
        )}
        pixelSize={Config.sizing.indicatorIcon}
      />
      <With value={notifications}>
        {(notifications) => (
          <label
            visible={!!notifications.length}
            label={
              notifications.length > 99
                ? "99+"
                : notifications.length.toString()
            }
          />
        )}
      </With>
    </BarItem>
  )
}
