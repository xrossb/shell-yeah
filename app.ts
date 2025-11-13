import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./modules/Bar"

app.start({
  gtkTheme: "Adwaita",
  css: style,
  icons: `${SRC}/assets/icons`,
  main() {
    app.get_monitors().map(Bar)
  },
})
