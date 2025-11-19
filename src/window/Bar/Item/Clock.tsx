import { createPoll } from "ags/time"
import GLib from "gi://GLib"
import { Config } from "@/config"
import BarItem from "../BarItem"

export default function Clock() {
  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format(Config.format.clock) || ""
  )

  return (
    <BarItem>
      <label label={time} />
    </BarItem>
  )
}
