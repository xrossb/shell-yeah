import { Astal, Gdk, Gtk } from "ags/gtk4"
import AstalNotifd from "gi://AstalNotifd"
import { createBinding, createState, State, With } from "ags"
import Pango from "gi://Pango"
import AstalApps from "gi://AstalApps"
import Gio from "gi://Gio"
import Adw from "gi://Adw"
import GLib from "gi://GLib"
import { Config } from "@/config"
import Modal from "@/components/Modal"

const apps = new AstalApps.Apps()

export default function NotificationList(props: { open: State<boolean> }) {
  const { TOP, RIGHT } = Astal.WindowAnchor

  const notifd = AstalNotifd.get_default()
  const notifications = createBinding(notifd, "notifications").as((n) =>
    n.sort((a, b) => b.time - a.time)
  )

  return (
    <Modal anchor={TOP | RIGHT} open={props.open} class="notification-modal">
      <scrolledwindow
        propagateNaturalHeight
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        widthRequest={320}
      >
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          class="container"
          css="padding: 8px;"
        >
          <With value={notifications}>
            {(notifications) => {
              if (notifications.length) {
                return (
                  <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
                    {notifications.map(Notification)}
                  </box>
                )
              }

              return <label label="all caught up!" />
            }}
          </With>
        </box>
      </scrolledwindow>
    </Modal>
  )
}

function Notification(n: AstalNotifd.Notification) {
  const classes = ["notification"]
  if (n.urgency === AstalNotifd.Urgency.CRITICAL) {
    classes.push("urgent")
  }

  const [closeVisible, setCloseVisible] = createState(false)

  return (
    <overlay cssClasses={classes}>
      <Gtk.EventControllerMotion
        onEnter={() => setCloseVisible(true)}
        onLeave={() => setCloseVisible(false)}
      />
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        {n.actions.length === 1 && (
          <Gtk.GestureClick
            button={Gdk.BUTTON_PRIMARY}
            onReleased={() => n.actions[0].invoke()}
          />
        )}
        <box spacing={8}>
          {NotificationIcon(n)}
          <box orientation={Gtk.Orientation.VERTICAL} heightRequest={30}>
            {n.appName && (
              <label
                class="header"
                halign={Gtk.Align.START}
                label={n.appName}
                ellipsize={Pango.EllipsizeMode.END}
              />
            )}
            {n.summary && (
              <label
                class="header"
                halign={Gtk.Align.START}
                label={n.summary}
                ellipsize={Pango.EllipsizeMode.END}
              />
            )}
            <label xalign={0} label={n.body} wrap />
          </box>
        </box>
        {n.actions.length > 1 && (
          <box spacing={8}>
            {n.actions.map((action) => (
              <button
                label={action.label}
                onClicked={() => action.invoke()}
                hexpand
              />
            ))}
          </box>
        )}
      </box>
      <image
        $type="overlay"
        visible={closeVisible}
        pixelSize={Config.icon.size.indicator}
        iconName="sy-close-symbolic"
        halign={Gtk.Align.END}
        valign={Gtk.Align.START}
        class="icon-button"
      >
        <Gtk.GestureClick
          button={Gdk.BUTTON_PRIMARY}
          onReleased={() => n.dismiss()}
        />
      </image>
    </overlay>
  )
}

function NotificationIcon(n: AstalNotifd.Notification) {
  if (n.image && isFile(n.image)) {
    return (
      <Adw.Clamp maximumSize={32} valign={Gtk.Align.START}>
        <Gtk.Picture
          class={"image"}
          contentFit={Gtk.ContentFit.CONTAIN}
          file={Gio.file_new_for_path(n.image)}
        />
      </Adw.Clamp>
    )
  }

  if (n.appIcon) {
    const icon = Gio.Icon.new_for_string(n.appIcon)
    return <image gicon={icon} pixelSize={32} valign={Gtk.Align.START} />
  }

  const id = n.desktopEntry || n.appName
  if (!id) {
    return
  }

  const app = apps.list.find((app) => {
    return (
      app.entry?.toLowerCase() === id ||
      app.iconName?.toLowerCase() === id ||
      app.name?.toLowerCase() === id ||
      app.wmClass?.toLowerCase() === id
    )
  })

  if (app && app.iconName) {
    const icon = Gio.Icon.new_for_string(app.iconName)
    return <image gicon={icon} pixelSize={32} valign={Gtk.Align.START} />
  }
}

function isFile(path: string) {
  return GLib.file_test(path, GLib.FileTest.EXISTS)
}
