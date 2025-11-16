import AstalTray from "gi://AstalTray"
import { createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"
import { Config } from "@/config"

const tray = AstalTray.get_default()

export default function Tray() {
  const items = createBinding(tray, "items").as((items) =>
    items.filter((i) => i.id)
  )

  function init(button: Gtk.MenuButton, item: AstalTray.TrayItem) {
    button.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      button.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <box name="tray" spacing={Config.spacing.mid}>
      <For each={items}>{TrayItem}</For>
    </box>
  )
}

function TrayItem(item: AstalTray.TrayItem) {
  function init(button: Gtk.MenuButton, item: AstalTray.TrayItem) {
    button.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      button.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <menubutton
      name="tray-item"
      $={(button) => init(button, item)}
      menuModel={item.menuModel}
      tooltipText={item.title}
    >
      <image
        gicon={createBinding(item, "gicon")}
        pixelSize={Config.sizing.trayIcon}
      />
    </menubutton>
  )
}
