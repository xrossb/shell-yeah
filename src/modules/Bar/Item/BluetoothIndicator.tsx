import AstalBluetooth from "gi://AstalBluetooth"
import { createBinding, createComputed } from "ags"
import { Config } from "@/config"

const bluetooth = AstalBluetooth.get_default()

export default function BluetoothIndicator() {
  const status = createComputed(
    [
      createBinding(bluetooth, "isPowered"),
      createBinding(bluetooth, "isConnected"),
    ],
    (isPowered, isConnected) => {
      if (!isPowered) return "off"
      if (!isConnected) return "on"
      return "connected"
    }
  )

  const visible = createBinding(bluetooth, "adapter").as((adapter) => !!adapter)
  const icon = status.as(bluetoothIcon)
  const tooltip = createComputed(
    [status, createBinding(bluetooth, "devices")],
    (status, devices) => {
      if (status !== "connected") return status

      const connectedDevices = devices.filter((device) => device.connected)
      return `${connectedDevices.length} connected`
    }
  )

  return (
    <image
      visible={visible}
      iconName={icon}
      pixelSize={Config.sizing.indicatorIcon}
      tooltipText={tooltip}
    />
  )
}

function bluetoothStatus(powered: boolean, connected: boolean) {
  if (!powered) return "off"
  if (!connected) return "on"
  return "connected"
}

type BluetoothStatus = ReturnType<typeof bluetoothStatus>

function bluetoothIcon(status: BluetoothStatus) {
  return Config.icon.bluetooth[status]
}
