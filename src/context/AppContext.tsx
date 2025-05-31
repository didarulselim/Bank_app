import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Transaction, UserWithBalance } from '../types';

interface AppContextType {
  users: User[];
  transactions: Transaction[];
  currentUser: User | null;
  addUser: (name: string, mobile: string) => void;
  loginUser: (mobile: string) => boolean;
  logoutUser: () => void;
  addTransaction: (userId: string, type: 'deposit' | 'withdrawal', amount: number) => void;
  getUsersWithBalance: () => UserWithBalance[];
  getTotalBalance: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  USERS: 'covid19bank_users',
  TRANSACTIONS: 'covid19bank_transactions',
  CURRENT_USER: 'covid19bank_currentUser'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const addUser = (name: string, mobile: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      mobile,
      joinedAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const loginUser = (mobile: string) => {
    const user = users.find(u => u.mobile === mobile);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const addTransaction = (userId: string, type: 'deposit' | 'withdrawal', amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId,
      type,
      amount,
      date: new Date().toISOString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  const getUsersWithBalance = (): UserWithBalance[] => {
    return users.map(user => {
      const userTransactions = transactions.filter(t => t.userId === user.id);
      const totalDeposit = userTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWithdrawal = userTransactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...user,
        totalDeposit,
        totalWithdrawal,
        balance: totalDeposit - totalWithdrawal
      };
    });
  };

  const getTotalBalance = (): number => {
    const totalDeposit = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawal = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return totalDeposit - totalWithdrawal;
  };

  return (
    <AppContext.Provider
      value={{
        users,
        transactions,
        currentUser,
        addUser,
        loginUser,
        logoutUser,
        addTransaction,
        getUsersWithBalance,
        getTotalBalance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};