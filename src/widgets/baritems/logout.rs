use relm4::gtk::prelude::*;
use relm4::prelude::*;

pub struct LogoutItem;

#[relm4::component(pub)]
impl SimpleComponent for LogoutItem {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Image {
            add_css_class: "item",
            set_icon_name: Some("sy-power"),
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = LogoutItem;
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
