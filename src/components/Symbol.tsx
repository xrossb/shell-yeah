import { Accessor } from "ags"

export type Props = {
  glyph: string | Accessor<string>
  visible?: boolean | Accessor<boolean>
}

export default function Symbol({ glyph, visible = true }: Props) {
  return <label visible={visible} class="symbol" label={glyph} />
}
