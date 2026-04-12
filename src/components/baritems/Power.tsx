import BarItem from "@/src/components/BarItem"
import Icon from "@/src/components/Icon"
import { icons } from "@/src/lib/icons"

export default function Power() {
  return (
    <BarItem>
      <Icon icon={icons.poweroff} />
    </BarItem>
  )
}
