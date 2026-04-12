import { createBinding, createComputed } from "ags"
import AstalBluetooth from "gi://AstalBluetooth?version=0.1"
import BarItem from "@/src/components/BarItem"
import Icon from "@/src/components/Icon"
import { icons } from "@/src/lib/icons"

export default function Bluetooth() {
  const bluetooth = AstalBluetooth.get_default()
  const adapter = createBinding(bluetooth, "adapter")
  const powered = createBinding(bluetooth, "isPowered")
  const connected = createBinding(bluetooth, "isConnected")
  const visible = adapter.as((a) => !!a)
  const icon = createComputed(() => {
    if (connected()) return icons.bluetooth.connected
    if (powered()) return icons.bluetooth.on
    return icons.bluetooth.off
  })

  return (
    <BarItem visible={visible}>
      <Icon icon={icon} />
    </BarItem>
  )
}
