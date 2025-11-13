import AstalTray from "gi://AstalTray"
import { createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"

const tray = AstalTray.get_default()

export default function Tray() {
  const items = createBinding(tray, "items").as((items) =>
    items.filter((i) => i.id).toReversed()
  )

  function init(button: Gtk.MenuButton, item: AstalTray.TrayItem) {
    button.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      button.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <box name="tray" spacing={16}>
      <For each={items}>
        {(item) => (
          <menubutton
            name="tray-item"
            $={(button) => init(button, item)}
            menuModel={item.menuModel}
            tooltipText={item.title}
          >
            <image gicon={createBinding(item, "gicon")} pixelSize={16} />
          </menubutton>
        )}
      </For>
    </box>
  )
}
