import { Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import AstalNiri from "gi://AstalNiri?version=0.1"

export function toggle(name: string) {
  const window = app.get_window(name)
  if (!window) {
    console.warn(`unknown window '${name}'`)
    return
  }
  if (window.visible) {
    window.hide()
  } else {
    window.show()
  }
}
