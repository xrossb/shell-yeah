import AstalNotifd from "gi://AstalNotifd"
import { createBinding, For } from "ags"

const notifd = AstalNotifd.get_default()

export default function NotificationIndicator() {
  const notifications = createBinding(notifd, "notifications")

  return (
    <menubutton>
      <box spacing={4}>
        <image
          iconName={notifications((n) =>
            n.length
              ? "sy-notifications-unread-symbolic"
              : "sy-notifications-symbolic"
          )}
          pixelSize={20}
        />
        <label
          label={notifications((n) =>
            n.length > 99 ? "99+" : n.length.toString()
          )}
        />
      </box>
    </menubutton>
  )
}
