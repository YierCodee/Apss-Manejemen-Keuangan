export interface RabItem {
  id: string;
  name: string;
  budget: number;
  realization: number;
  status: "on-track" | "warning" | "over-budget";
}

export interface Rab {
  id: string;
  projectName: string;
  items: RabItem[];
  totalBudget: number;
  totalRealization: number;
}
