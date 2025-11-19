import AstalTray from "gi://AstalTray"
import { createBinding, For, jsx, onMount } from "ags"
import { Gdk, Gtk } from "ags/gtk4"
import { Config } from "@/config"
import BarItem from "../BarItem"

const tray = AstalTray.get_default()

export default function Tray() {
  const items = createBinding(tray, "items").as((items) =>
    items.filter((i) => i.id)
  )

  return (
    <box name="tray" spacing={Config.spacing.mid}>
      <For each={items}>{TrayItem}</For>
    </box>
  )
}

function TrayItem(item: AstalTray.TrayItem) {
  function init(popover: Gtk.PopoverMenu, item: AstalTray.TrayItem) {
    popover.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      popover.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  const popover = jsx(Gtk.PopoverMenu, {
    menuModel: item.menuModel,
    $: (self) => init(self, item),
  })

  return (
    <BarItem name="tray-item" tooltipText={item.title || item.tooltipText}>
      <image
        gicon={createBinding(item, "gicon")}
        pixelSize={Config.sizing.trayIcon}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={(_source, _nclick, x, y) => item.activate(x, y)}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_SECONDARY}
        onPressed={(source) => {
          popover.set_parent(source.widget)
          popover.popup()
        }}
      />
    </BarItem>
  )
}
