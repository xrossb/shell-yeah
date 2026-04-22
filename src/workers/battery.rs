use relm4::Worker;
use zbus::{Connection, fdo, proxy};

pub struct BatteryWorker;

impl Worker for BatteryWorker {
    type Init = ();
    type Input = ();
    type Output = ();

    fn init(_init: Self::Init, _sender: relm4::ComponentSender<Self>) -> Self {
        relm4::spawn(async move {
            let conn = Connection::system().await.unwrap();
            let proxy = UPowerProxy::new(&conn).await.unwrap();
            let device = proxy.get_display_device().await.unwrap();
            dbg!(device.percentage().await.unwrap());
        });
        Self
    }

    fn update(&mut self, _message: Self::Input, _sender: relm4::ComponentSender<Self>) {}
}

#[proxy(interface = "org.freedesktop.UPower", assume_defaults = true)]
trait UPower {
    #[zbus(object = "Device")]
    fn get_display_device(&self);
}

#[proxy(
    interface = "org.freedesktop.UPower.Device",
    default_service = "org.freedesktop.UPower"
)]
trait Device {
    #[zbus(property)]
    fn percentage(&self) -> fdo::Result<f64>;
}
