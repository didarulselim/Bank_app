import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, addTransaction, getTotalBalance, getUsersWithBalance } = useApp();
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalBalance = getTotalBalance();
  const usersWithBalance = getUsersWithBalance();
  const currentUserWithBalance = usersWithBalance.find(u => u.id === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amountValue = parseFloat(amount);
    
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transactionType === 'withdrawal' && amountValue > (currentUserWithBalance?.balance || 0)) {
      setError('Insufficient balance for withdrawal');
      return;
    }

    if (currentUser) {
      addTransaction(currentUser.id, transactionType, amountValue);
      setAmount('');
      setSuccess(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} of $${amountValue.toFixed(2)} was successful`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100">Total Deposits</p>
                <h3 className="text-2xl font-bold">${currentUserWithBalance?.totalDeposit.toFixed(2) || '0.00'}</h3>
              </div>
              <ArrowUpCircle size={40} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-red-100">Total Withdrawals</p>
                <h3 className="text-2xl font-bold">${currentUserWithBalance?.totalWithdrawal.toFixed(2) || '0.00'}</h3>
              </div>
              <ArrowDownCircle size={40} className="text-red-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-100">Your Balance</p>
                <h3 className="text-2xl font-bold">${currentUserWithBalance?.balance.toFixed(2) || '0.00'}</h3>
              </div>
              <DollarSign size={40} className="text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Group Balance</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-600 text-lg">Total Group Balance</p>
              <p className="text-3xl font-bold text-indigo-900">${totalBalance.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-full shadow-md">
              <DollarSign size={32} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">New Transaction</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Transaction Type</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setTransactionType('deposit')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                    transactionType === 'deposit'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowUpCircle size={20} />
                  <span>Deposit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('withdrawal')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                    transactionType === 'withdrawal'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowDownCircle size={20} />
                  <span>Withdrawal</span>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                transactionType === 'deposit'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {transactionType === 'deposit' ? 'Make Deposit' : 'Make Withdrawal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;