"use client";
import React from "react";
import { LoopMaster, LoopMasters, Project } from "./types";
import { Reactive } from "@/app/util";
import List from "../list/list";
import DropDown from "../ui/input/dropdown";
import { WebImage } from "@/app/types";

interface ProjectEditorProps {
  project: Project | null;
  onSave: (project: Project) => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave }) => {
  if (!project) return null;

  const loopMasters = [
    null,
    { name: "John Doe" },
    { name: "Jane Doe" },
    { name: "John Smith" },
    { name: "Jane Smith" },
  ];
  const hint = `Choose loop master`;

  const edited = {
    project: Reactive.value(project),
  };

  const lmTypes = [
    {
      field: "briefing",
      title: "Briefing loop",
      color: "#9B2BF2",
      icon: {
        url: "/images/loop-master/briefing.png",
        width: 16,
        height: 14,
      } as WebImage,
    },
    {
      field: "research",
      title: "Research loop",
      color: "#8A38F5",
      icon: {
        url: "/images/loop-master/research.png",
        width: 16,
        height: 14,
      } as WebImage,
    },
    {
      field: "strategy",
      title: "Strategy loop",
      color: "#7234F8",
      icon: {
        url: "/images/loop-master/strategy.png",
        width: 16,
        height: 14,
      } as WebImage,
    },
    {
      field: "presentation",
      title: "Presentation",
      color: "#389AF5",
      icon: {
        url: "/images/loop-master/presentation.png",
        width: 16,
        height: 14,
      } as WebImage,
    },
  ];

  return (
    <div>
      <h2>{edited.project.value.name}</h2>
      <h3>Assign the loop masters</h3>
      <List
        gap="0.5em"
        items={lmTypes}
        renderItem={(lmType, index) => (
          <DropDown<LoopMaster>
            key={index}
            title={lmType.title}
            color={lmType.color}
            icon={lmType.icon}
            items={loopMasters}
            selectedItem={
              (edited.project.value.loopMasters as LoopMasters)[
                lmType.field as keyof LoopMasters
              ] ?? null
            }
            getItemImage={(lm) => (!lm ? null : "/images/loop-master.png")}
            getItemText={(lm) => (!lm ? "[none]" : lm.name)}
            onSelect={(lm) => {
              edited.project.set(["loopMasters", lmType.field], lm);
            }}
            hint={hint}
          />
        )}
      />
      <div
        className="button solid"
        onClick={() => onSave(edited.project.value)}
        style={{ background: "#8938F4", marginTop: "3em" }}
      >
        Confirm
      </div>
    </div>
  );
};

ProjectEditor.displayName = "ProjectEditor";

export default ProjectEditor;
