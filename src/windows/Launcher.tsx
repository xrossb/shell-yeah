import { createBinding, createEffect, createState } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import AstalNiri from "gi://AstalNiri?version=0.1"
import Gio from "gi://Gio?version=2.0"
import Pango from "gi://Pango?version=1.0"
import Icon from "@/src/components/Icon"
import Popup from "@/src/components/Popup"
import * as search from "@/src/lib/search"
import * as apps from "@/src/lib/search/apps"
import * as bar from "@/src/windows/Bar"
import createDebounce from "../lib/createDebounce"

const name = "launcher"
const maxWidthPixels = 700
const maxWidthPercent = 0.8
const maxHeightPixels = 500
const maxHeightPercent = 0.8

/**
 * App launcher modal.
 */
export default function Launcher() {
  let popup: Astal.Window
  let entry: Gtk.Entry
  let listbox: Gtk.ListBox
  let scroller: Gtk.ScrolledWindow

  const [width, setWidth] = createState(0)
  const [height, setHeight] = createState(0)
  const [margin, setMargin] = createState(0)
  const [query, setQuery] = createState("")

  const niri = AstalNiri.get_default()
  const resultStore = new Gio.ListStore<search.Result>()
  const searchPlugins = new search.Registry()
  searchPlugins.register(new apps.Plugin())

  function placeWindow() {
    const output = niri.focusedOutput
    const workarea = {
      w: output.logical.get_width(),
      h: output.logical.get_height() - bar.height(),
    }

    const newWidth = Math.min(maxWidthPercent * workarea.w, maxWidthPixels)
    const newHeight = Math.min(maxHeightPercent * workarea.h, maxHeightPixels)
    const newMargin = (workarea.h - newHeight) / 2

    setWidth(newWidth)
    setHeight(newHeight)
    setMargin(newMargin)

    popup.gdkmonitor = app.monitors.find(
      monitor => monitor.model === output.model,
    )!
    entry.grab_focus()
  }

  function scrollTo(row: Gtk.ListBoxRow) {
    scroller.vadjustment.set_value(
      row.get_allocation().y - scroller.get_height() / 2 + row.get_height() / 2,
    )
  }

  function onEnter() {
    const row = listbox.get_selected_row()
    if (!row) return

    const result = resultStore.get_item(row.get_index())
    if (!result) return

    result.run({
      close() {
        popup.hide()
      },
    })
  }

  function selectNext() {
    const row = listbox.get_selected_row()
    if (!row) return

    const next = listbox.get_row_at_index(row.get_index() + 1)
    if (!next) return

    listbox.select_row(next)
    scrollTo(next)
  }

  function selectPrev() {
    const row = listbox.get_selected_row()
    if (!row) return

    const prev = listbox.get_row_at_index(row.get_index() - 1)
    if (!prev) return

    listbox.select_row(prev)
    scrollTo(prev)
  }

  const resultsVisible = createBinding(resultStore, "nItems").as(n => !!n)

  const searchDebounced = createDebounce(80, (query: string) => {
    const results = searchPlugins.search(query)
    resultStore.splice(0, resultStore.nItems, results)
    if (resultStore.nItems) {
      const first = listbox.get_row_at_index(0)
      if (!first) return
      listbox.select_row(first)
      scrollTo(first)
    }
  })

  createEffect(() => {
    const q = query()
    searchDebounced(q)
  })

  return (
    <Popup
      name={name}
      namespace={name}
      anchor={Astal.WindowAnchor.TOP}
      width={width}
      height={height}
      marginTop={margin}
      $={self => (popup = self)}
      onNotifyVisible={() => placeWindow()}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <Gtk.EventControllerKey
          onKeyPressed={(_self, keyval) => {
            switch (keyval) {
              case Gdk.KEY_Down:
                selectNext()
                return
              case Gdk.KEY_Up:
                selectPrev()
                return
            }
          }}
        />
        <entry
          $={self => (entry = self)}
          placeholderText="type something..."
          heightRequest={50}
          onNotifyText={() => setQuery(entry.text)}
          onActivate={onEnter}
        />
        <box
          visible={resultsVisible}
          orientation={Gtk.Orientation.VERTICAL}
          canFocus={false}
          spacing={8}
        >
          <Gtk.Separator />
          <Gtk.ScrolledWindow
            propagateNaturalHeight
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            $={self => (scroller = self)}
          >
            <Gtk.ListBox
              $={self => {
                listbox = self
                self.bind_model(resultStore, ListResult)
              }}
              onRowActivated={onEnter}
            />
          </Gtk.ScrolledWindow>
        </box>
      </box>
    </Popup>
  )
}

function ListResult(result: search.Result) {
  return (
    <box spacing={8}>
      <Icon icon={result.icon} size={36} />
      <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER}>
        <label
          class="title"
          label={result.title}
          ellipsize={Pango.EllipsizeMode.END}
          halign={Gtk.Align.START}
        />
        <label
          class="description"
          label={result.description}
          ellipsize={Pango.EllipsizeMode.END}
          halign={Gtk.Align.START}
        />
      </box>
    </box>
  ) as Gtk.Widget
}
