import BarItem from "@/src/components/BarItem"
import Symbol from "@/src/components/Symbol"

const glyph = "\ue63e"

export default function Network() {
  return (
    <BarItem>
      <Symbol glyph={glyph} />
    </BarItem>
  )
}
