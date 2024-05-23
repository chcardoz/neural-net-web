export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

export type GraphNode = { id: string; group: number };
export type GraphLink = { source: string; target: string; value: number };
