import { onCleanup, This } from "ags"
import { Astal } from "ags/gtk4"
import app from "ags/gtk4/app"

export type Props = JSX.IntrinsicElements["window"] & {
  init?(self: Astal.Window): void
}

/**
 * Window wired to clean itself up on scope closure.
 */
export default function Window({ init, ...props }: Props) {
  return (
    <This this={app}>
      <window
        $={(self) => {
          if (init) init(self)
          onCleanup(() => self.destroy())
        }}
        {...props}
      />
    </This>
  )
}
