import { Astal, Gtk } from "ags/gtk4"
import Popup from "../components/Popup"
import Icon from "../components/Icon"
import { Accessor } from "ags"

const name = "audio-menu"

/**
 * Audio settings modal.
 */
export default function AudioMenu() {
  const { TOP, RIGHT } = Astal.WindowAnchor
  return (
    <Popup
      name={name}
      namespace={name}
      width={300}
      anchor={TOP | RIGHT}
      margin={8}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          <box spacing={8}>
            <image iconName="sy-volume-high" />
            <label
              label="Output Device"
              halign={Gtk.Align.START}
              justify={Gtk.Justification.LEFT}
              hexpand
            />
            <button iconName="sy-chevron-right" />
          </box>
          <slider hexpand />
        </box>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          <box spacing={8}>
            <image iconName="sy-mic" />
            <label
              label="Generic Input"
              halign={Gtk.Align.START}
              justify={Gtk.Justification.LEFT}
              hexpand
            />
            <button iconName="sy-chevron-right" />
          </box>
          <slider hexpand />
        </box>
        <Gtk.Separator />
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          <box spacing={8}>
            <image iconName="sy-volume-high" />
            <label label="Output Device" />
          </box>
          <box spacing={8}>
            <slider hexpand />
            <button iconName="sy-chevron-right" />
          </box>
        </box>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
          <box spacing={8}>
            <image iconName="sy-mic" />
            <label label="Generic Input" />
          </box>
          <box spacing={8}>
            <slider hexpand />
            <button iconName="sy-chevron-right" />
          </box>
        </box>
        <Gtk.Separator />
        <box spacing={8}>
          <Slider icon="sy-volume-high" label="this is an output" />
          <button iconName="sy-chevron-right" />
        </box>
        <box spacing={8}>
          <Slider icon="sy-mic" label="input device" />
          <button iconName="sy-chevron-right" />
        </box>
        <Gtk.Separator />
        <box>
          <button valign={Gtk.Align.CENTER}>
            <image iconName="sy-volume-high" pixelSize={20} />
          </button>
          <slider hexpand />
          <button valign={Gtk.Align.CENTER}>
            <image iconName="sy-chevron-right" pixelSize={20} />
          </button>
        </box>
        <box>
          <button valign={Gtk.Align.CENTER}>
            <image iconName="sy-mic" pixelSize={20} />
          </button>
          <slider hexpand />
          <button valign={Gtk.Align.CENTER}>
            <image iconName="sy-chevron-right" pixelSize={20} />
          </button>
        </box>
        <Gtk.Separator />
        <label label="volume + device pickers" />
        <label label="media players" />
      </box>
    </Popup>
  )
}

type SliderProps = {
  icon?: string | Accessor<string>
  label?: string | Accessor<string>
  level?: number | Accessor<number>
  min?: number
  max?: number
  onChange?: (value: number) => void
}

function Slider({ icon, label, level, min, max, onChange }: SliderProps) {
  return (
    <overlay class="slider-box">
      <box
        $type="overlay"
        halign={Gtk.Align.START}
        valign={Gtk.Align.CENTER}
        spacing={4}
      >
        <image iconName={icon} pixelSize={16} />
        <label label={label} />
      </box>
      <slider
        onChangeValue={({ value }) => onChange?.(value)}
        value={level}
        min={min}
        max={max}
        valign={Gtk.Align.FILL}
        hexpand
      />
    </overlay>
  )
}
