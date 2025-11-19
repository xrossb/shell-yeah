export const Config = {
  animation: {
    short: 300,
    long: 3000,
  },
  windowName: {
    bar: "bar",
  },
  format: {
    clock: "%a, %d %b · %I:%M %P",
  },
  icon: {
    size: {
      tray: 16,
      indicator: 20,
    },
    battery: {
      draining: [
        "sy-battery-alert-symbolic",
        "sy-battery-7-symbolic",
        "sy-battery-6-symbolic",
        "sy-battery-5-symbolic",
        "sy-battery-4-symbolic",
        "sy-battery-3-symbolic",
        "sy-battery-2-symbolic",
        "sy-battery-1-symbolic",
        "sy-battery-0-symbolic",
      ],
      charging: "sy-bolt-symbolic",
      plugged: "sy-plug-symbolic",
    },
    bluetooth: {
      on: "sy-bluetooth-symbolic",
      off: "sy-bluetooth-disabled-symbolic",
      connected: "sy-bluetooth-connected-symbolic",
    },
  },
  spacing: {
    small: 4,
    mid: 16,
  },
  sizing: {
    bar: 30,
    trayIcon: 16,
    indicatorIcon: 20,
  },
}
