use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::workers::{BatteryMsg, BatteryState};

pub struct Battery {
    is_present: bool,
    percentage: f64,
    state: BatteryState,
}

#[relm4::component(pub)]
impl SimpleComponent for Battery {
    type Init = ();
    type Input = BatteryMsg;
    type Output = ();

    view! {
        gtk::Box {
            set_widget_name: "battery",
            add_css_class: "item",
            #[watch]
            set_visible: model.is_present,
            set_spacing: 6,

            gtk::Image {
                set_icon_name: Some("sy-battery-full"),
            },

            gtk::Label {
                #[watch]
                set_label: &format!("{:.0}%", model.percentage),
            },
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = Self {
            is_present: false,
            percentage: 0.0,
            state: BatteryState::Unknown,
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _: ComponentSender<Self>) {
        match msg {
            BatteryMsg::Percentage(percentage) => self.percentage = percentage,
            BatteryMsg::IsPresent(is_present) => self.is_present = is_present,
            BatteryMsg::State(state) => self.state = state,
        }
    }
}
