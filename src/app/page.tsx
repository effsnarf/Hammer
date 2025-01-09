"use client";
import { useRef } from "react";
import Image from "next/image";
import List from "./components/list/list";
import Popup, { PopupHandle } from "./components/popup";
import ProjectEditor from "./components/project/editor";
import ProjectRow from "./components/project/row";
import { Project } from "./components/project/types";
import { Objects, Reactive } from "./util";

export default function Home() {
  const popup1 = useRef<PopupHandle>(null);

  const loopMasters = {
    briefing: null,
    research: null,
    strategy: null,
    presentation: null,
  };

  const projects = Reactive.array([
    {
      _id: 1,
      name: "Project name A",
      progress: 0,
      projectId: "2409XC2K8",
      status: "new",
      loopMasters: Objects.clone(loopMasters),
    },
    {
      _id: 2,
      name: "Project name B",
      progress: 10,
      projectId: "2409XC2K8",
      status: "inprog",
      loopMasters: Objects.clone(loopMasters),
    },
    {
      _id: 3,
      name: "Project name 2",
      progress: 20,
      projectId: "2409XC2K8",
      status: "inprog",
      loopMasters: Objects.clone(loopMasters),
    },
    {
      _id: 4,
      name: "Project name 3",
      progress: 30,
      projectId: "2409XC2K8",
      status: "inprog",
      loopMasters: Objects.clone(loopMasters),
    },
    {
      _id: 5,
      name: "Project name 4",
      progress: 40,
      projectId: "2409XC2K8",
      status: "finished",
      loopMasters: Objects.clone(loopMasters),
    },
    {
      _id: 6,
      name: "Project name 5",
      progress: 50,
      projectId: "2409XC2K8",
      status: "finished",
      loopMasters: Objects.clone(loopMasters),
    },
    {
      _id: 7,
      name: "Project name 6",
      progress: 60,
      projectId: "2409XC2K8",
      status: "finished",
      loopMasters: Objects.clone(loopMasters),
    },
  ]);

  const selected = {
    project: Reactive.value(null as Project | null),
  };

  const saveEditedProject = (project: Project) => {
    projects.set((item: Project) => item._id == project._id, project);
    popup1.current?.close();
  };

  return (
    <div>
      <div className="bg1">
        <div className="menu">
          <Image
            className="agency-logo"
            src="/images/agency-logo.png"
            width="62"
            height="62"
            alt="agency logo"
          />
          <ul>
            <li>
              <Image
                src="/images/menu/menu1.png"
                width="14"
                height="14"
                alt="menu 1"
              />
              <div>My projects</div>
            </li>
            <li>
              <Image
                src="/images/menu/menu2.png"
                width="22"
                height="14"
                alt="menu 2"
              />
              <div>All projects</div>
            </li>
            <li>
              <Image
                src="/images/menu/menu3.png"
                width="16"
                height="12"
                alt="menu 2"
              />
              <div>Messages</div>
            </li>
            <li>
              <Image
                src="/images/menu/menu4.png"
                width="16"
                height="19"
                alt="menu 2"
              />
              <div>All contacts</div>
            </li>
          </ul>
        </div>
        <div className="main">
          <div className="main-header">
            <Image
              src="/images/notifications.png"
              width="30"
              height="30"
              alt="notifications"
            />
            <div>Account Name</div>
            <Image
              className="user"
              src="/images/user.jpg"
              width="57"
              height="57"
              alt="user"
            />
          </div>
          <div className="main-body">
            <div className="panel1">
              <div className="header">
                <div className="title">All projects</div>
                <div className="flex1">
                  <div className="search">
                    <input
                      className="flex-grow"
                      type="search"
                      placeholder="Search for Project"
                    />
                    <Image
                      src="/images/search.png"
                      width="20"
                      height="20"
                      alt="search"
                    />
                  </div>
                  <Image
                    src="/images/more.png"
                    width="17"
                    height="10"
                    alt="more"
                  />
                </div>
              </div>
              <div className="content">
                <div className="scrollable">
                  <List<Project>
                    type="table"
                    items={projects.items}
                    renderItem={(project, index, stagger) => (
                      <ProjectRow
                        key={index}
                        stagger={stagger}
                        project={project}
                        onClick={() => {
                          selected.project.set(project);
                          popup1.current?.open();
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Popup ref={popup1} onClose={() => selected.project.set(null)}>
          <ProjectEditor
            project={selected.project.value}
            onSave={saveEditedProject}
          />
        </Popup>
      </div>
    </div>
  );
}
