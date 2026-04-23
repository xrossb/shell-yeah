use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct Bluetooth;

#[relm4::component(pub)]
impl SimpleComponent for Bluetooth {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Image {
            add_css_class: "item",
            set_icon_name: Some("sy-bluetooth-on"),
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
