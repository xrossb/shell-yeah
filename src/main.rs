use relm4::prelude::*;

mod modules;
mod shell;
mod widgets;

fn main() {
    let app = RelmApp::new("shell-yeah.main");
    app.run::<shell::Model>(());
}
