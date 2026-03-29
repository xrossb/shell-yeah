import BarItem from "@/src/components/BarItem"
import Symbol from "@/src/components/Symbol"
import { createBinding, createComputed } from "ags"
import AstalBattery from "gi://AstalBattery?version=0.1"

const glyphs = {
  charged: "\uf102",
  charging: "\uea0b",
  draining: [
    { threshold: 5, icon: "\uf306" },
    { threshold: 15, icon: "\uf30c" },
    { threshold: 30, icon: "\uf30b" },
    { threshold: 45, icon: "\uf30a" },
    { threshold: 60, icon: "\uf309" },
    { threshold: 75, icon: "\uf308" },
    { threshold: 90, icon: "\uf307" },
    { threshold: 100, icon: "\uf304" },
  ],
}

export default function Battery() {
  const battery = AstalBattery.get_default()
  const isPresent = createBinding(battery, "isPresent")

  return (
    <BarItem name="battery" visible={isPresent} spacing={4}>
      <Symbol glyph={batteryGlyph(battery)} />
      <label label={batteryLabel(battery)} />
    </BarItem>
  )
}

function batteryGlyph(battery: AstalBattery.Device) {
  const { CHARGING, FULLY_CHARGED } = AstalBattery.State
  const percent = createBinding(battery, "percentage")
  const state = createBinding(battery, "state")

  return createComputed(() => {
    switch (state()) {
      case FULLY_CHARGED:
        return glyphs.charged
      case CHARGING:
        return glyphs.charging
      default:
        for (const pair of glyphs.draining) {
          if (percent() * 100 <= pair.threshold) {
            return pair.icon
          }
        }
        return glyphs.draining[0].icon
    }
  })
}

function batteryLabel(battery: AstalBattery.Device) {
  const percent = createBinding(battery, "percentage")
  return percent.as((p) => `${Math.floor(p * 100)}%`)
}
