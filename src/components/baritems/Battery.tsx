import { createBinding, createComputed } from "ags"
import { Gtk } from "ags/gtk4"
import AstalBattery from "gi://AstalBattery?version=0.1"
import BarItem from "@/src/components/BarItem"
import Icon from "@/src/components/Icon"
import { icons } from "@/src/lib/icons"

export default function Battery() {
  const battery = AstalBattery.get_default()
  const isPresent = createBinding(battery, "isPresent")

  return (
    <BarItem name="battery" visible={isPresent} spacing={4}>
      <Icon icon={batteryIcon(battery)} />
      <label label={batteryLabel(battery)} valign={Gtk.Align.CENTER} />
    </BarItem>
  )
}

function batteryIcon(battery: AstalBattery.Device) {
  const { CHARGING, FULLY_CHARGED } = AstalBattery.State
  const percent = createBinding(battery, "percentage")
  const state = createBinding(battery, "state")

  return createComputed(() => {
    switch (state()) {
      case FULLY_CHARGED:
        return icons.battery.charged
      case CHARGING:
        return icons.battery.charging
      default:
        return icons.battery.byPercent(percent())
    }
  })
}

function batteryLabel(battery: AstalBattery.Device) {
  const percent = createBinding(battery, "percentage")
  return percent.as((p) => `${Math.floor(p * 100)}%`)
}
