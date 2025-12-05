export interface Transaction {
  id: number
  type: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}
