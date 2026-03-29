import GObject, { property, register } from "ags/gobject"

export class Registry {
  #plugins: Array<Plugin>

  constructor() {
    this.#plugins = []
  }

  register(plugin: Plugin) {
    this.#plugins.push(plugin)
  }

  async search(query: string) {
    const results = new Array<Result>()

    for (const plugin of this.#plugins) {
      const add = await plugin.search(query)
      results.push(...add)
    }

    return results
  }
}

export type Plugin = {
  search(query: string): Promise<Array<Result>>
}

export type Context = {
  close(): void
}

export type Action = (ctx: Context) => void

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
