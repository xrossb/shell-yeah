import { Accessor } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"
import GLib from "gi://GLib?version=2.0"
import Window from "@/src/components/Window"
import { PropsFor } from "@/src/lib/types"

export type Props = PropsFor<typeof Window> & {
  width?: number | Accessor<number>
  height?: number | Accessor<number>
}

export default function Popup({ width, height, children, ...props }: Props) {
  return (
    <Window
      class="popup"
      keymode={Astal.Keymode.ON_DEMAND}
      layer={Astal.Layer.OVERLAY}
      resizable={false}
      onNotifyVisible={w => {
        if (w.visible) w.grab_focus()
      }}
      onNotifyIsActive={self => {
        if (self.isActive) return
        // While opening/closing popovers, the window briefly becomes inactive.
        // Deferring this check until idle ensures this property has settled.
        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
          if (!self.isActive) self.hide()
          return GLib.SOURCE_REMOVE
        })
      }}
      {...props}
    >
      <Gtk.EventControllerKey
        onKeyPressed={(self, keyval: number) => {
          if (keyval === Gdk.KEY_Escape) self.widget.hide()
        }}
      />
      <Adw.Clamp
        widthRequest={width}
        maximumSize={height}
        tighteningThreshold={height}
        orientation={Gtk.Orientation.VERTICAL}
      >
        {children}
      </Adw.Clamp>
    </Window>
  )
}
