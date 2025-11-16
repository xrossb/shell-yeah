import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./src/window/Bar"
import Wallpaper from "@/window/Wallpaper"

app.start({
  gtkTheme: "Adwaita",
  css: style,
  icons: `${SRC}/assets/icons`,
  main() {
    for (const window of [Bar, Wallpaper]) {
      app.monitors.map(window)
    }
  },
})
