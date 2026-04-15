use gtk4_layer_shell::{Edge, Layer, LayerShell};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::widgets::baritems::clock;

const NAME: &str = "bar";

#[derive(Debug)]
pub struct Model {
    clock: Controller<clock::Model>,
}

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Window {
            set_widget_name: NAME,
            set_namespace: Some(NAME),
            set_visible: true,
            set_layer: Layer::Top,
            set_anchor[true]: Edge::Top,
            set_anchor[true]: Edge::Left,
            set_anchor[true]: Edge::Right,
            set_default_height: 30,

            gtk::CenterBox {
                #[wrap(Some)]
                set_center_widget = &gtk::Box {
                    model.clock.widget(),
                },
            },
        },
    }

    fn init(
        _init: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        root.init_layer_shell();
        root.auto_exclusive_zone_enable();

        let clock = clock::Model::builder()
            .launch(clock::Init::default())
            .detach();

        let model = Model { clock };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}
