import { createPoll } from "ags/time"
import GLib from "gi://GLib"
import { Config } from "@/config"

export default function Clock() {
  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format(Config.format.clock) || ""
  )

  return (
    <box>
      <label label={time} />
    </box>
  )
}
