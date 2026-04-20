use gtk4_layer_shell::{Edge, Layer, LayerShell};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::{
    shell,
    widgets::baritems::{
        audio, battery, bluetooth, clock, launcher, network, poweroff, workspaces,
    },
    workers::niri::NiriCmd,
};

const NAME: &str = "bar";

pub struct Model {
    audio: Controller<audio::Model>,
    battery: Controller<battery::Model>,
    bluetooth: Controller<bluetooth::Model>,
    clock: Controller<clock::Model>,
    launcher: Controller<launcher::Model>,
    network: Controller<network::Model>,
    poweroff: Controller<poweroff::Model>,
    workspaces: Controller<workspaces::Model>,
}

#[derive(Clone, Debug)]
pub enum Output {
    WorkspacesEvent(NiriCmd),
}

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = ();
    type Input = shell::Msg;
    type Output = Output;

    view! {
        gtk::Window {
            set_widget_name: NAME,
            set_namespace: Some(NAME),
            set_visible: true,
            set_layer: Layer::Top,
            set_anchor[true]: Edge::Top,
            set_anchor[true]: Edge::Left,
            set_anchor[true]: Edge::Right,

            gtk::CenterBox {
                #[wrap(Some)]
                set_start_widget = &gtk::Box {
                    model.launcher.widget(),
                    model.workspaces.widget(),
                },

                #[wrap(Some)]
                set_center_widget = &gtk::Box {
                    model.clock.widget(),
                },

                #[wrap(Some)]
                set_end_widget = &gtk::Box {
                    model.battery.widget(),
                    model.audio.widget(),
                    model.bluetooth.widget(),
                    model.network.widget(),
                    model.poweroff.widget(),
                },
            },
        },
    }

    fn init(
        _init: Self::Init,
        root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        root.init_layer_shell();
        root.auto_exclusive_zone_enable();

        let audio = audio::Model::builder().launch(()).detach();

        let battery = battery::Model::builder().launch(()).detach();

        let bluetooth = bluetooth::Model::builder().launch(()).detach();

        let clock = clock::Model::builder()
            .launch(clock::Init::default())
            .detach();

        let launcher = launcher::Model::builder().launch(()).detach();

        let network = network::Model::builder().launch(()).detach();

        let poweroff = poweroff::Model::builder().launch(()).detach();

        let workspaces = workspaces::Model::builder()
            .launch(())
            .forward(sender.output_sender(), |msg| Output::WorkspacesEvent(msg));

        let model = Model {
            audio,
            battery,
            bluetooth,
            clock,
            launcher,
            network,
            poweroff,
            workspaces,
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _: ComponentSender<Self>) {
        if let shell::Msg::NiriEvent(event) = msg {
            self.workspaces.sender().send(event).unwrap();
        }
    }
}
