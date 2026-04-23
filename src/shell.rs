use gtk4_layer_shell::{Layer, LayerShell};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::{
    modules::{BarModule, BarMsg},
    workers::{BatteryMsg, BatteryWorker, NiriMsg, NiriWorker},
};

pub struct Shell {
    _battery: Controller<BatteryWorker>,
    niri: Controller<NiriWorker>,
    bar: Controller<BarModule>,
}

#[derive(Clone, Debug)]
pub enum ShellMsg {
    Battery(BatteryMsg),
    Niri(NiriMsg),
    Bar(BarMsg),
}

#[relm4::component(pub)]
impl SimpleComponent for Shell {
    type Init = ();
    type Input = ShellMsg;
    type Output = ();

    view! {
        gtk::Window {
            set_decorated: false,
            set_opacity: 0.0,
            set_layer: Layer::Background,
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        root.init_layer_shell();

        let battery = BatteryWorker::builder()
            .launch(())
            .forward(sender.input_sender(), ShellMsg::Battery);
        let niri = NiriWorker::builder()
            .launch(())
            .forward(sender.input_sender(), ShellMsg::Niri);

        let bar = BarModule::builder()
            .launch(())
            .forward(sender.input_sender(), ShellMsg::Bar);

        let model = Shell {
            _battery: battery,
            niri,
            bar,
        };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _: ComponentSender<Self>) {
        if let &ShellMsg::Bar(BarMsg::WorkspacesMsg(ref cmd)) = &msg {
            self.niri.sender().emit(cmd.clone());
        }

        self.bar.sender().emit(msg);
    }
}
