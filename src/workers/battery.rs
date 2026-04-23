use std::fmt::Debug;

use relm4::{ComponentSender, Worker};
use serde_repr::{Deserialize_repr, Serialize_repr};
use tokio::select;
use tokio_stream::StreamExt;
use tokio_util::sync::CancellationToken;
use zbus::proxy;
use zbus::{
    Connection, fdo,
    proxy::PropertyChanged,
    zvariant::{OwnedValue, Type},
};

use crate::util::ResultExt;

pub struct BatteryWorker {
    _ct: CancellationToken,
}

#[derive(Clone, Debug)]
pub enum BatteryMsg {
    PercentageChanged(f64),
    IsPresentChanged(bool),
}

impl Worker for BatteryWorker {
    type Init = ();
    type Input = ();
    type Output = BatteryMsg;

    fn init(_: Self::Init, sender: relm4::ComponentSender<Self>) -> Self {
        let ct = CancellationToken::new();

        let inner_ct = ct.clone();
        relm4::spawn(async move {
            let conn = match Connection::system().await {
                Ok(conn) => conn,
                Err(err) => {
                    log::warn!("cannot connect to system d-bus: {err}");
                    return;
                }
            };

            let device = match DeviceProxy::new(&conn).await {
                Ok(device) => device,
                Err(err) => {
                    log::warn!("cannot get display device: {err}");
                    return;
                }
            };

            let mut percentage_changed =
                device.receive_percentage_changed().await;
            let mut is_present_changed =
                device.receive_is_present_changed().await;
            loop {
                select! {
                    _ = inner_ct.cancelled() => break,
                    Some(prop) = percentage_changed.next() => forward(
                        prop,
                        &sender,
                        BatteryMsg::PercentageChanged,
                    ).await,
                    Some(prop) = is_present_changed.next() => forward(
                        prop,
                        &sender,
                        BatteryMsg::IsPresentChanged,
                    ).await,
                };
            }
        });

        Self { _ct: ct }
    }

    fn update(&mut self, _: Self::Input, _: relm4::ComponentSender<Self>) {}
}

async fn forward<P: TryFrom<OwnedValue> + Debug, F: FnOnce(P) -> BatteryMsg>(
    change: PropertyChanged<'_, P>,
    sender: &ComponentSender<BatteryWorker>,
    map: F,
) where
    P::Error: Into<zbus::Error>,
{
    let value = match change.get().await {
        Ok(v) => v,
        Err(err) => {
            log::warn!("cannot get {}: {}", change.name(), err);
            return;
        }
    };

    log::debug!("{} changed: {:?}", change.name(), value);
    let msg = map(value);
    sender.output(msg).or_warn("unhandled message");
}

#[proxy(
    interface = "org.freedesktop.UPower.Device",
    default_service = "org.freedesktop.UPower",
    default_path = "/org/freedesktop/UPower/devices/DisplayDevice"
)]
trait Device {
    #[zbus(property, name = "Type")]
    fn device_type(&self) -> fdo::Result<DeviceType>;

    #[zbus(property, name = "State")]
    fn device_state(&self) -> fdo::Result<DeviceState>;

    #[zbus(property)]
    fn percentage(&self) -> fdo::Result<f64>;

    #[zbus(property)]
    fn energy(&self) -> fdo::Result<f64>;

    #[zbus(property)]
    fn energy_full(&self) -> fdo::Result<f64>;

    #[zbus(property)]
    fn energy_rate(&self) -> fdo::Result<f64>;

    #[zbus(property)]
    fn time_to_empty(&self) -> fdo::Result<i64>;

    #[zbus(property)]
    fn time_to_full(&self) -> fdo::Result<i64>;

    #[zbus(property)]
    fn is_present(&self) -> fdo::Result<bool>;

    #[zbus(property)]
    fn icon_name(&self) -> fdo::Result<String>;

    #[zbus(property)]
    fn warning_level(&self) -> fdo::Result<WarningLevel>;
}

#[derive(Type, OwnedValue, Serialize_repr, Deserialize_repr)]
#[repr(u32)]
enum DeviceType {
    Unknown = 0,
    LinePower = 1,
    Battery = 2,
    Ups = 3,
    Monitor = 4,
    Mouse = 5,
    Keyboard = 6,
    Pda = 7,
    Phone = 8,
    MediaPlayer = 9,
    Tablet = 10,
    Computer = 11,
    GamingInput = 12,
    Pen = 13,
    Touchpad = 14,
    Modem = 15,
    Network = 16,
    Headset = 17,
    Speakers = 18,
    Headphones = 19,
    Video = 20,
    OtherAudio = 21,
    RemoteControl = 22,
    Printer = 23,
    Scanner = 24,
    Camera = 25,
    Wearable = 26,
    Toy = 27,
    BluetoothGeneric = 28,
}

#[derive(Type, OwnedValue, Serialize_repr, Deserialize_repr)]
#[repr(u32)]
enum DeviceState {
    Unknown = 0,
    Charging = 1,
    Discharging = 2,
    Empty = 3,
    FullyCharged = 4,
    PendingCharge = 5,
    PendingDischarge = 6,
}

#[derive(Type, OwnedValue, Serialize_repr, Deserialize_repr)]
#[repr(u32)]
enum WarningLevel {
    Unknown = 0,
    None = 1,
    Discharging = 2,
    Low = 3,
    Critical = 4,
    Action = 5,
}
