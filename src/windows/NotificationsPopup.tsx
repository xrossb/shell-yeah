import { For, createBinding, createComputed, createState, onCleanup } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import GLib from "gi://GLib?version=2.0"
import Notification from "../components/Notification"
import Window from "../components/Window"

const name = "notifications-popup"

/**
 * Display for incoming notifications.
 */
export default function NotificationsPopup() {
  const notifd = AstalNotifd.get_default()

  const [notifications, setNotifications] = createState<
    Array<AstalNotifd.Notification>
  >([])

  const dontDisturb = createBinding(notifd, "dont_disturb")

  const notifiedHandle = notifd.connect("notified", (_, id, replaced) => {
    const notification = notifd.get_notification(id)!
    if (replaced && notifications.peek().some((n) => n.id === id)) {
      setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)))
    } else {
      setNotifications((ns) => [notification, ...ns])
    }
  })
  onCleanup(() => notifd.disconnect(notifiedHandle))

  const resolvedHandle = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })
  onCleanup(() => notifd.disconnect(resolvedHandle))

  const visible = createComputed(
    () => !dontDisturb() && !!notifications().length,
  )

  return (
    <Window
      visible={visible}
      name={name}
      namespace={name}
      anchor={Astal.WindowAnchor.TOP}
      resizable={false}
    >
      <Adw.Clamp maximumSize={400} widthRequest={400}>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
          <For each={notifications}>
            {(notification) =>
              PopupNotification(notification, (hide) =>
                setNotifications((ns) =>
                  ns.filter((existing) => existing.id !== hide.id),
                ),
              )
            }
          </For>
        </box>
      </Adw.Clamp>
    </Window>
  )
}

function PopupNotification(
  notification: AstalNotifd.Notification,
  onHide: (notification: AstalNotifd.Notification) => void,
) {
  let timeout: GLib.Source
  let resumeTime: number
  let timeLeft = 5000

  function pause() {
    timeout.destroy()
    timeLeft -= Date.now() - resumeTime
  }

  function resume() {
    timeout = setTimeout(() => {
      onHide(notification)
    }, timeLeft)
    resumeTime = Date.now()
  }

  resume()
  return (
    <box>
      <Gtk.EventControllerMotion
        onEnter={() => pause()}
        onLeave={() => resume()}
      />
      <Notification n={notification} onDismiss={onHide} />
    </box>
  )
}
