'use client';

import { useState, useEffect } from 'react';

export default function MonitoringStatus() {
  const [stats, setStats] = useState<{
    totalPasswords: number;
    breachedPasswords: number;
    safePasswords: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/monitor');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const runMonitoring = async () => {
    try {
      const response = await fetch('/api/monitor', { method: 'POST' });
      const data = await response.json();
      alert(data.message || 'Monitoring completed');
      fetchStats();
    } catch (error) {
      console.error('Error running monitoring:', error);
      alert('Failed to run monitoring');
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-600 dark:text-gray-400">Loading stats...</div>;
  }

  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monitoring Status</h3>
        <button
          onClick={runMonitoring}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          Run Check Now
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPasswords}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Passwords</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.safePasswords}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Safe</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.breachedPasswords}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Breached</div>
        </div>
      </div>
    </div>
  );
}

