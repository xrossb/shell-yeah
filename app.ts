import app from "ags/gtk4/app"
import EachMonitor from "@/src/lib/EachMonitor"
import AudioMenu from "@/src/windows/AudioMenu"
import Bar from "@/src/windows/Bar"
import BatteryMenu from "@/src/windows/BatteryMenu"
import BluetoothMenu from "@/src/windows/BluetoothMenu"
import Dock from "@/src/windows/Dock"
import Launcher from "@/src/windows/Launcher"
import NetworkMenu from "@/src/windows/NetworkMenu"
import NotificationsMenu from "@/src/windows/NotificationsMenu"
import NotificationsPopup from "@/src/windows/NotificationsPopup"
import OSD from "@/src/windows/OSD"
import PowerMenu from "@/src/windows/PowerMenu"
import Wallpaper from "@/src/windows/Wallpaper"
import * as windows from "./src/lib/windows"
import css from "./style.scss"

export const datadir = typeof DATADIR === "string" ? DATADIR : SRC + "/assets"

app.start({
  css,
  icons: `${datadir}/icons`,
  main() {
    EachMonitor((monitor) => {
      Bar({ monitor })
      Wallpaper({ monitor })
    })

    OSD()
    NotificationsPopup()

    Dock()
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
        windows.toggle(name)
        res(`toggled window '${name}'`)
        return
      default:
        res(`unknown command '${command}'`)
        return
    }
  },
})
