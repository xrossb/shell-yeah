pub struct NetworkWorker {}

pub enum NetworkMsg {
    WiredStateChanged(DeviceState),
    WifiStateChanged(DeviceState),
}

#[non_exhaustive]
#[repr(u32)]
pub enum DeviceState {
    Unknown = 0,
    Unmanaged = 10,
    Unavailable = 20,
    Disconnected = 30,
    Prepare = 40,
    Config = 50,
    NeedAuth = 60,
    IPConfig = 70,
    IPCheck = 80,
    Secondaries = 90,
    Activated = 100,
    Deactivating = 110,
    Failed = 120,
}
