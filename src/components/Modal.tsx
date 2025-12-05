import { createState, Node, State, This } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"

export type ModalProps = {
  children?: Node
  monitor?: Gdk.Monitor
  anchor?: Astal.WindowAnchor

  open?: State<boolean>
}

export default function Modal({
  children,
  monitor,
  anchor,
  open: [open, setOpen] = createState(false),
}: ModalProps) {
  const { ON_DEMAND } = Astal.Keymode
  const { OVERLAY } = Astal.Layer

  return (
    <This this={app}>
      <window
        visible={open}
        keymode={ON_DEMAND}
        layer={OVERLAY}
        gdkmonitor={monitor}
        anchor={anchor}
        resizable={false}
        onNotifyVisible={(self) => {
          if (self.visible) self.grab_focus()
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
