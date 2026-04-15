use gtk4_layer_shell::{Layer, LayerShell};
use relm4::{gtk::prelude::*, prelude::*};

use crate::modules::bar;

pub struct Model {
    _bar: Controller<bar::Model>,
}

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Window {
            set_decorated: false,
            set_opacity: 0.0,
            set_layer: Layer::Background,
        },
    }

    fn init(
        _init: Self::Init,
        root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        root.init_layer_shell();

        let bar = bar::Model::builder()
            .launch(())
            .forward(sender.input_sender(), |msg| msg);

        let model = Model { _bar: bar };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
