import { Node, State, This } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"

export type ModalProps = {
  open: State<boolean>

  class?: string
  children?: Node
  monitor?: Gdk.Monitor
  anchor?: Astal.WindowAnchor
}

export default function Modal({
  open: [open, setOpen],
  class: cssClass,
  children,
  monitor,
  anchor,
}: ModalProps) {
  const { ON_DEMAND } = Astal.Keymode
  const { OVERLAY } = Astal.Layer

  return (
    <This this={app}>
      <window
        class={cssClass}
        visible={open}
        keymode={ON_DEMAND}
        layer={OVERLAY}
        gdkmonitor={monitor}
        anchor={anchor}
        resizable={false}
        onNotifyVisible={(self) => {
          if (self.visible) self.grab_focus()
        }}
        onNotifyIsActive={(self) => {
          if (!self.isActive) setOpen(false)
        }}
      >
        <Gtk.EventControllerKey
          onKeyPressed={(self, keyval: number) => {
            if (keyval === Gdk.KEY_Escape) setOpen(false)
          }}
        />
        {children}
      </window>
    </This>
  )
}
