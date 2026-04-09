import { For, With, createBinding } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"
import AstalApps from "gi://AstalApps?version=0.1"
import AstalMpris from "gi://AstalMpris?version=0.1"
import AstalWp from "gi://AstalWp?version=0.1"
import Gio from "gi://Gio?version=2.0"
import Pango from "gi://Pango?version=1.0"
import Popup from "@/src/components/Popup"

const name = "audio-menu"

/**
 * Audio settings modal.
 */
export default function AudioMenu() {
  const { TOP, RIGHT } = Astal.WindowAnchor

  return (
    <Popup
      name={name}
      namespace={name}
      width={300}
      anchor={TOP | RIGHT}
      margin={8}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={16}>
        <DeviceControls />
        <PlayerList />
      </box>
    </Popup>
  )
}

function DeviceControls() {
  const wp = AstalWp.get_default()
  const speaker = createBinding(wp, "defaultSpeaker")
  const microphone = createBinding(wp, "defaultMicrophone")

  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      <With value={speaker}>
        {(speaker) => (
          <DeviceSlider
            endpoint={speaker}
            icons={{ normal: "sy-volume-high", mute: "sy-volume-off" }}
          />
        )}
      </With>
      <With value={microphone}>
        {(microphone) => (
          <DeviceSlider
            endpoint={microphone}
            icons={{ normal: "sy-mic", mute: "sy-mic-off" }}
          />
        )}
      </With>
    </box>
  )
}

type SliderProps = {
  endpoint: AstalWp.Endpoint
  icons: {
    normal: string
    mute: string
  }
}

function DeviceSlider({ endpoint, icons }: SliderProps) {
  const volume = createBinding(endpoint, "volume")
  const mute = createBinding(endpoint, "mute")

  return (
    <box>
      <button class="no-bg" onClicked={() => (endpoint.mute = !endpoint.mute)}>
        <image
          iconName={mute.as((m) => (m ? icons?.mute : icons?.normal))}
          pixelSize={20}
        />
      </button>
      <slider
        hexpand
        value={volume}
        onChangeValue={({ value }) => {
          endpoint.volume = value
        }}
      />
      <button class="no-bg">
        <image iconName="sy-chevron-right" pixelSize={20} />
      </button>
    </box>
  )
}

function PlayerList() {
  const mpris = AstalMpris.get_default()
  const players = createBinding(mpris, "players")

  return <For each={players}>{(player) => <Player player={player} />}</For>
}

type PlayerProps = {
  player: AstalMpris.Player
}

function Player({ player }: PlayerProps) {
  return (
    <overlay class="player" heightRequest={150}>
      <PlayerArt player={player} />
      <PlayerContent player={player} />
    </overlay>
  )
}

function PlayerArt({ player }: PlayerProps) {
  const coverArt = createBinding(player, "coverArt").as((c) =>
    Gio.file_new_for_path(c),
  )

  return (
    <Adw.Clamp $type={"overlay"}>
      <Gtk.Picture
        class="art"
        file={coverArt}
        contentFit={Gtk.ContentFit.COVER}
      />
    </Adw.Clamp>
  )
}

function PlayerContent({ player }: PlayerProps) {
  const apps = new AstalApps.Apps()
  const title = createBinding(player, "title").as((t) => t || "Unknown Track")
  const artist = createBinding(player, "artist").as(
    (a) => a || "Unknown Artist",
  )
  const playIcon = createBinding(player, "playbackStatus").as((s) =>
    s === AstalMpris.PlaybackStatus.PLAYING
      ? "sy-player-pause"
      : "sy-player-play",
  )
  const app = apps.list.find((a) => a.entry === player.entry)

  return (
    <box
      class="content"
      $type="overlay"
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <box>
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={4}
          valign={Gtk.Align.START}
        >
          <label
            label={title}
            hexpand
            halign={Gtk.Align.START}
            ellipsize={Pango.EllipsizeMode.END}
            maxWidthChars={30}
          />
          <label
            label={artist}
            halign={Gtk.Align.START}
            ellipsize={Pango.EllipsizeMode.END}
            maxWidthChars={35}
          />
        </box>
        <box hexpand />
        <box spacing={4} valign={Gtk.Align.START}>
          <image iconName={app?.iconName} pixelSize={20} />
          <label label={player.identity} />
        </box>
      </box>
      <box vexpand />
      <box>
        <box
          visible={createBinding(player, "length").as((l) => l > 0)}
          valign={Gtk.Align.END}
        >
          <label
            cssClasses={["position"]}
            label={createBinding(player, "position").as((l) =>
              l > 0 ? lengthStr(l) : "0:00",
            )}
          />
          <label label={" / "} />
          <label
            cssClasses={["length"]}
            label={createBinding(player, "length").as((l) =>
              l > 0 ? lengthStr(l) : "0:00",
            )}
          />
        </box>
        <box hexpand />
        <box class={"buttons"} spacing={8} valign={Gtk.Align.END}>
          <button
            class="no-bg"
            onClicked={() => player.previous()}
            focusOnClick={false}
            visible={createBinding(player, "canGoPrevious")}
          >
            <image iconName="sy-player-prev" pixelSize={20} />
          </button>
          <button
            class="no-bg"
            onClicked={() => player.play_pause()}
            focusOnClick={false}
            visible={createBinding(player, "canControl")}
          >
            <image iconName={playIcon} pixelSize={20} />
          </button>
          <button
            class="no-bg"
            onClicked={() => player.next()}
            focusOnClick={false}
            visible={createBinding(player, "canGoNext")}
          >
            <image iconName="sy-player-next" pixelSize={20} />
          </button>
        </box>
      </box>
    </box>
  )
}

function lengthStr(length: number): string {
  const hours = Math.floor(length / 3600)
  const minutes = Math.floor((length % 3600) / 60)
  const seconds = Math.floor(length % 60)

  const formatTime = (value: number): string =>
    value < 10 ? `0${value}` : `${value}`

  if (hours > 0) {
    return `${hours}:${formatTime(minutes)}:${formatTime(seconds)}`
  }

  return `${minutes}:${formatTime(seconds)}`
}
