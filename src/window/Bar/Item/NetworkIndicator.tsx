import AstalNetwork from "gi://AstalNetwork"

const network = AstalNetwork.get_default()

export default function NetworkIndicator() {
  return <image iconName="sy-wired-symbolic" pixelSize={20} />
}
