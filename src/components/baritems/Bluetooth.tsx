import BarItem from "@/src/components/BarItem"
import Symbol from "@/src/components/Symbol"
import AstalBluetooth from "gi://AstalBluetooth?version=0.1"
import { createBinding, createComputed } from "ags"

const glyphs = {
  connected: "\ue1a8",
  on: "\ue1a7",
  off: "\ue1a9",
}

export default function Bluetooth() {
  const bluetooth = AstalBluetooth.get_default()
  const adapter = createBinding(bluetooth, "adapter")
  const powered = createBinding(bluetooth, "isPowered")
  const connected = createBinding(bluetooth, "isConnected")
  const visible = adapter.as((a) => !!a)
  const glyph = createComputed(() => {
    if (connected()) return glyphs.connected
    if (powered()) return glyphs.on
    return glyphs.off
  })

  return (
    <BarItem visible={visible}>
      <Symbol glyph={glyph} />
    </BarItem>
  )
}
