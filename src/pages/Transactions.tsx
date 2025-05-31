import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';

const Transactions: React.FC = () => {
  const { transactions, users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter transactions based on search term and filter type
  const filteredTransactions = sortedTransactions.filter(transaction => {
    const user = users.find(u => u.id === transaction.userId);
    const matchesSearch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          transaction.amount.toString().includes(searchTerm);
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getUserName = (userId: string) => {
    return users.find(user => user.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by name or amount..."
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('deposit')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-1 ${
              filterType === 'deposit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowUpCircle size={16} />
            <span>Deposits</span>
          </button>
          <button
            onClick={() => setFilterType('withdrawal')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-1 ${
              filterType === 'withdrawal'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowDownCircle size={16} />
            <span>Withdrawals</span>
          </button>
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getUserName(transaction.userId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type === 'deposit' ? (
                        <ArrowUpCircle size={12} className="mr-1" />
                      ) : (
                        <ArrowDownCircle size={12} className="mr-1" />
                      )}
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;