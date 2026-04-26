use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct Tray {}

#[relm4::component(pub)]
impl SimpleComponent for Tray {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            add_css_class: "item",
            set_label: "tray",
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = Self {};
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
