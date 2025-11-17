import { Config } from "@/config"
import AstalNetwork from "gi://AstalNetwork"
import { createBinding, createComputed } from "ags"

const network = AstalNetwork.get_default()

export default function NetworkIndicator() {
  const wifiState = createComputed([
    createBinding(network, "wifi").as((wifi) => !!wifi),
    ...(network.wifi
      ? [
          createBinding(network.wifi, "enabled"),
          createBinding(network.wifi, "activeConnection").as((conn) => !!conn),
          createBinding(network.wifi, "internet").as(
            (internet) => internet === AstalNetwork.Internet.CONNECTED
          ),
        ]
      : []),
  ]).as(([present, enabled, connected, internet]) => {
    if (!present) return "unknown"
    if (!enabled) return "disabled"
    if (!connected) return "enabled"
    if (!internet) return "no-internet"
    return "connected"
  })
  const wifiStrength = createBinding(network.wifi, "strength")

  const wiredState = createComputed([
    createBinding(network, "wired").as((wired) => !!wired),
    ...(network.wired
      ? [
          createBinding(network.wired, "connection").as((conn) => !!conn),
          createBinding(network.wired, "internet").as(
            (internet) => internet === AstalNetwork.Internet.CONNECTED
          ),
        ]
      : []),
  ]).as(([present, connected, internet]) => {
    if (!present) return "unknown"
    if (!connected) return "enabled"
    if (!internet) return "no-internet"
    return "connected"
  })

  const visible = createComputed([wifiState, wiredState]).as(
    ([wifiState, wiredState]) =>
      wifiState !== "unknown" || wiredState !== "unknown"
  )

  const icon = createComputed([wifiState, wifiStrength, wiredState]).as(
    ([wifiState, wifiStrength, wiredState]) => {
      if (wifiState === "connected" || wifiState === "no-internet") {
        if (wifiStrength <= 25) return "sy-wifi-weak-symbolic"
        if (wifiStrength <= 50) return "sy-wifi-mid-symbolic"
        return "sy-wifi-symbolic"
      }

      if (wiredState === "connected" || wiredState === "no-internet")
        return "sy-wired-symbolic"

      if (wifiState === "enabled") return "sy-wifi-symbolic"
      if (wifiState === "disabled") return "sy-wifi-disabled-symbolic"

      return "sy-link-disabled-symbolic"
    }
  )

  const opacity = wifiState.as((state) => (state === "enabled" ? 0.5 : 1))

  return (
    <image
      visible={visible}
      iconName={icon}
      opacity={opacity}
      pixelSize={Config.sizing.indicatorIcon}
    />
  )
}
