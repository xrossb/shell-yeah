import GLib from "gi://GLib?version=2.0"

/**
 * Wraps a function call in a debounce.
 */
export default function createDebounce<T extends (...args: any) => void>(
  ms: number,
  fn: T,
): (...args: Parameters<T>) => void {
  let timeout: GLib.Source | undefined
  return (...args) => {
    timeout?.destroy()
    timeout = setTimeout(() => {
      fn(...args)
      timeout?.destroy()
      timeout = undefined
    }, ms)
  }
}
