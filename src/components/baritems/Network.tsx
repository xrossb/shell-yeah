import BarItem from "@/src/components/BarItem"
import AstalNetwork from "gi://AstalNetwork?version=0.1"
import { createBinding, createComputed, With } from "ags"

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
    if (!enabled()) return "sy-wifi-off"
    if (!connected()) return "sy-wifi-strong"
    if (strength() <= 25) return "sy-wifi-weak"
    if (strength() <= 50) return "sy-wifi-mid"
    return "sy-wifi-strong"
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
  return <image iconName="sy-lan" opacity={opacity} />
}
