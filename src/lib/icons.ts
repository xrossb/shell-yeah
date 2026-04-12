export const icons = {
  search: "sy-launcher-symbolic",
  poweroff: "sy-power-symbolic",

  close: "sy-close-symbolic",
  arrows: {
    right: "sy-chevron-right-symbolic",
  },

  notifications: {
    unread: "sy-notifications-unread-symbolic",
    off: "sy-notifications-off-symbolic",
  },

  battery: {
    charged: "sy-battery-charged-symbolic",
    charging: "sy-battery-charging-symbolic",
    draining: [
      "sy-battery-critical-symbolic",
      "sy-battery-15-symbolic",
      "sy-battery-30-symbolic",
      "sy-battery-45-symbolic",
      "sy-battery-60-symbolic",
      "sy-battery-75-symbolic",
      "sy-battery-90-symbolic",
      "sy-battery-full-symbolic",
    ],
    byPercent(percent: number) {
      const i = Math.floor(percent * this.draining.length)
      return this.draining[i]
    },
  },

  volume: {
    high: "sy-volume-high-symbolic",
    mid: "sy-volume-mid-symbolic",
    low: "sy-volume-low-symbolic",
    off: "sy-volume-off-symbolic",
    byPercent(percent: number) {
      if (percent <= 0.25) return this.low
      if (percent <= 0.5) return this.mid
      return this.high
    },
  },
  mic: {
    on: "sy-mic-symbolic",
    off: "sy-mic-off-symbolic",
  },

  player: {
    play: "sy-player-play-symbolic",
    pause: "sy-player-pause-symbolic",
    prev: "sy-player-prev-symbolic",
    next: "sy-player-next-symbolic",
  },

  bluetooth: {
    connected: "sy-bluetooth-connected-symbolic",
    on: "sy-bluetooth-on-symbolic",
    off: "sy-bluetooth-off-symbolic",
  },

  network: {
    wifi: {
      strong: "sy-wifi-strong-symbolic",
      mid: "sy-wifi-mid-symbolic",
      weak: "sy-wifi-weak-symbolic",
      off: "sy-wifi-off-symbolic",
      byPercent(percent: number) {
        if (percent <= 0.25) return this.weak
        if (percent <= 0.5) return this.mid
        return this.strong
      },
    },
    wired: {
      on: "sy-lan-symbolic",
      off: "sy-lan-off-symbolic",
    },
  },
}
