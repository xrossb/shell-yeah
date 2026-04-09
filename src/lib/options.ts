import GLib from "gi://GLib?version=2.0"
import Gio from "gi://Gio?version=2.0"

const home = `${GLib.get_user_config_dir()}/shell-yeah`

/** Behaviour/config options. */
export const config = options(`${home}/settings.json`, {
  clock: {
    format: "%a, %d %b · %I:%M %P",
  },
})

/** Theming options. */
export const theme = options(`${home}/theme.json`, {})

/**
 * Reads config from the given path and applies defaults.
 *
 * Writes default config back to the path if it does not exist.
 */
function options<T>(path: string, defaults: T) {
  if (!GLib.file_test(path, GLib.FileTest.EXISTS)) {
    writeDefaults(path, defaults)
    return defaults
  }

  try {
    const file = Gio.file_new_for_path(path)
    const [_, bytes] = file.load_contents(null)
    const json = new TextDecoder().decode(bytes)
    const overlay = JSON.parse(json)
    return merge(defaults, overlay)
  } catch (err) {
    console.error(`Could not load config from ${path}:`, err)
    return defaults
  }
}

/** Pretty-prints defaults as JSON to the given filepath. */
function writeDefaults(path: string, defaults: unknown) {
  if (!GLib.file_test(path, GLib.FileTest.IS_DIR)) {
    const dir = path.substring(0, path.lastIndexOf("/"))
    GLib.mkdir_with_parents(dir, 0o755)
  }

  const contents = JSON.stringify(defaults, null, 2)
  GLib.file_set_contents(path, contents)
}

/** Recursively merges two objects. */
function merge<T>(base: T, overlay: Partial<T>) {
  if (!overlay) return base

  const out = { ...base }
  for (const k in overlay) {
    const v = overlay[k]

    if (typeof v === "object" && !Array.isArray(v)) {
      out[k] = merge(base[k], v)
    } else {
      out[k] = v as T[typeof k]
    }
  }

  return out
}
