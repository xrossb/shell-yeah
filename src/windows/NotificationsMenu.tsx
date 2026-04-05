import { Gdk } from "ags/gtk4"
import Window from "../components/Window"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import { createBinding, createComputed, createState } from "ags"

const name = "notifications_menu"

/**
 * Notifications modal.
 */
export default function NotificationsMenu() {
  const notifd = AstalNotifd.get_default()

  const [notifications, setNotifications] = createState<
    Array<AstalNotifd.Notification>
  >([])

  const dontDisturb = createBinding(notifd, "dont_disturb")

  const visible = createComputed(
    () => !dontDisturb() && !!notifications().length,
  )

  return <Window visible={visible} name={name} namespace={name}></Window>
}
