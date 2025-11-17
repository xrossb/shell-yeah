import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding, createComputed } from "ags"
import { Config } from "@/config"

const wp = AstalWp.get_default()

export default function VolumeIndicator() {
  const present = createBinding(wp, "defaultSpeaker").as((speaker) => !!speaker)
  const icon = createComputed([
    createBinding(wp.defaultSpeaker, "volume"),
    createBinding(wp.defaultSpeaker, "mute"),
  ]).as(([volume, mute]) => {
    if (mute) return "sy-volume-mute-symbolic"
    if (volume > 0.5) return "sy-volume-up-symbolic"
    if (volume > 0) return "sy-volume-down-symbolic"
    return "sy-volume-low-symbolic"
  })

  return (
    <image
      visible={present}
      iconName={icon}
      pixelSize={Config.sizing.indicatorIcon}
    />
  )
}
