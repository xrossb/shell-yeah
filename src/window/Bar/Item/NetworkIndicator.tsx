import { Config } from "@/config"
import AstalNetwork from "gi://AstalNetwork"
import { createBinding, createComputed } from "ags"
import NM from "gi://NM?version=1.0"

const network = AstalNetwork.get_default()

export default function NetworkIndicator() {
  const primary = createBinding(network, "primary")
  const wifi = wifiBinding(network.wifi)
  const wired = wiredBinding(network.wired)

  const visible = !!(wifi || wired)

  const icon = createComputed((get) => {
    if (get(primary) === AstalNetwork.Primary.WIFI) {
      const strength = get(wifi.strength)
      if (strength <= 25) return { icon: "sy-wifi-weak-symbolic", opacity: 1 }
      if (strength <= 50) return { icon: "sy-wifi-mid-symbolic", opacity: 1 }
      return { icon: "sy-wifi-symbolic", opacity: 1 }
    }

    if (get(primary) === AstalNetwork.Primary.WIRED) {
      return { icon: "sy-wired-symbolic", opacity: 1 }
    }

    if (wifi) {
      if (get(wifi.enabled)) return { icon: "sy-wifi-symbolic", opacity: 0.5 }
      return { icon: "sy-wifi-disabled-symbolic", opacity: 1 }
    }

    return { icon: "sy-link-disabled-symbolic", opacity: 1 }
  })

  const tooltip = createComputed((get) => {
    const lines = []

    if (wifi) {
      const ifname = get(wifi.device.interface)
      const state = get(wifi.state)
      lines.push(`${ifname} (${deviceState(state)})`)

      const active = state === AstalNetwork.DeviceState.ACTIVATED

      const ssid = get(wifi.ssid)
      if (active && ssid) lines.push(`ssid: ${ssid}`)

      const strength = get(wifi.strength)
      if (active && strength) lines.push(`signal: ${strength}%`)

      const ip4 = get(wifi.device.ip4Config)
      if (ip4) {
        for (const addr of get(ip4.addresses)) {
          lines.push(`ipaddr: ${addr.address}/${addr.prefix}`)
        }

        const gw = get(ip4.gateway)
        if (gw) lines.push(`gwaddr: ${gw}`)
      }

      const mac = get(wifi.device.hwAddress)
      lines.push(`hwaddr: ${mac}`)
    }

    if (wired) {
      if (lines.length) lines.push("")

      const ifname = get(wired.device.interface)
      const state = get(wired.state)
      lines.push(`${ifname} (${deviceState(state)})`)

      const ip4 = get(wired.device.ip4Config)
      if (ip4) {
        for (const addr of get(ip4.addresses)) {
          lines.push(`ipaddr: ${addr.address}/${addr.prefix}`)
        }

        const gw = get(ip4.gateway)
        if (gw) lines.push(`gwaddr: ${gw}`)
      }

      const mac = get(wired.device.hwAddress)
      lines.push(`hwaddr: ${mac}`)
    }

    return lines.join("\n")
  })

  return (
    <image
      visible={visible}
      iconName={icon.as((i) => i.icon)}
      opacity={icon.as((i) => i.opacity)}
      pixelSize={Config.sizing.indicatorIcon}
      tooltipText={tooltip}
    />
  )
}

const wifiBinding = (wifi: AstalNetwork.Wifi) =>
  wifi && {
    device: deviceBinding(wifi.device),
    enabled: createBinding(wifi, "enabled"),
    internet: createBinding(wifi, "internet"),
    ssid: createBinding(wifi, "ssid"),
    strength: createBinding(wifi, "strength"),
    state: createBinding(wifi, "state"),
  }

const wiredBinding = (wired: AstalNetwork.Wired) =>
  wired && {
    device: deviceBinding(wired.device),
    internet: createBinding(wired, "internet"),
    state: createBinding(wired, "state"),
  }

const deviceBinding = (device: NM.Device) =>
  device && {
    ip4Config: createBinding(device, "ip4Config").as(ipBinding),
    hwAddress: createBinding(device, "hwAddress"),
    interface: createBinding(device, "interface"),
  }

const ipBinding = (ip: NM.IPConfig) =>
  ip && {
    addresses: createBinding(ip, "addresses").as(mapAddrs),
    gateway: createBinding(ip, "gateway"),
  }

const mapAddrs = (addrs: NM.IPAddress[]) => addrs.map(mapAddr)

const mapAddr = (addr: NM.IPAddress) => ({
  address: addr.get_address(),
  prefix: addr.get_prefix(),
})

function deviceState(state: AstalNetwork.DeviceState) {
  const DeviceState = AstalNetwork.DeviceState
  switch (state) {
    case DeviceState.UNMANAGED:
      return "unmanaged"
    case DeviceState.UNAVAILABLE:
      return "unavailable"
    case DeviceState.DISCONNECTED:
      return "disconnected"
    case DeviceState.PREPARE:
      return "prepare"
    case DeviceState.CONFIG:
      return "config"
    case DeviceState.NEED_AUTH:
      return "need_auth"
    case DeviceState.IP_CONFIG:
      return "ip_config"
    case DeviceState.IP_CHECK:
      return "ip_check"
    case DeviceState.SECONDARIES:
      return "secondaries"
    case DeviceState.ACTIVATED:
      return "activated"
    case DeviceState.DEACTIVATING:
      return "deactivating"
    case DeviceState.FAILED:
      return "failed"
    default:
      return "unknown"
  }
}
