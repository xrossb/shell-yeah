use std::time::Duration;

use relm4::gtk::glib::{self, ControlFlow, DateTime};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct Clock {
    format: String,
    time: String,
}

pub struct ClockInit {
    format: String,
}

impl Default for ClockInit {
    fn default() -> Self {
        Self {
            format: "%a, %d %b · %-l:%M %P".to_string(),
        }
    }
}

#[derive(Debug)]
pub enum ClockCmd {
    Tick,
}

#[relm4::component(pub)]
impl SimpleComponent for Clock {
    type Init = ClockInit;
    type Input = ClockCmd;
    type Output = ();

    view! {
        gtk::Box {
            add_css_class: "item",

            gtk::Label {
                #[watch]
                set_label: &model.time,
                set_valign: gtk::Align::BaselineCenter,
            },
        },
    }

    fn init(
        init: Self::Init,
        _root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        glib::timeout_add_local(Duration::from_secs(1), move || {
            sender.input(ClockCmd::Tick);
            ControlFlow::Continue
        });

        let model = Self {
            time: current_time(&init.format),
            format: init.format,
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, message: Self::Input, _: ComponentSender<Self>) {
        match message {
            ClockCmd::Tick => self.time = current_time(&self.format),
        }
    }
}

fn current_time(format: &str) -> String {
    DateTime::now_local()
        .and_then(|now| now.format(format))
        .map(|gstr| gstr.to_string())
        .unwrap_or_default()
}
