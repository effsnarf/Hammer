"use client"
import React from 'react';
import UiInputDropDown from '../ui/input/dropdown';
import { Project } from './types';
import { ReactiveValue } from '@/app/util';
import List from '../list/list';

interface ProjectEditorProps {
  project: Project | null;
  onSave: (project: Project) => void;
}

type LmType = {
  field: string,
  title: string,
  color: string,
  icon: string
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave }) => {

  if (!project) return null;

  const loopMasters = ['LM Name 1', 'LM Name 2', 'LM Name 3'];
  const hint = `Choose loop master`;

  const edited = {
    project: ReactiveValue.from(project),
  }

  const lmTypes = [
    {
      field: 'briefing',
        title: "Briefing loop",
        color: "#9B2BF2",
        icon: "/images/loop-master/briefing.png",
    },
    {
      field: 'research',
        title: "Research loop",
        color: "#8A38F5",
        icon: "/images/loop-master/research.png",
    },
    {
      field: 'strategy',
        title: "Strategy loop",
        color: "#7234F8",
        icon: "/images/loop-master/strategy.png",
    },
    {
      field: 'presentation',
        title: "Presentation",
        color: "#389AF5",
        icon: "/images/loop-master/presentation.png",
    }
  ] as LmType[];

  return (
    <div>
      <h2>{edited.project.value.name}</h2>
      <h3>Assign the loop masters</h3>
      <List gap='0.5em' items={lmTypes} renderItem={(lmType, index) => (
        <UiInputDropDown
            key={index}
            title={lmType.title}
            color={lmType.color}
            icon={lmType.icon}
            items={loopMasters}
            selectedItem={(edited.project.value.loopMasters as LoopMasters)[lmType.field]}
            getItemImage={() => '/images/loop-master.png'}
            getItemText={(lm) => lm}
            onSelect={(lm) => { edited.project.set(['loopMasters', lmType.field], lm) } }
            hint={hint}
        />
      )} />
      <div className="button solid" onClick={() => onSave(edited.project.value)} style={{ background: '#8938F4', marginTop: '3em' } }>Confirm</div>
    </div>
  );
};

ProjectEditor.displayName = 'ProjectEditor';

export default ProjectEditor;
