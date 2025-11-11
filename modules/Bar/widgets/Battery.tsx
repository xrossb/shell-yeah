import AstalBattery from "gi://AstalBattery"
import { Accessor, createBinding, createComputed, With } from "ags"

const battery = AstalBattery.get_default()

const icons = [
  "sy-battery-alert-symbolic",
  "sy-battery-7-symbolic",
  "sy-battery-6-symbolic",
  "sy-battery-5-symbolic",
  "sy-battery-4-symbolic",
  "sy-battery-3-symbolic",
  "sy-battery-2-symbolic",
  "sy-battery-1-symbolic",
  "sy-battery-0-symbolic",
]

export default function Battery() {
  const isPresent = createBinding(battery, "isPresent")

  const batteryInfo = createComputed([
    createBinding(battery, "percentage"),
    createBinding(battery, "charging"),
    createBinding(battery, "energyRate"),
  ]).as(([percentage, charging, energyRate]) => ({
    percentage,
    charging,
    energyRate,
  }))
  type BatteryInfo = typeof batteryInfo extends Accessor<infer T> ? T : never

  function batteryIcon({ percentage, charging }: BatteryInfo) {
    if (charging) {
      return "sy-battery-bolt-symbolic"
    }

    return icons[Math.floor(percentage * icons.length)]
  }

  function batteryTooltip({ energyRate }: BatteryInfo) {
    return [
      `draw: ${energyRate.toFixed(2)}W`,
      // TODO: battery health, time to full/empty.
    ].join("\n")
  }

  return (
    <With value={isPresent}>
      {(isPresent) =>
        isPresent && (
          <box spacing={8} tooltipText={batteryInfo(batteryTooltip)}>
            <image iconName={batteryInfo(batteryIcon)} pixelSize={20} />
            <label
              label={batteryInfo(
                (battery) => `${Math.floor(battery.percentage * 100)}%`
              )}
            />
          </box>
        )
      }
    </With>
  )
}
