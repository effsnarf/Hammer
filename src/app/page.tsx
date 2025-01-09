"use client"
import { useRef, useState } from "react";
import List from "./components/list/list";
import Popup, { PopupHandle } from "./components/popup";
import ProjectEditor from "./components/project/editor";
import ProjectRow from "./components/project/row";
import { Project } from "./components/project/types";
import { Objects, ReactiveValue } from "./util";

export default function Home() {
  const popup1 = useRef<PopupHandle>(null);

  const loopMasters = {
    briefing: null,
    research: null,
    strategy: null,
    presentation: null
  };

  const projects = ReactiveValue.from([
    { _id: 1, name: 'Project name A', progress: 0, projectId: '2409XC2K8', status: 'new', loopMasters: Objects.clone(loopMasters) },
    { _id: 2, name: 'Project name B', progress: 10, projectId: '2409XC2K8', status: 'inprog', loopMasters: Objects.clone(loopMasters) },
    { _id: 3, name: 'Project name 2', progress: 20, projectId: '2409XC2K8', status: 'inprog', loopMasters: Objects.clone(loopMasters) },
    { _id: 4, name: 'Project name 3', progress: 30, projectId: '2409XC2K8', status: 'inprog', loopMasters: Objects.clone(loopMasters) },
    { _id: 5, name: 'Project name 4', progress: 40, projectId: '2409XC2K8', status: 'finished', loopMasters: Objects.clone(loopMasters) },
    { _id: 6, name: 'Project name 5', progress: 50, projectId: '2409XC2K8', status: 'finished', loopMasters: Objects.clone(loopMasters) },
    { _id: 7, name: 'Project name 6', progress: 60, projectId: '2409XC2K8', status: 'finished', loopMasters: Objects.clone(loopMasters) },
  ]);

  const selected = {
    project: ReactiveValue.from(null as Project | null)
  }

  const saveEditedProject = (project: Project) => {
    projects.set((item: Project) => (item._id == project._id), project);
    popup1.current?.close();
  }

  return (
    <div>
      <div className="bg1">
        <div className="menu">
          <img className="agency-logo" src="/images/agency-logo.png" />
          <ul>
            <li>
              <img src="/images/menu/menu1.png" />
              <div>My projects</div>
            </li>
            <li>
              <img src="/images/menu/menu2.png" />
              <div>All projects</div>
            </li>
            <li>
              <img src="/images/menu/menu3.png" />
              <div>Messages</div>
            </li>
            <li>
              <img src="/images/menu/menu4.png" />
              <div>All contacts</div>
            </li>
          </ul>
        </div>
        <div className="main">
          <div className="main-header">
            <img src="/images/notifications.png" />
            <div>Account Name</div>
            <img className="user" src="/images/user.jpg" />
          </div>
          <div className="main-body">
            <div className="panel1">
              <div className="header">
                <div className="title">All projects</div>
                <div className="flex1">
                  <div className="search">
                    <input className="flex-grow" type="search" placeholder="Search for Project" />
                    <img src="/images/search.png" width="20" height="20" />
                  </div>
                  <img src="/images/more.png" width="17" height="10" />
                  </div>
              </div>
              <div className="content">
                <div className="scrollable">

                <List<Project>
                  type="table"
                  items={projects.value}
                  renderItem={(project, index, stagger) => 
                    <ProjectRow
                      key={index}
                      stagger={stagger}
                      project={project}
                      onClick={() => { selected.project.set(project); popup1.current?.open(); }}
                    />
                  }
                />
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div>
        <Popup ref={popup1} onClose={() => selected.project.set(null)}>
          <ProjectEditor project={selected.project.value} onSave={saveEditedProject} />
        </Popup>
      </div>

    </div>
  );
}
