import { onCleanup } from "ags"
import app from "ags/gtk4/app"

export type Props = JSX.IntrinsicElements["window"]

/**
 * Window wired to clean itself up on scope closure.
 */
export default function Window({ $, ...props }: Props) {
  return (
    <window
      application={app}
      $={(self) => {
        onCleanup(() => self.destroy())
        $?.(self)
      }}
      {...props}
    />
  )
}
