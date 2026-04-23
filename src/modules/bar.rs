use gtk4_layer_shell::{Edge, Layer, LayerShell};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::{
    shell::ShellMsg,
    widgets::baritems::{
        Audio, Battery, Bluetooth, Clock, ClockInit, Launcher, Logout, Network,
        Workspaces,
    },
    workers::NiriCmd,
};

const NAME: &str = "bar";

pub struct BarModule {
    audio: Controller<Audio>,
    battery: Controller<Battery>,
    bluetooth: Controller<Bluetooth>,
    clock: Controller<Clock>,
    launcher: Controller<Launcher>,
    network: Controller<Network>,
    logout: Controller<Logout>,
    workspaces: Controller<Workspaces>,
}

#[derive(Clone, Debug)]
pub enum BarMsg {
    WorkspacesMsg(NiriCmd),
}

#[relm4::component(pub)]
impl SimpleComponent for BarModule {
    type Init = ();
    type Input = ShellMsg;
    type Output = BarMsg;

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
                    model.logout.widget(),
                },
            },
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        root.init_layer_shell();
        root.auto_exclusive_zone_enable();

        let audio = Audio::builder().launch(()).detach();

        let battery = Battery::builder().launch(()).detach();

        let bluetooth = Bluetooth::builder().launch(()).detach();

        let clock = Clock::builder().launch(ClockInit::default()).detach();

        let launcher = Launcher::builder().launch(()).detach();

        let network = Network::builder().launch(()).detach();

        let logout = Logout::builder().launch(()).detach();

        let workspaces = Workspaces::builder()
            .launch(())
            .forward(sender.output_sender(), BarMsg::WorkspacesMsg);

        let model = Self {
            audio,
            battery,
            bluetooth,
            clock,
            launcher,
            network,
            logout,
            workspaces,
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _: ComponentSender<Self>) {
        match msg {
            ShellMsg::Niri(msg) => self.workspaces.emit(msg),
            ShellMsg::Battery(msg) => self.battery.emit(msg),
            _ => (),
        }
    }
}
