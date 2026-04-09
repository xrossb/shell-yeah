import BarItem from "@/src/components/BarItem"
import AstalBluetooth from "gi://AstalBluetooth?version=0.1"
import { createBinding, createComputed } from "ags"
import Icon from "../Icon"

const icons = {
  connected: "sy-bluetooth-connected",
  on: "sy-bluetooth-on",
  off: "sy-bluetooth-off",
}

export default function Bluetooth() {
  const bluetooth = AstalBluetooth.get_default()
  const adapter = createBinding(bluetooth, "adapter")
  const powered = createBinding(bluetooth, "isPowered")
  const connected = createBinding(bluetooth, "isConnected")
  const visible = adapter.as((a) => !!a)
  const icon = createComputed(() => {
    if (connected()) return icons.connected
    if (powered()) return icons.on
    return icons.off
  })

  return (
    <BarItem visible={visible}>
      <Icon icon={icon} />
    </BarItem>
  )
}
