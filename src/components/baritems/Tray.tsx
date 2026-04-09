import { createBinding, For } from "ags"
import AstalTray from "gi://AstalTray?version=0.1"
import Gdk from "gi://Gdk?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import BarItem from "@/src/components/BarItem"

export default function Tray() {
  const tray = AstalTray.get_default()
  const items = createBinding(tray, "items").as(items =>
    items.filter(i => i.id),
  )

  return (
    <box name="tray">
      <For each={items}>{i => <Item item={i} />}</For>
    </box>
  )
}

function Item({ item }: { item: AstalTray.TrayItem }) {
  const icon = createBinding(item, "gicon")
  let popover: Gtk.Popover | undefined
  return (
    <BarItem>
      <image gicon={icon} pixelSize={16} />
      <Gtk.GestureClick
        button={Gdk.BUTTON_PRIMARY}
        onPressed={(_source, _nclick, x, y) => item.activate(x, y)}
      />
      <Gtk.GestureClick
        button={Gdk.BUTTON_SECONDARY}
        onPressed={() => popover?.popup()}
      />
      <Gtk.PopoverMenu
        menuModel={item.menuModel}
        $={self => {
          popover = self
          self.insert_action_group("dbusmenu", item.actionGroup)
          item.connect("notify::action-group", () => {
            self.insert_action_group("dbusmenu", item.actionGroup)
          })
        }}
      />
    </BarItem>
  )
}
