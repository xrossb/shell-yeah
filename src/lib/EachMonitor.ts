import { createBinding, createRoot, onCleanup } from "ags"
import { Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"

/**
 * Continuously watch for connected monitors, and create a scope for each to run
 * the provided function.
 */
export default function EachMonitor(fn: (monitor: Gdk.Monitor) => void) {
  const monitors = createBinding(app, "monitors")
  const oldMonitors = new Map<Gdk.Monitor, () => void>()

  const monitorsChanged = () => {
    const newMonitors = new Set(monitors.peek())

    // Dispose scopes for disconnected monitors.
    for (const [oldMonitor, dispose] of oldMonitors) {
      if (!newMonitors.has(oldMonitor)) {
        dispose()
        oldMonitors.delete(oldMonitor)
      }
    }

    // Register scopes for newly connected monitors.
    for (const newMonitor of newMonitors) {
      if (!oldMonitors.has(newMonitor)) {
        createRoot(dispose => {
          fn(newMonitor)
          oldMonitors.set(newMonitor, dispose)
        })
      }
    }
  }

  const unsubscribe = monitors.subscribe(monitorsChanged)
  onCleanup(() => {
    unsubscribe()
    for (const [_, dispose] of oldMonitors) {
      dispose()
    }
  })

  monitorsChanged()
}
