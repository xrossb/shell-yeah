import AstalApps from "gi://AstalApps?version=0.1"
import * as search from "@/src/lib/search"

/**
 * Search plugin which returns installed applications.
 */
export class Plugin implements search.Plugin {
  #apps = new AstalApps.Apps()

  search(query: string) {
    if (!query) {
      return []
    }

    this.#apps.reload()
    const apps = this.#apps.fuzzy_query(query)
    const results = apps.map(
      app =>
        new search.Result(
          app.iconName || app.entry,
          app.name,
          app.description || app.entry,
          ctx => {
            app.launch()
            ctx.close()
          },
        ),
    )

    return results
  }
}
