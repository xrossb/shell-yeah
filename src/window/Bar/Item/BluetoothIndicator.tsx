import AstalBluetooth from "gi://AstalBluetooth"
import { createBinding, createComputed, With } from "ags"
import { Config } from "@/config"

const bluetooth = AstalBluetooth.get_default()

export default function BluetoothIndicator() {
  const powered = createBinding(bluetooth, "isPowered")
  const connected = createBinding(bluetooth, "isConnected")
  const status = createComputed([powered, connected]).as(
    ([powered, connected]) => {
      if (!powered) return "off"
      if (!connected) return "on"
      return "connected"
    }
  )
  const visible = createBinding(bluetooth, "adapter").as((adapter) => !!adapter)

  return (
    <image
      visible={visible}
      iconName={status.as(bluetoothIcon)}
      pixelSize={Config.sizing.indicatorIcon}
      tooltipText={status}
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
