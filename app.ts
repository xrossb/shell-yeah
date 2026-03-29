import app from "ags/gtk4/app"
import EachMonitor from "@/src/lib/EachMonitor"
import Bar from "@/src/windows/Bar"
import Wallpaper from "@/src/windows/Wallpaper"
import OSD from "@/src/windows/OSD"
import Dock from "@/src/windows/Dock"
import Notifications from "@/src/windows/Notifications"
import NotificationsMenu from "@/src/windows/NotificationsMenu"
import Launcher from "@/src/windows/Launcher"
import BatteryMenu from "@/src/windows/BatteryMenu"
import AudioMenu from "@/src/windows/AudioMenu"
import BluetoothMenu from "@/src/windows/BluetoothMenu"
import NetworkMenu from "@/src/windows/NetworkMenu"
import PowerMenu from "@/src/windows/PowerMenu"
import css from "./style.scss"
import { Gdk, Gtk } from "ags/gtk4"
import { toggle } from "./src/lib/windows"

export const datadir = typeof DATADIR === "string" ? DATADIR : SRC + "/assets"

const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
iconTheme.add_search_path(`${datadir}/icons`)

app.start({
  css,
  main() {
    EachMonitor((monitor) => {
      Bar({ monitor })
      Dock({ monitor })
      Wallpaper({ monitor })
    })

    OSD()
    Notifications()

    Launcher()
    NotificationsMenu()
    BatteryMenu()
    AudioMenu()
    BluetoothMenu()
    NetworkMenu()
    PowerMenu()
  },
  requestHandler(argv, res) {
    if (argv.length == 1) {
      res("no command provided")
      return
    }
    const [command, ...args] = argv

    switch (command) {
      case "toggle":
        if (args.length != 1) {
          res("toggle requires 1 argument")
          return
        }
        const [name] = args

        toggle(name)
        res(`toggled window '${name}'`)
        return
      default:
        res(`unknown command '${command}'`)
        return
    }
  },
})
