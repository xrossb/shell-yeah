use relm4::prelude::*;

pub struct Model;

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "network",
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
