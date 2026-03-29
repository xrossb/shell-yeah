import { Accessor } from "ags"

export type Props = {
  icon: string | Accessor<string>
  size?: number | Accessor<number>
  visible?: boolean | Accessor<boolean>
}

export default function Icon({ icon, size = 16, visible = true }: Props) {
  return (
    <image visible={visible} class="icon" iconName={icon} pixelSize={size} />
  )
}
