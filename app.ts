import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./src/modules/Bar"
import Wallpaper from "@/modules/Wallpaper"
import NotificationList from "@/modules/NotificationList"

export const datadir = import.meta.PKG_DATADIR || SRC + "/assets"

app.start({
  css: style,
  icons: `${datadir}/icons`,
  main() {
    NotificationList()

    for (const window of [Wallpaper, Bar]) {
      app.monitors.map(window)
    }
  },
})
