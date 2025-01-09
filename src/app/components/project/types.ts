type LoopMaster = {
  name: string;
};

type LoopMasters = {
  briefing: LoopMaster | null;
  research: LoopMaster | null;
  strategy: LoopMaster | null;
  presentation: LoopMaster | null;
};

type Project = {
  _id: number;
  name: string;
  progress: number;
  projectId: string;
  status: string;
  loopMasters: LoopMasters;
};

export type { Project, LoopMasters, LoopMaster };
