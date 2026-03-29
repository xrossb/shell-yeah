import * as search from "@/src/lib/search"
import AstalApps from "gi://AstalApps?version=0.1"

export class Plugin implements search.Plugin {
  #apps = new AstalApps.Apps()

  search(query: string) {
    return new Promise<Array<search.Result>>((res, rej) => {
      if (!query) {
        res([])
        return
      }

      this.#apps.reload()
      const apps = this.#apps.fuzzy_query(query)
      const results = new Array<search.Result>(apps.length)
      for (const i in apps) {
        results[i] = new search.Result(
          apps[i].iconName,
          apps[i].name,
          apps[i].entry,
          (ctx) => {
            apps[i].launch()
            ctx.close()
          },
        )
      }

      res(results)
    })
  }
}
