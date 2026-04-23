pub trait ResultExt {
    fn or_warn(self, msg: impl AsRef<str>);
}

impl<E: std::fmt::Debug> ResultExt for Result<(), E> {
    fn or_warn(self, msg: impl AsRef<str>) {
        self.unwrap_or_else(|err| log::warn!("{}: {:?}", msg.as_ref(), err));
    }
}
