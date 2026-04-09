import GObject, { property, register } from "ags/gobject"

/**
 * Bundles search plugins together, allowing for searching across multiple
 * plugins simultaneously.
 */
export class Registry {
  #plugins: Plugin[]

  constructor() {
    this.#plugins = []
  }

  register(plugin: Plugin) {
    this.#plugins.push(plugin)
  }

  search(query: string) {
    const results = new Array<Result>()

    for (const plugin of this.#plugins) {
      const add = plugin.search(query)
      results.push(...add)
    }

    return results
  }
}

/**
 * Interface for search plugins.
 */
export type Plugin = {
  search(query: string): Result[]
}

export type Context = {
  /**
   * Closes the search prompt.
   */
  close(): void
}

/**
 * Runnable action tied to a search result.
 */
export type Action = (ctx: Context) => void

/**
 * Single result of a search.
 */
@register()
export class Result extends GObject.Object {
  declare static $gtype: GObject.GType<Result>

  #run: Action

  @property(String) icon = ""
  @property(String) title = ""
  @property(String) description = ""

  constructor(icon: string, title: string, description: string, run: Action) {
    super()
    this.icon = icon
    this.title = title
    this.description = description
    this.#run = run
  }

  run(ctx: Context) {
    return this.#run(ctx)
  }
}
