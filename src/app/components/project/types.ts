type LoopMaster = {
  name: string;
};

type LoopMasters = {
  briefing: LoopMaster;
  research: LoopMaster;
  strategy: LoopMaster;
  presentation: LoopMaster;
};

type Project = {
  _id: number;
  name: string;
  progress: number;
  projectId: string;
  status: string;
  loopMasters: LoopMasters;
};

export type { Project };
