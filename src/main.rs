use std::path::PathBuf;

use relm4::gtk::gdk;
use relm4::prelude::*;
use rust_embed::Embed;

use crate::shell::Shell;

mod modules;
mod shell;
mod widgets;
mod workers;

fn main() {
    env_logger::Builder::from_env("LOG_LEVEL").init();
    log::info!("hello from shell-yeah");

    let app = RelmApp::new("shell-yeah.main");

    setup_icons();
    setup_styles();

    app.run::<Shell>(());
}

fn setup_styles() {
    #[derive(Embed)]
    #[folder = "styles/"]
    struct Styles;

    for filename in Styles::iter() {
        let file = Styles::get(&filename).expect("embedded style does not exist");
        let style = rsass::compile_scss(&file.data, Default::default())
            .expect("error compiling stylesheet");
        let style = str::from_utf8(&style).expect("embedded style is not utf-8");
        relm4::set_global_css(style);
    }
}

fn setup_icons() {
    let display = gdk::Display::default().expect("cannot get gdk display");
    let theme = gtk::IconTheme::for_display(&display);

    let home = std::env::home_dir().unwrap();
    theme.add_search_path(home.join(".config/shell-yeah/icons"));

    let datadir = std::env::var("DATADIR")
        .map(PathBuf::from)
        .unwrap_or("./assets".into());
    theme.add_search_path(datadir.join("icons"));
}
