use std::time::Duration;

use relm4::gtk::glib::{self, ControlFlow, DateTime};
use relm4::prelude::*;

pub struct Model {
    format: String,
    time: String,
}

pub struct Init {
    format: String,
}

impl Default for Init {
    fn default() -> Self {
        Self {
            format: "%a, %d %b · %I:%M %P".to_string(),
        }
    }
}

#[derive(Debug)]
pub enum Msg {
    Tick,
}

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = Init;
    type Input = Msg;
    type Output = ();

    view! {
        gtk::Label {
            #[watch]
            set_label: &model.time,
        },
    }

    fn init(
        init: Self::Init,
        _root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        glib::timeout_add_local(Duration::from_secs(1), move || {
            sender.input(Msg::Tick);
            ControlFlow::Continue
        });

        let model = Model {
            time: current_time(&init.format),
            format: init.format,
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, message: Self::Input, _sender: ComponentSender<Self>) {
        match message {
            Msg::Tick => self.time = current_time(&self.format),
        }
    }
}

fn current_time(format: &str) -> String {
    DateTime::now_local()
        .and_then(|now| now.format(format))
        .map(|gstr| gstr.to_string())
        .unwrap_or_default()
}
