use gtk4_layer_shell::{Layer, LayerShell};
use relm4::{gtk::prelude::*, prelude::*};

fn main() {
    let app = RelmApp::new("shell-yeah.main");
    app.run::<Model>(());
}

struct Model {
    _test: Controller<Test>,
}

#[relm4::component]
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
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        root.init_layer_shell();

        let model = Model {
            _test: Test::builder().launch(()).detach(),
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }
}

struct Test;

#[relm4::component]
impl SimpleComponent for Test {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Window {
            set_visible: true,
            set_default_size: (300, 100),

            gtk::Box {
                gtk::Label {
                    set_label: "hello!",
                },
            },
        },
    }

    fn init(
        _init: Self::Init,
        root: Self::Root,
        _sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = Test;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
