import BarItem from "@/src/components/BarItem"
import Symbol from "@/src/components/Symbol"

const glyph = "\ue8ac"

export default function Power() {
  return (
    <BarItem>
      <Symbol glyph={glyph} />
    </BarItem>
  )
}
