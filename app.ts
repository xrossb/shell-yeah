import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./src/modules/Bar"
import Wallpaper from "@/modules/Wallpaper"
import NotificationList from "@/modules/NotificationList"
import EachMonitor from "@/components/EachMonitor"

export const datadir = import.meta.PKG_DATADIR || SRC + "/assets"

app.start({
  css: style,
  icons: `${datadir}/icons`,
  main() {
    EachMonitor((monitor) => {
      Wallpaper({ monitor })
      Bar({ monitor })
    })
  },
})
