import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/stats/overview`);
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const SEVERITY_COLORS = {
    low: '#3B82F6',
    medium: '#FBBF24',
    high: '#F97316',
    critical: '#EF4444'
  };

  const STATUS_COLORS = {
    open: '#A855F7',
    acknowledged: '#06B6D4',
    'in-progress': '#3B82F6',
    resolved: '#10B981',
    closed: '#6B7280'
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <div className="skeleton h-10 w-64 mb-2" />
          <div className="skeleton h-5 w-96" />
        </div>
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-20" />
            </div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={fetchStats}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const openVsClosedData = [
    { name: 'Open/Active', value: stats.openIncidents, color: '#F97316' },
    { name: 'Resolved/Closed', value: stats.closedIncidents, color: '#10B981' }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Dashboard
          </h1>
          <p className="text-gray-600">Real-time incident monitoring and insights</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Incidents', 
            value: stats.totalIncidents, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100'
          },
          { 
            label: 'Open/Active', 
            value: stats.openIncidents, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-100'
          },
          { 
            label: 'Resolved/Closed', 
            value: stats.closedIncidents, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-100'
          },
          { 
            label: 'Unassigned', 
            value: stats.unassignedCount, 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
            bgColor: 'bg-gray-50',
            iconColor: 'text-gray-600',
            borderColor: 'border-gray-200'
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className={`card hover:shadow-md transition-shadow ${stat.bgColor} ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open vs Closed Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Open vs Closed</span>
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={openVsClosedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {openVsClosedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Severity Distribution</span>
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.severityStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
              >
                {stats.severityStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Status Breakdown</span>
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.statusStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents per Operator */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Incidents per Operator</span>
          </h2>
          {stats.operatorStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="font-medium text-gray-600 mb-1">No Assignments</p>
              <p className="text-sm text-gray-500">No incidents assigned yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.operatorStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  interval={0}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis 
                  label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6"
                  radius={[8, 8, 0, 0]}
                >
                  {stats.operatorStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span>Incident Trend (Last 7 Days)</span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.recentTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis 
              label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
              allowDecimals={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
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
              height={36}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              name="Incidents"
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
