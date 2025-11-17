'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface PasswordEntry {
  id: string;
  serviceName: string;
  username: string | null;
  url: string | null;
  isBreached: boolean;
  breachDetails: string | null;
  lastChecked: string;
  lastPasswordChange: string;
  passwordAge: number;
  passwordExpiresAt: string | null;
  isResolved: boolean;
}

export default function BreachDashboard() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    breached: 0,
    expired: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const response = await fetch('/api/passwords');
      if (response.ok) {
        const data = await response.json();
        setPasswords(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching passwords:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: PasswordEntry[]) => {
    const now = new Date();
    const stats = {
      total: data.length,
      breached: data.filter(p => p.isBreached && !p.isResolved).length,
      expired: 0,
      expiringSoon: 0,
    };

    data.forEach(p => {
      if (p.passwordExpiresAt) {
        const expiryDate = new Date(p.passwordExpiresAt);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
          stats.expired++;
        } else if (daysUntilExpiry <= 7) {
          stats.expiringSoon++;
        }
      }
    });

    setStats(stats);
  };

  const getPasswordStatus = (entry: PasswordEntry) => {
    if (entry.isBreached && !entry.isResolved) {
      return { status: 'Breached', color: 'red', priority: 1 };
    }

    if (entry.passwordExpiresAt) {
      const expiryDate = new Date(entry.passwordExpiresAt);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        return { status: 'Expired', color: 'red', priority: 2 };
      } else if (daysUntilExpiry <= 7) {
        return { status: 'Expires Soon', color: 'yellow', priority: 3 };
      } else if (daysUntilExpiry <= 30) {
        return { status: 'Expiring', color: 'orange', priority: 4 };
      }
    }

    return { status: 'Safe', color: 'green', priority: 5 };
  };

  const sortedPasswords = [...passwords].sort((a, b) => {
    const statusA = getPasswordStatus(a);
    const statusB = getPasswordStatus(b);
    return statusA.priority - statusB.priority;
  });

  const breachedPasswords = sortedPasswords.filter(p => p.isBreached && !p.isResolved);
  const expiredPasswords = sortedPasswords.filter(p => {
    if (!p.passwordExpiresAt) return false;
    const expiryDate = new Date(p.passwordExpiresAt);
    return expiryDate.getTime() < Date.now();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Passwords
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.total}
              </p>
            </div>
            <div className="text-4xl">🔒</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Breached
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {stats.breached}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expired
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {stats.expired}
              </p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expiring Soon
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                {stats.expiringSoon}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Call to Action for Breached Passwords */}
      {breachedPasswords.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
                🚨 Urgent Action Required
              </h3>
              <p className="text-red-800 dark:text-red-400 mb-4">
                You have {breachedPasswords.length} password(s) that have been found in data breaches.
                Change these passwords immediately to protect your accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action for Expired Passwords */}
      {expiredPasswords.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">
                ⏰ Passwords Need Updating
              </h3>
              <p className="text-orange-800 dark:text-orange-400 mb-4">
                You have {expiredPasswords.length} password(s) that have expired (over 90 days old).
                Update these passwords to maintain security.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password Status Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Password Status Monitor
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Checked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedPasswords.map((entry) => {
                const status = getPasswordStatus(entry);
                const daysUntilExpiry = entry.passwordExpiresAt
                  ? Math.ceil((new Date(entry.passwordExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.serviceName}
                          </div>
                          {entry.url && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {entry.url}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.username || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status.color === 'red'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : status.color === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : status.color === 'orange'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {status.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {entry.passwordAge} days
                      {daysUntilExpiry !== null && (
                        <div className={`text-xs ${
                          daysUntilExpiry < 0
                            ? 'text-red-600 dark:text-red-400'
                            : daysUntilExpiry <= 7
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {daysUntilExpiry < 0 ? 'Expired' : `Expires in ${daysUntilExpiry}d`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(entry.lastChecked), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(entry.isBreached || daysUntilExpiry !== null && daysUntilExpiry < 30) && (
                        <button
                          onClick={() => window.location.href = `/#password-${entry.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Update Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {sortedPasswords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No passwords stored yet. Add your first password to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

