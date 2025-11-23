import { Astal, Gdk, Gtk } from "ags/gtk4"
import { createState } from "ags"
import Adw from "gi://Adw"
import app from "ags/gtk4/app"

const handles: Gtk.Window[] = []

export default function Popup(props: {
  children: JSX.Element
  name: string
  gdkmonitor: Gdk.Monitor
  width?: number
  height?: number
  halign?: Gtk.Align
  valign?: Gtk.Align
  anchor?: Astal.WindowAnchor
  transitionType?: Gtk.RevealerTransitionType
  transitionDuration?: number
  $?: (self: Astal.Window) => void
}) {
  const [visible, setVisible] = createState(false)
  const [revealed, setRevealed] = createState(false)

  let content: Gtk.Widget

  function show() {
    handles.forEach((h) => h.hide())
    setVisible(true)
    setRevealed(true)
  }

  function hide() {
    setRevealed(false)
  }

  return (
    <window
      application={app}
      css="background: transparent;"
      visible={visible}
      name={props.name}
      namespace={props.name}
      keymode={Astal.Keymode.ON_DEMAND}
      layer={Astal.Layer.OVERLAY}
      gdkmonitor={props.gdkmonitor}
      anchor={props.anchor}
      onNotifyVisible={(self) => self.visible && content.grab_focus()}
      $={(self) => {
        Object.assign(self, { show, hide })
        handles.push(self)
        if (props.$) props.$(self)
      }}
    >
      <Gtk.EventControllerKey
        onKeyPressed={(self, keyval: number) => {
          if (keyval === Gdk.KEY_Escape) {
            self.widget.hide()
          }
        }}
      />
      <revealer
        revealChild={revealed}
        transitionType={props.transitionType}
        transitionDuration={props.transitionDuration}
        onNotifyChildRevealed={(self) => setVisible(self.childRevealed)}
      >
        <Adw.Clamp
          orientation={Gtk.Orientation.HORIZONTAL}
          widthRequest={props.width}
          $={(self) => (content = self)}
          focusable
          onNotifyHasFocus={(self) => setRevealed(self.hasFocus)}
        >
          {props.children}
        </Adw.Clamp>
      </revealer>
    </window>
  ) as Astal.Window
}
