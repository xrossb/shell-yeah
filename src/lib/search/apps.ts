import * as search from "@/src/lib/search"
import AstalApps from "gi://AstalApps?version=0.1"
import Gio from "gi://Gio?version=2.0"
import GLib from "gi://GLib?version=2.0"

/**
 * Search plugin which returns installed applications.
 */
export class Plugin implements search.Plugin {
  #apps = new AstalApps.Apps()

  async search(query: string) {
    if (!query) {
      return []
    }

    this.#apps.reload()
    const apps = this.#apps.fuzzy_query(query)
    const results = new Array<search.Result>(apps.length)
    for (const i in apps) {
      results[i] = new search.Result(
        apps[i].iconName || apps[i].entry,
        apps[i].name,
        apps[i].description || apps[i].entry,
        (ctx) => {
          Gio.Subprocess.new(
            GLib.shell_parse_argv(
              apps[i].executable.replace(/%[fFcuUik]/g, ""),
            )[1]!,
            Gio.SubprocessFlags.NONE,
          )
          ctx.close()
        },
      )
    }

    return results
  }
}
