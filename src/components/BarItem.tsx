export type Props = JSX.IntrinsicElements["box"]

/**
 * Standard wrapper for bar items.
 */
export default function BarItem(props: Props) {
  return <box class="bar-item" {...props} />
}
