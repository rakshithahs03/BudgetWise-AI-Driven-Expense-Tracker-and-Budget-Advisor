export interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  startDate: Date;
  endDate: Date;
  spentAmount: number;
}
