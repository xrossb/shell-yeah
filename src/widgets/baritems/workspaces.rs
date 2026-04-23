use relm4::gtk::{gdk, prelude::*};
use relm4::prelude::*;

use crate::util::ResultExt;
use crate::workers::{NiriCmd, NiriMsg};

pub struct WorkspacesItem {
    workspaces: FactoryVecDeque<Workspace>,
}

#[relm4::component(pub)]
impl SimpleComponent for WorkspacesItem {
    type Init = ();
    type Input = NiriMsg;
    type Output = NiriCmd;

    view! {
        gtk::Box {
            #[local_ref]
            workspaces_box -> gtk::Box {},
        },
    }

    fn init(
        _: Self::Init,
        root: Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let workspaces = FactoryVecDeque::builder()
            .launch(gtk::Box::default())
            .forward(sender.output_sender(), |msg| msg);

        let model = WorkspacesItem { workspaces };

        let workspaces_box = model.workspaces.widget();
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _: ComponentSender<Self>) {
        match msg {
            NiriMsg::WorkspacesChanged { mut workspaces } => {
                workspaces.sort_by(|a, b| a.idx.cmp(&b.idx));
                let mut guard = self.workspaces.guard();
                guard.clear();
                for ws in workspaces {
                    guard.push_back(Workspace {
                        id: ws.id,
                        idx: ws.idx,
                        is_active: ws.is_active,
                        is_empty: ws.active_window_id.is_none(),
                        is_urgent: ws.is_urgent,
                    });
                }
            }
            NiriMsg::WorkspaceActivated { id } => {
                self.workspaces
                    .broadcast(WorkspaceMsg::WorkspaceActivated { id });
            }
            NiriMsg::WorkspaceActiveWindowChanged {
                workspace_id,
                active_window_id,
            } => self.workspaces.broadcast(
                WorkspaceMsg::WorkspaceActiveWindowChanged {
                    workspace_id,
                    active_window_id,
                },
            ),
            NiriMsg::WorkspaceUrgencyChanged { id, urgent } => {
                self.workspaces.broadcast(
                    WorkspaceMsg::WorkspaceUrgencyChanged { id, urgent },
                )
            }
        }
    }
}

struct Workspace {
    id: u64,
    idx: u8,
    is_active: bool,
    is_empty: bool,
    is_urgent: bool,
}

#[derive(Clone, Debug)]
enum WorkspaceMsg {
    Clicked,
    WorkspaceActivated {
        id: u64,
    },
    WorkspaceActiveWindowChanged {
        workspace_id: u64,
        active_window_id: Option<u64>,
    },
    WorkspaceUrgencyChanged {
        id: u64,
        urgent: bool,
    },
}

#[relm4::factory]
impl FactoryComponent for Workspace {
    type Init = Workspace;
    type Input = WorkspaceMsg;
    type Output = NiriCmd;
    type CommandOutput = ();
    type ParentWidget = gtk::Box;

    view! {
        gtk::Box {
            add_css_class: "item",
            add_css_class: "workspace",
            #[watch]
            set_class_active[self.is_active]: "active",
            #[watch]
            set_class_active[self.is_empty]: "empty",
            #[watch]
            set_class_active[self.is_urgent]: "urgent",

            add_controller = gtk::GestureClick {
                set_button: gdk::BUTTON_PRIMARY,
                connect_released[sender] => move |_, _, _, _| {
                    sender.input(WorkspaceMsg::Clicked);
                },
            },

            gtk::Label {
                set_label: &self.idx.to_string(),
                set_valign: gtk::Align::BaselineCenter,
            },
        },
    }

    fn init_model(
        init: Self::Init,
        _: &Self::Index,
        _: FactorySender<Self>,
    ) -> Self {
        Self {
            id: init.id,
            idx: init.idx,
            is_active: init.is_active,
            is_empty: init.is_empty,
            is_urgent: init.is_urgent,
        }
    }

    fn update(&mut self, msg: Self::Input, sender: FactorySender<Self>) {
        match msg {
            WorkspaceMsg::Clicked => sender
                .output(NiriCmd::FocusWorkspace(self.id))
                .or_warn("unhandled message"),
            WorkspaceMsg::WorkspaceActivated { id } => {
                self.is_active = id == self.id
            }
            WorkspaceMsg::WorkspaceActiveWindowChanged {
                workspace_id,
                active_window_id,
            } => {
                if self.id == workspace_id {
                    self.is_empty = active_window_id.is_none()
                }
            }
            WorkspaceMsg::WorkspaceUrgencyChanged { id, urgent } => {
                if self.id == id {
                    self.is_urgent = urgent
                }
            }
        }
    }
}
