use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct NetworkItem;

#[relm4::component(pub)]
impl SimpleComponent for NetworkItem {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Box {
            add_css_class: "item",
            set_spacing: 6,

            gtk::Image {
                set_icon_name: Some("sy-wifi-strong"),
            },
            gtk::Image {
                set_icon_name: Some("sy-lan"),
            },
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
