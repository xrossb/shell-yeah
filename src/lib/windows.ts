import app from "ags/gtk4/app"

/**
 * Toggle a shell window by name.
 */
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
