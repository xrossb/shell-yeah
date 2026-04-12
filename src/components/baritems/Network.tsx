import { With, createBinding, createComputed } from "ags"
import AstalNetwork from "gi://AstalNetwork?version=0.1"
import BarItem from "@/src/components/BarItem"
import { icons } from "@/src/lib/icons"

export default function Network() {
  const network = AstalNetwork.get_default()
  const wifi = createBinding(network, "wifi")
  const wired = createBinding(network, "wired")
  const visible = createComputed(() => !!(wifi() || wired()))

  return (
    <BarItem visible={visible} spacing={8}>
      <With value={wifi}>{(wifi) => wifi && <WifiIcon wifi={wifi} />}</With>
      <With value={wired}>
        {(wired) => wired && <WiredIcon wired={wired} />}
      </With>
    </BarItem>
  )
}

type WifiProps = {
  wifi: AstalNetwork.Wifi
}

function WifiIcon({ wifi }: WifiProps) {
  const enabled = createBinding(wifi, "enabled")
  const connected = createBinding(wifi, "activeConnection").as((c) => !!c)
  const strength = createBinding(wifi, "strength")
  const icon = createComputed(() => {
    if (!enabled()) return icons.network.wifi.off
    if (!connected()) return icons.network.wifi.strong
    return icons.network.wifi.byPercent(strength() / 100)
  })
  const opacity = createComputed(() => {
    if (enabled() && !connected()) return 0.5
    return 1
  })

  return <image iconName={icon} opacity={opacity} />
}

type WiredProps = {
  wired: AstalNetwork.Wired
}

function WiredIcon({ wired }: WiredProps) {
  const connected = createBinding(wired, "state").as(
    (s) => s === AstalNetwork.DeviceState.ACTIVATED,
  )
  const opacity = connected.as((c) => (c ? 1 : 0.5))
  return <image iconName={icons.network.wired.on} opacity={opacity} />
}
