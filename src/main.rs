use std::path::PathBuf;

use relm4::gtk::gdk;
use relm4::prelude::*;
use rust_embed::Embed;

use crate::shell::Shell;

mod modules;
mod shell;
mod util;
mod widgets;
mod workers;

fn main() {
    let log_level = std::env::var("LOG_LEVEL").unwrap_or_default();
    let log_style = std::env::var("LOG_STYLE").unwrap_or_default();
    env_logger::Builder::new()
        .parse_filters(&log_level)
        .parse_write_style(&log_style)
        .init();
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
        let file =
            Styles::get(&filename).expect("embedded style does not exist");
        let style = rsass::compile_scss(&file.data, Default::default())
            .expect("error compiling stylesheet");
        let style =
            str::from_utf8(&style).expect("embedded style is not utf-8");
        relm4::set_global_css(style);
    }
}

fn setup_icons() {
    let display = gdk::Display::default().expect("cannot get gdk display");
    let theme = gtk::IconTheme::for_display(&display);

    let home = std::env::home_dir().expect("cannot get home directory");
    theme.add_search_path(home.join(".config/shell-yeah/icons"));

    let datadir = std::env::var("DATADIR")
        .map(PathBuf::from)
        .unwrap_or("./assets".into());
    theme.add_search_path(datadir.join("icons"));
}
