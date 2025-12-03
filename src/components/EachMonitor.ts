import { createRoot } from "ags"
import { Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"

export default function EachMonitor(fn: (monitor: Gdk.Monitor) => void) {
  createRoot(() => {
    for (const monitor of app.monitors) {
      fn(monitor)
    }
  })

  // @ts-expect-error: notify::monitors is a valid signal.
  app.connect("notify::monitors", () => {
    createRoot(() => {
      for (const monitor of app.monitors) {
        fn(monitor)
      }
    })
  })
}
