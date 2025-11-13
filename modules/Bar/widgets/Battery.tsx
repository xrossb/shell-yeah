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
  const batteryInfo = batteryBinding(battery)

  return (
    <With value={isPresent}>
      {(isPresent) =>
        isPresent && (
          <box
            name="battery"
            spacing={4}
            tooltipText={batteryInfo(batteryTooltip)}
          >
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

type BatteryInfo = ReturnType<typeof batteryBinding> extends Accessor<infer T>
  ? T
  : never

function batteryBinding(battery: AstalBattery.Device) {
  return createComputed([
    createBinding(battery, "percentage"),
    createBinding(battery, "state"),
    createBinding(battery, "energyRate"),
    createBinding(battery, "energy"),
    createBinding(battery, "energyFull"),
    createBinding(battery, "timeToFull"),
    createBinding(battery, "timeToEmpty"),
  ]).as(
    ([
      percentage,
      state,
      energyRate,
      energy,
      energyFull,
      timeToFull,
      timeToEmpty,
    ]) => ({
      percentage,
      state,
      energyRate,
      energy,
      energyFull,
      timeToFull,
      timeToEmpty,
    })
  )
}

function batteryIcon({ percentage, state }: BatteryInfo) {
  switch (state) {
    case AstalBattery.State.CHARGING:
      return "sy-bolt-symbolic"
    case AstalBattery.State.FULLY_CHARGED:
      return "sy-plug-symbolic"
    default:
      return icons[Math.round(percentage * (icons.length - 1))]
  }
}

function batteryTooltip({
  energyRate,
  energy,
  energyFull,
  timeToFull,
  timeToEmpty,
}: BatteryInfo) {
  const items = [
    `capacity: ${energy.toFixed(2)}W / ${energyFull.toFixed(2)}W`,
    `flow: ${energyRate.toFixed(2)}W`,
  ]

  if (timeToFull) {
    items.push(``, `full in ${formatDuration(timeToFull)}`)
  }

  if (timeToEmpty) {
    items.push(``, `empty in ${formatDuration(timeToEmpty)}`)
  }

  return items.join("\n")
}

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}
