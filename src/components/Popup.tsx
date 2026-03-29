import Window from "@/src/components/Window"
import { PropsFor } from "@/src/lib/types"
import { Accessor } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"

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
      onNotifyVisible={(w) => {
        if (w.visible) w.grab_focus()
      }}
      onNotifyIsActive={(self) => {
        if (!self.isActive) self.hide()
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
