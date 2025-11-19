import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding, createComputed } from "ags"
import { Config } from "@/config"

const wp = AstalWp.get_default()

export default function VolumeIndicator() {
  const present = createBinding(wp, "defaultSpeaker").as((speaker) => !!speaker)
  const volume = createBinding(wp.defaultSpeaker, "volume")
  const mute = createBinding(wp.defaultSpeaker, "mute")

  const icon = createComputed([volume, mute], (volume, mute) => {
    if (mute) return "sy-volume-mute-symbolic"
    if (volume > 0.5) return "sy-volume-up-symbolic"
    if (volume > 0) return "sy-volume-down-symbolic"
    return "sy-volume-low-symbolic"
  })

  const tooltip = createComputed([volume, mute], (volume, mute) => {
    if (mute) return "muted"
    return `${(volume * 100).toFixed(0)}%`
  })

  return (
    <image
      visible={present}
      iconName={icon}
      pixelSize={Config.sizing.indicatorIcon}
      tooltipText={tooltip}
    />
  )
}
