import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./src/window/Bar"
import Wallpaper from "@/window/Wallpaper"

export const datadir = import.meta.PKG_DATADIR || SRC + "/assets"

app.start({
  gtkTheme: "Adwaita",
  css: style,
  icons: `${datadir}/icons`,
  main() {
    for (const window of [Bar, Wallpaper]) {
      app.monitors.map(window)
    }
  },
})
