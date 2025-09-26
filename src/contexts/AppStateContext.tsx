import React, { createContext, useContext, useState } from 'react';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'insufficient' | 'not_received';
  category: string;
  provider: string;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  amount?: number;
}

interface AppStateContextType {
  walletBalance: number;
  bills: Bill[];
  activities: Activity[];
  subscription: 'free' | 'basic' | 'premium';
  addActivity: (action: string, description: string, amount?: number) => void;
  updateBillStatus: (billId: string, status: Bill['status']) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  removeBill: (billId: string) => void;
  setSubscription: (sub: 'free' | 'basic' | 'premium') => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Demo data
const initialBills: Bill[] = [
  {
    id: '1',
    name: 'Electricity Bill',
    amount: 89.50,
    dueDate: '2024-10-01',
    status: 'paid',
    category: 'Utilities',
    provider: 'Latvenergo'
  },
  {
    id: '2',
    name: 'Internet Bill',
    amount: 24.99,
    dueDate: '2024-10-05',
    status: 'pending',
    category: 'Telecommunications',
    provider: 'Bite'
  },
  {
    id: '3',
    name: 'Water Bill',
    amount: 156.30,
    dueDate: '2024-10-08',
    status: 'insufficient',
    category: 'Utilities',
    provider: 'Rigas Udens'
  },
  {
    id: '4',
    name: 'Mobile Bill',
    amount: 15.90,
    dueDate: '2024-10-15',
    status: 'not_received',
    category: 'Telecommunications',
    provider: 'Tele2'
  }
];

const initialActivities: Activity[] = [
  {
    id: '1',
    action: 'Bill Payment',
    description: 'Electricity bill paid successfully',
    timestamp: new Date().toISOString(),
    amount: -89.50
  },
  {
    id: '2',
    action: 'Wallet Top-up',
    description: 'Added funds via Swedbank',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    amount: 500.00
  }
];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletBalance] = useState(287.64);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [subscription, setSubscription] = useState<'free' | 'basic' | 'premium'>('free');

  const addActivity = (action: string, description: string, amount?: number) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      description,
      timestamp: new Date().toISOString(),
      amount
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const updateBillStatus = (billId: string, status: Bill['status']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, status } : bill
    ));
  };

  const addBill = (billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...billData,
      id: Date.now().toString()
    };
    setBills(prev => [...prev, newBill]);
  };

  const removeBill = (billId: string) => {
    setBills(prev => prev.filter(bill => bill.id !== billId));
  };

  const value = {
    walletBalance,
    bills,
    activities,
    subscription,
    addActivity,
    updateBillStatus,
    addBill,
    removeBill,
    setSubscription
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};