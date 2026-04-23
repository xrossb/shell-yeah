use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct AudioItem;

#[relm4::component(pub)]
impl SimpleComponent for AudioItem {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Image {
            add_css_class: "item",
            set_icon_name: Some("sy-volume-high"),
        },
    }

    fn init(
        _init: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = AudioItem;
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
