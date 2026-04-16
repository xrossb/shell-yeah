use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct Model;

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Image {
            add_css_class: "item",
            set_icon_name: Some("power"),
        },
    }

    fn init(
        _init: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = Model;
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
