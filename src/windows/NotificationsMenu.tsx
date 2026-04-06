import { Accessor, createBinding, For } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import Notification from "../components/Notification"
import Popup from "../components/Popup"

const name = "notifications-menu"

/**
 * Notifications modal.
 */
export default function NotificationsMenu() {
  const notifd = AstalNotifd.get_default()
  const ns = createBinding(notifd, "notifications").as((ns) =>
    ns.sort((a, b) => b.time - a.time),
  )

  return (
    <Popup
      name={name}
      namespace={name}
      anchor={Astal.WindowAnchor.TOP}
      width={400}
      height={500}
      margin={8}
      onNotifyVisible={() => app.get_window("notifications-popup")?.hide()}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        {NotificationList(ns)}
        {Empty(ns)}
      </box>
    </Popup>
  )
}

function NotificationList(ns: Accessor<AstalNotifd.Notification[]>) {
  return (
    <scrolledwindow
      propagateNaturalHeight
      hscrollbarPolicy={Gtk.PolicyType.NEVER}
      visible={ns((ns) => ns.length !== 0)}
    >
      <box class={"list"} orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <For each={ns}>
          {(n) => <Notification n={n} onDismiss={() => n.dismiss()} />}
        </For>
      </box>
    </scrolledwindow>
  )
}

function Empty(ns: Accessor<AstalNotifd.Notification[]>) {
  return (
    <label
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      vexpand
      visible={ns((ns) => ns.length === 0)}
      label="all caught up!"
    />
  )
}
