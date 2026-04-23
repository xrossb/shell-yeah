use gtk4_layer_shell::{Edge, Layer, LayerShell};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::{
    shell::ShellMsg,
    util::ResultExt,
    widgets::baritems::{
        AudioItem, BatteryItem, BluetoothItem, ClockInit, ClockItem,
        LauncherItem, LogoutItem, NetworkItem, WorkspacesItem,
    },
    workers::NiriCmd,
};

const NAME: &str = "bar";

pub struct BarModule {
    audio: Controller<AudioItem>,
    battery: Controller<BatteryItem>,
    bluetooth: Controller<BluetoothItem>,
    clock: Controller<ClockItem>,
    launcher: Controller<LauncherItem>,
    network: Controller<NetworkItem>,
    poweroff: Controller<LogoutItem>,
    workspaces: Controller<WorkspacesItem>,
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
                    model.poweroff.widget(),
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

        let audio = AudioItem::builder().launch(()).detach();

        let battery = BatteryItem::builder().launch(()).detach();

        let bluetooth = BluetoothItem::builder().launch(()).detach();

        let clock = ClockItem::builder().launch(ClockInit::default()).detach();

        let launcher = LauncherItem::builder().launch(()).detach();

        let network = NetworkItem::builder().launch(()).detach();

        let poweroff = LogoutItem::builder().launch(()).detach();

        let workspaces = WorkspacesItem::builder()
            .launch(())
            .forward(sender.output_sender(), BarMsg::WorkspacesMsg);

        let model = Self {
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
        match msg {
            ShellMsg::Niri(msg) => self
                .workspaces
                .sender()
                .send(msg)
                .or_warn("unhandled message"),
            ShellMsg::Battery(msg) => {
                self.battery.sender().send(msg).or_warn("unhandled message")
            }
            _ => (),
        }
    }
}
