use gtk4_layer_shell::{Layer, LayerShell};
use relm4::gtk::prelude::*;
use relm4::prelude::*;

use crate::{
    modules::bar,
    workers::{
        battery::{BatteryMsg, BatteryWorker},
        niri::{NiriMsg, NiriWorker},
    },
};

pub struct Model {
    battery: Controller<BatteryWorker>,
    niri: Controller<NiriWorker>,
    bar: Controller<bar::Model>,
}

#[derive(Clone, Debug)]
pub enum Msg {
    BatteryMsg(BatteryMsg),
    NiriEvent(NiriMsg),
    BarEvent(bar::Output),
}

#[relm4::component(pub)]
impl SimpleComponent for Model {
    type Init = ();
    type Input = Msg;
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

        let battery = BatteryWorker::builder()
            .launch(())
            .forward(sender.input_sender(), Msg::BatteryMsg);
        let niri = NiriWorker::builder()
            .launch(())
            .forward(sender.input_sender(), Msg::NiriEvent);

        let bar = bar::Model::builder()
            .launch(())
            .forward(sender.input_sender(), Msg::BarEvent);

        let model = Model { battery, niri, bar };
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _sender: ComponentSender<Self>) {
        if let Msg::BarEvent(bar::Output::WorkspacesEvent(cmd)) = msg.clone() {
            self.niri.sender().send(cmd).unwrap();
        }

        self.bar.sender().send(msg).unwrap();
    }
}
