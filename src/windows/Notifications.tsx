import { createBinding, createComputed, createState, For, onCleanup } from "ags"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import Window from "../components/Window"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Pango from "gi://Pango?version=1.0"
import Gio from "gi://Gio?version=2.0"
import Adw from "gi://Adw?version=1"
import AstalApps from "gi://AstalApps?version=0.1"
import GLib from "gi://GLib?version=2.0"
import app from "ags/gtk4/app"

const name = "notifications_menu"

/**
 * Display for incoming notifications.
 */
export default function Notifications() {
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
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <For each={notifications}>{Notification}</For>
      </box>
    </Window>
  )
}

function Notification(n: AstalNotifd.Notification) {
  const { VERTICAL } = Gtk.Orientation
  return (
    <box orientation={VERTICAL}>
      <box>
        {AppIcon(n)}
        <box orientation={VERTICAL}>
          {Header(n)}
          {TextContent(n)}
        </box>
      </box>
      {ImageContent(n)}
      {Actions(n)}
    </box>
  )
}

function AppIcon(n: AstalNotifd.Notification) {
  const icon = n.appIcon || n.desktopEntry

  if (isFile(icon)) {
    return (
      <Adw.Clamp maximumSize={32}>
        <Gtk.Picture
          contentFit={Gtk.ContentFit.CONTAIN}
          file={Gio.file_new_for_path(n.image)}
        />
      </Adw.Clamp>
    )
  }

  return isIcon(icon) && <image iconName={icon} iconSize={Gtk.IconSize.LARGE} />
}

function Header(n: AstalNotifd.Notification) {
  const parts = [n.time, n.appName, n.summary].filter((x) => x)
  return <label ellipsize={Pango.EllipsizeMode.END} label={parts.join(" · ")} />
}

function TextContent(n: AstalNotifd.Notification) {
  return (
    <label
      visible={!!n.body}
      halign={Gtk.Align.START}
      wrap
      wrapMode={Pango.WrapMode.WORD_CHAR}
      label={n.body}
    />
  )
}

function ImageContent(n: AstalNotifd.Notification) {
  return isFile(n.image) && <image file={n.image} />
}

function Actions(n: AstalNotifd.Notification) {
  const actions = n.actions.filter((action) => action.id !== "default")
  return (
    <box visible={!!actions.length}>
      {actions.map((action) => (
        <button onClicked={() => n.invoke(action.id)}>
          <label hexpand label={action.label} />
        </button>
      ))}
    </box>
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

// function Notification(n: AstalNotifd.Notification) {
//   const classes = ["notification"]
//   if (n.urgency === AstalNotifd.Urgency.CRITICAL) {
//     classes.push("urgent")
//   }

//   const [closeVisible, setCloseVisible] = createState(false)

//   return (
//     <overlay cssClasses={classes}>
//       <Gtk.EventControllerMotion
//         onEnter={() => setCloseVisible(true)}
//         onLeave={() => setCloseVisible(false)}
//       />
//       <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
//         {n.actions.length === 1 && (
//           <Gtk.GestureClick
//             button={Gdk.BUTTON_PRIMARY}
//             onReleased={() => n.actions[0].invoke()}
//           />
//         )}
//         <box spacing={8}>
//           {NotificationIcon(n)}
//           <box orientation={Gtk.Orientation.VERTICAL} heightRequest={30}>
//             {n.appName && (
//               <label
//                 class="header"
//                 halign={Gtk.Align.START}
//                 label={n.appName}
//                 ellipsize={Pango.EllipsizeMode.END}
//               />
//             )}
//             {n.summary && (
//               <label
//                 class="header"
//                 halign={Gtk.Align.START}
//                 label={n.summary}
//                 ellipsize={Pango.EllipsizeMode.END}
//               />
//             )}
//             <label xalign={0} label={n.body} wrap />
//           </box>
//         </box>
//         {n.actions.length > 1 && (
//           <box spacing={8}>
//             {n.actions.map((action) => (
//               <button
//                 label={action.label}
//                 onClicked={() => action.invoke()}
//                 hexpand
//               />
//             ))}
//           </box>
//         )}
//       </box>
//       {/* <image
//         $type="overlay"
//         visible={closeVisible}
//         pixelSize={Config.icon.size.indicator}
//         iconName="sy-close-symbolic"
//         halign={Gtk.Align.END}
//         valign={Gtk.Align.START}
//         class="icon-button"
//       >
//         <Gtk.GestureClick
//           button={Gdk.BUTTON_PRIMARY}
//           onReleased={() => n.dismiss()}
//         />
//       </image> */}
//     </overlay>
//   )
// }

// function NotificationIcon(n: AstalNotifd.Notification) {
//   const apps = new AstalApps.Apps()

//   if (n.image && isFile(n.image)) {
//     return (
//       <Adw.Clamp maximumSize={32} valign={Gtk.Align.START}>
//         <Gtk.Picture
//           class={"image"}
//           contentFit={Gtk.ContentFit.CONTAIN}
//           file={Gio.file_new_for_path(n.image)}
//         />
//       </Adw.Clamp>
//     )
//   }

//   if (n.appIcon) {
//     const icon = Gio.Icon.new_for_string(n.appIcon)
//     return <image gicon={icon} pixelSize={32} valign={Gtk.Align.START} />
//   }

//   const id = n.desktopEntry || n.appName
//   if (!id) {
//     return
//   }

//   const app = apps.list.find((app) => {
//     return (
//       app.entry?.toLowerCase() === id ||
//       app.iconName?.toLowerCase() === id ||
//       app.name?.toLowerCase() === id ||
//       app.wmClass?.toLowerCase() === id
//     )
//   })

//   if (app && app.iconName) {
//     const icon = Gio.Icon.new_for_string(app.iconName)
//     return <image gicon={icon} pixelSize={32} valign={Gtk.Align.START} />
//   }
// }

// function isFile(path: string) {
//   return GLib.file_test(path, GLib.FileTest.EXISTS)
// }
