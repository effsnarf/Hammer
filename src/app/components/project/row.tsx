import React from 'react';
import { Project } from './types';

interface ProjectRowProps {
  stagger?: string,
  project: Project,
  onClick?: () => void
}

const ProjectRow: React.FC<ProjectRowProps> = ({ stagger, project, onClick }) => {
  const statusText = project.status === 'new' ? 'New project' : project.status === 'inprog' ? 'In progress' : 'Finished';

  return (
    <tr className={(`clickable status-${project.status}`)} onClick={onClick} style={ { animationDelay: (`${(stagger)}`) } }>
      <td className={`fs-17px`}>{project.name}</td>
      <td className={`fs-20px`}>{project.progress}%</td>
      <td className={`fs-11px`}>Project ID: {project.projectId}</td>
      <td>
        <a className="button" target="_blank" href="https://i.imgur.com/uFGWFm0.jpeg" onClick={(e) => e.stopPropagation()}>
          Download
          <img src="/images/download.png" />
        </a>
      </td>
      <td></td>
      <td>
        <div className="flex justify-end gap-2">
          <div className="dimmed fs-13px">More Info</div>
          <img src="/images/info.png" />
        </div>
      </td>
      <td>
        <div className="flex justify-end">
          <div className={`fs-13px status label ${status}`}>{statusText}</div>
        </div>
      </td>
      <td>
        <img src="/images/arrow-drop-down.png" />
      </td>
    </tr>
  );
};


ProjectRow.displayName = 'ProjectRow';

export default ProjectRow;
