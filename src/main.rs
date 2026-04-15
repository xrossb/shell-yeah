use relm4::prelude::*;
use rust_embed::Embed;

mod modules;
mod shell;
mod widgets;

#[derive(Embed)]
#[folder = "styles/"]
struct Styles;

fn main() {
    let app = RelmApp::new("shell-yeah.main");

    for filename in Styles::iter() {
        let file = Styles::get(&filename).expect("embedded style does not exist");
        let style = str::from_utf8(&file.data).expect("embedded style is not utf-8");
        relm4::set_global_css(style);
    }

    app.run::<shell::Model>(());
}
