import BarItem from "@/src/components/BarItem"
import { createBinding, createComputed } from "ags"
import { Gtk } from "ags/gtk4"
import AstalBattery from "gi://AstalBattery?version=0.1"
import Icon from "../Icon"

const icons = {
  charged: "sy-battery-charged",
  charging: "sy-battery-charging",
  draining: [
    { threshold: 5, icon: "sy-battery-critical" },
    { threshold: 15, icon: "sy-battery-15" },
    { threshold: 30, icon: "sy-battery-30" },
    { threshold: 45, icon: "sy-battery-45" },
    { threshold: 60, icon: "sy-battery-60" },
    { threshold: 75, icon: "sy-battery-75" },
    { threshold: 90, icon: "sy-battery-90" },
    { threshold: 100, icon: "sy-battery-full" },
  ],
}

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
        return icons.charged
      case CHARGING:
        return icons.charging
      default:
        for (const pair of icons.draining) {
          if (percent() * 100 <= pair.threshold) {
            return pair.icon
          }
        }
        return icons.draining[0].icon
    }
  })
}

function batteryLabel(battery: AstalBattery.Device) {
  const percent = createBinding(battery, "percentage")
  return percent.as((p) => `${Math.floor(p * 100)}%`)
}
