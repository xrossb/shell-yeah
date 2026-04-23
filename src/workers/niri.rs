use std::sync::Arc;

use niri_ipc::{
    Action, Event, Request, Workspace, WorkspaceReferenceArg, socket::Socket,
};
use relm4::{Worker, spawn_blocking};

use crate::util::ResultExt;

pub struct NiriWorker {
    command_socket: Option<Socket>,
}

#[derive(Clone, Debug)]
pub enum NiriCmd {
    FocusWorkspace(u64),
}

#[derive(Clone, Debug)]
pub enum NiriMsg {
    WorkspacesChanged {
        workspaces: Arc<Vec<Workspace>>,
    },
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

impl Worker for NiriWorker {
    type Init = ();
    type Input = NiriCmd;
    type Output = NiriMsg;

    fn init(_: Self::Init, sender: relm4::ComponentSender<Self>) -> Self {
        let command_socket = Socket::connect().ok();
        let event_socket = Socket::connect().ok();

        if let Some(mut socket) = event_socket {
            spawn_blocking(move || {
                let res = match socket.send(Request::EventStream) {
                    Err(err) => {
                        log::warn!("cannot send niri request: {err}");
                        return;
                    }
                    Ok(res) => res,
                };

                if let Err(err) = res {
                    log::warn!("niri returned an error: {err}");
                    return;
                }

                let mut read_event = socket.read_events();

                loop {
                    let event = match read_event() {
                        Err(err) => {
                            log::warn!("niri returned an error: {err}");
                            continue;
                        }
                        Ok(event) => event,
                    };

                    let msg = match event {
                        Event::WorkspacesChanged { mut workspaces } => {
                            workspaces.sort_by(|a, b| a.idx.cmp(&b.idx));
                            NiriMsg::WorkspacesChanged {
                                workspaces: Arc::new(workspaces),
                            }
                        }
                        Event::WorkspaceActivated { id, .. } => {
                            NiriMsg::WorkspaceActivated { id }
                        }
                        Event::WorkspaceActiveWindowChanged {
                            workspace_id,
                            active_window_id,
                        } => NiriMsg::WorkspaceActiveWindowChanged {
                            workspace_id,
                            active_window_id,
                        },
                        Event::WorkspaceUrgencyChanged { id, urgent } => {
                            NiriMsg::WorkspaceUrgencyChanged { id, urgent }
                        }
                        _ => continue,
                    };

                    sender.output(msg).or_warn("unhandled message")
                }
            });
        }

        Self { command_socket }
    }

    fn update(&mut self, msg: Self::Input, _: relm4::ComponentSender<Self>) {
        match msg {
            NiriCmd::FocusWorkspace(id) => {
                self.send(Request::Action(Action::FocusWorkspace {
                    reference: WorkspaceReferenceArg::Id(id),
                }))
            }
        }
    }
}

impl NiriWorker {
    fn send(&mut self, req: Request) {
        let socket = match self.command_socket.as_mut() {
            Some(socket) => socket,
            None => return,
        };

        let res = match socket.send(req) {
            Err(err) => {
                log::warn!("cannot send niri request: {err}");
                return;
            }
            Ok(res) => res,
        };

        if let Err(err) = res {
            log::warn!("niri returned an error: {err}")
        }
    }
}
