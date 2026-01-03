import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, Area, AreaChart } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    // Auto-refresh disabled - use manual refresh button instead
    // This prevents charts from constantly changing and confusing users
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/stats/overview`);
      console.log('Dashboard stats received:', response.data);
      console.log('Severity stats:', response.data.severityStats);
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const SEVERITY_COLORS = {
    Low: '#60A5FA',
    Medium: '#FBBF24',
    High: '#FB923C',
    Critical: '#EF4444'
  };

  const STATUS_COLORS = {
    open: '#C084FC',
    acknowledged: '#22D3EE',
    'in-progress': '#60A5FA',
    resolved: '#34D399',
    closed: '#94A3B8'
  };

  if (loading && !stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="skeleton h-10 w-80 rounded-xl" />
          <div className="skeleton h-5 w-96 rounded-lg" />
        </div>
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="skeleton h-6 w-28 rounded-lg" />
                  <div className="skeleton h-12 w-12 rounded-xl" />
                </div>
                <div className="skeleton h-12 w-32 rounded-lg" />
              </div>
            </motion.div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="card"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-9 w-9 rounded-xl" />
                  <div className="skeleton h-7 w-48 rounded-lg" />
                </div>
                <div className="skeleton h-80 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="skeleton h-9 w-9 rounded-xl" />
              <div className="skeleton h-7 w-56 rounded-lg" />
            </div>
            <div className="skeleton h-96 rounded-2xl" />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (error && !stats) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card bg-red-50 border-red-200"
      >
        <div className="text-center py-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-red-900 mb-3">Error Loading Dashboard</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchStats}
            className="btn-primary"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const openVsClosedData = [
    { name: 'Open/Active', value: stats.openIncidents, color: '#F97316' },
    { name: 'Resolved/Closed', value: stats.closedIncidents, color: '#10B981' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 pb-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Real-time incident monitoring
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchStats}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <svg 
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { 
            label: 'Total Incidents', 
            value: stats.totalIncidents, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            gradient: 'from-blue-500 via-blue-600 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            delay: 0.1
          },
          { 
            label: 'Open/Active', 
            value: stats.openIncidents, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
            gradient: 'from-orange-500 via-red-500 to-pink-500',
            bgGradient: 'from-orange-50 to-red-50',
            delay: 0.2
          },
          { 
            label: 'Resolved/Closed', 
            value: stats.closedIncidents, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            gradient: 'from-green-500 via-emerald-500 to-teal-500',
            bgGradient: 'from-green-50 to-emerald-50',
            delay: 0.3
          },
          { 
            label: 'Unassigned', 
            value: stats.unassignedCount, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
            gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
            bgGradient: 'from-purple-50 to-fuchsia-50',
            delay: 0.4
          }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: stat.delay,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -2,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
            
            {/* Card */}
            <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-md group-hover:shadow-2xl group-hover:border-gray-300 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-lg transition-shadow duration-300`}>
                  {stat.icon}
                </div>
              </div>
              
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.2, type: "spring" }}
              >
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
              </motion.div>
              
              {/* Decorative gradient line */}
              <div className={`h-1 w-16 bg-gradient-to-r ${stat.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open vs Closed Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-md group-hover:shadow-2xl group-hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-white shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Open vs Closed</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <defs>
                  <filter id="shadow1">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <Pie
                  data={openVsClosedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split('/')[0]}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {openVsClosedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} filter="url(#shadow1)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}
                  labelStyle={{ color: '#374151', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-md group-hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Severity Distribution</h2>
            </div>
            {stats.severityStats && stats.severityStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.severityStats}>
                <defs>
                  <linearGradient id="gradient-Critical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="gradient-High" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB923C" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#FB923C" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="gradient-Medium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="gradient-Low" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 13, fontWeight: '600' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.03)', radius: 8 }}
                  itemStyle={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}
                  labelStyle={{ color: '#374151', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[16, 16, 0, 0]}
                  maxBarSize={80}
                >
                  {stats.severityStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${entry.name})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-3">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="font-bold text-gray-900 text-base mb-1">No Severity Data</p>
                <p className="text-xs text-gray-500">Create incidents to see severity breakdown</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-md group-hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 text-white shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Status Breakdown</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <defs>
                  <filter id="shadow2">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <Pie
                  data={stats.statusStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {stats.statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8884d8'} filter="url(#shadow2)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '16px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}
                  labelStyle={{ color: '#374151', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Incidents per Operator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-md group-hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900">Incidents per Operator</h2>
            </div>
            {stats.operatorStats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-3"
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.div>
                <p className="font-bold text-gray-900 text-base mb-1">No Assignments Yet</p>
                <p className="text-xs text-gray-500">Incidents will appear here once assigned</p>
              </motion.div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.operatorStats}>
                  <defs>
                    <linearGradient id="operatorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#34D399" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-35} 
                    textAnchor="end" 
                    height={100} 
                    interval={0}
                    tick={{ fill: '#6b7280', fontSize: 11, fontWeight: '600' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 13, fontWeight: '600' }}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '16px', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      padding: '16px',
                      backdropFilter: 'blur(10px)'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.03)', radius: 8 }}
                    itemStyle={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}
                    labelStyle={{ color: '#374151', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#operatorGradient)"
                    radius={[16, 16, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-md group-hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900">Incident Trend (Last 7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.recentTrend} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05}/>
                </linearGradient>
                <filter id="shadow3">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: '600' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis 
                label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 13, fontWeight: '600' }}
                allowDecimals={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '16px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  padding: '16px',
                  backdropFilter: 'blur(10px)'
                }}
                itemStyle={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}
                labelStyle={{ color: '#374151', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  });
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={40}
                iconType="circle"
                wrapperStyle={{ paddingTop: '0', fontSize: '13px', fontWeight: '600' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Incidents"
                stroke="#6366F1"
                strokeWidth={3}
                fill="url(#colorCount)"
                fillOpacity={1}
                filter="url(#shadow3)"
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#6366F1" 
                strokeWidth={3}
                dot={{ fill: '#6366F1', r: 6, strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#4F46E5', stroke: '#fff', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
