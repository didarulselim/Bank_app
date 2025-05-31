import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Users, ArrowUpDown } from 'lucide-react';

const Members: React.FC = () => {
  const { getUsersWithBalance } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'balance'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const usersWithBalance = getUsersWithBalance();
  
  // Filter users based on search term
  const filteredUsers = usersWithBalance.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  );
  
  // Sort users based on sort field and direction
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === 'asc'
        ? a.balance - b.balance
        : b.balance - a.balance;
    }
  });

  const toggleSort = (field: 'name' | 'balance') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Users className="mr-2" /> Group Members
        </h2>
        <div className="text-gray-600">
          Total Members: <span className="font-semibold">{usersWithBalance.length}</span>
        </div>
      </div>
      
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by name or mobile..."
        />
      </div>
      
      {sortedUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No members found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center">
                    <span>Name</span>
                    {sortField === 'name' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Deposits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Withdrawals
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('balance')}
                >
                  <div className="flex items-center">
                    <span>Balance</span>
                    {sortField === 'balance' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    ${user.totalDeposit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    ${user.totalWithdrawal.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    user.balance > 0 ? 'text-green-600' : user.balance < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    ${user.balance.toFixed(2)}
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

export default Members;