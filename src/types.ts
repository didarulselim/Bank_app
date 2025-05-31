export interface User {
  id: string;
  name: string;
  mobile: string;
  joinedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
}

export interface UserWithBalance extends User {
  totalDeposit: number;
  totalWithdrawal: number;
  balance: number;
}