import { Accessor, Node, createState } from "ags"
import { Gdk, Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import GLib from "gi://GLib?version=2.0"
import Gio from "gi://Gio?version=2.0"
import Pango from "gi://Pango?version=1.0"
import { icons } from "@/src/lib/icons"

export type Props = {
  n: AstalNotifd.Notification
  onDismiss: (n: AstalNotifd.Notification) => void
}

export default function Notification({ n, onDismiss }: Props) {
  const { VERTICAL } = Gtk.Orientation
  const [closeVisible, setCloseVisible] = createState(false)

  return (
    <overlay class="notification">
      <Gtk.EventControllerMotion
        onEnter={() => setCloseVisible(true)}
        onLeave={() => setCloseVisible(false)}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onReleased={() => n.actions.find((a) => a.id === "default")?.invoke()}
      />
      <box orientation={VERTICAL} widthRequest={400} spacing={8}>
        <box spacing={8}>
          {NotificationIcon(n)}
          <box orientation={VERTICAL}>
            {Header(n)}
            {TextContent(n)}
          </box>
        </box>
        {Actions(n)}
      </box>
      {Close(closeVisible, () => onDismiss(n))}
    </overlay>
  )
}

function NotificationIcon(n: AstalNotifd.Notification) {
  function clamp(children: Node) {
    return (
      <Adw.Clamp maximumSize={32} valign={Gtk.Align.START}>
        {children}
      </Adw.Clamp>
    )
  }

  if (n.image && isFile(n.image)) {
    return clamp(
      <Gtk.Picture
        contentFit={Gtk.ContentFit.CONTAIN}
        file={Gio.file_new_for_path(n.image)}
      />,
    )
  }

  const icon = n.appIcon || n.desktopEntry
  if (isIcon(icon)) {
    return clamp(<image iconName={icon} pixelSize={32} />)
  }
}

function Header(n: AstalNotifd.Notification) {
  const time = GLib.DateTime.new_from_unix_local(n.time).format("%I:%M %P")
  const summary = n.summary.replace(n.appName, "")
  const parts = [time, n.appName, summary].filter((x) => x)
  return (
    <label
      class="header"
      halign={Gtk.Align.START}
      ellipsize={Pango.EllipsizeMode.END}
      label={parts.join(" · ")}
    />
  )
}

function TextContent(n: AstalNotifd.Notification) {
  return (
    <label
      class="body"
      visible={!!n.body}
      halign={Gtk.Align.FILL}
      xalign={0}
      wrap
      wrapMode={Pango.WrapMode.WORD_CHAR}
      label={n.body}
    />
  )
}

function Actions(n: AstalNotifd.Notification) {
  const actions = n.actions.filter((action) => action.id !== "default")
  return (
    <box class="actions" visible={!!actions.length} spacing={8} homogeneous>
      {actions.map((action) => (
        <button onClicked={() => action.invoke()}>
          <label label={action.label} />
        </button>
      ))}
    </box>
  )
}

function Close(visible: Accessor<boolean>, onClick: () => void) {
  return (
    <button
      $type="overlay"
      class="close"
      visible={visible}
      onClicked={onClick}
      halign={Gtk.Align.END}
      valign={Gtk.Align.START}
    >
      <image pixelSize={16} iconName={icons.close} />
    </button>
  )
}

let iconTheme: Gtk.IconTheme
function isIcon(name: string) {
  if (!iconTheme) {
    iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
  }
  return !!name && iconTheme.has_icon(name)
}

function isFile(path: string) {
  return GLib.file_test(path, GLib.FileTest.EXISTS)
}
