
// Claud generated dummy data base on the component
export type SearchResult = {
  id: string;
  type: "query" | "dashboard" | "user" | "network";
  title: string;
  badge?: string;
};

export const searchData = {
  queries: [
    {
      id: "q1",
      type: "query" as const,
      title: "Linea Checker",
      badge: "Linea Checker",
    },
    {
      id: "q2",
      type: "query" as const,
      title: "Copy of Base users statistics",
      badge: "Copy of Base users statistics",
    },
    {
      id: "q3",
      type: "query" as const,
      title: "Top 100 Base transactions by volume",
    },
    {
      id: "q4",
      type: "query" as const,
      title: "Daily active users on Optimism",
    },
  ],
  dashboards: [
    {
      id: "d1",
      type: "dashboard" as const,
      title: "Constellation of SUI, Base and OP top 100 users",
    },
    {
      id: "d2",
      type: "dashboard" as const,
      title: "Compute vs Base",
    },
    {
      id: "d3",
      type: "dashboard" as const,
      title: "Chorus One",
    },
    {
      id: "d4",
      type: "dashboard" as const,
      title: "Base Network Analytics",
    },
    {
      id: "d5",
      type: "dashboard" as const,
      title: "Cross-chain Bridge Activity",
    },
  ],
  users: [
    {
      id: "u1",
      type: "user" as const,
      title: "@computer_nate",
    },
    {
      id: "u2",
      type: "user" as const,
      title: "@constillation",
    },
    {
      id: "u3",
      type: "user" as const,
      title: "@Ceryl",
    },
    {
      id: "u4",
      type: "user" as const,
      title: "@simon_cyril",
    },
    {
      id: "u5",
      type: "user" as const,
      title: "@alex_rivera",
    },
  ],
  networks: [
    {
      id: "n1",
      type: "network" as const,
      title: "Optimism",
    },
    {
      id: "n2",
      type: "network" as const,
      title: "CELO",
    },
    {
      id: "n3",
      type: "network" as const,
      title: "Base",
    },
    {
      id: "n4",
      type: "network" as const,
      title: "Arbitrum",
    },
    {
      id: "n5",
      type: "network" as const,
      title: "Polygon",
    },
  ],
};
