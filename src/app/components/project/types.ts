type LoopMaster = {
  name: string;
};

type Project = {
  _id: number;
  name: string;
  progress: number;
  projectId: string;
  status: string;
  loopMasters: {
    briefing: LoopMaster;
    research: LoopMaster;
    strategy: LoopMaster;
    presentation: LoopMaster;
  };
};

export type { Project };
