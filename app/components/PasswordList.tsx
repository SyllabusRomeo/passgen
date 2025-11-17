'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PasswordEntryModal from './PasswordEntryModal';

interface PasswordEntry {
  id: string;
  serviceName: string;
  username?: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastChecked: string;
  isBreached: boolean;
  breachDetails?: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export default function PasswordList() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const response = await fetch('/api/passwords');
      const data = await response.json();
      setPasswords(data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this password entry?')) return;

    try {
      await fetch(`/api/passwords/${id}`, { method: 'DELETE' });
      fetchPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const handleCheckBreach = async (id: string) => {
    try {
      const response = await fetch(`/api/passwords/${id}/check`, { method: 'POST' });
      const data = await response.json();
      if (data.isBreached) {
        alert(`⚠️ Password breach detected! Check your email for details.`);
      } else {
        alert('✓ Password is safe (not found in known breaches)');
      }
      fetchPasswords();
    } catch (error) {
      console.error('Error checking breach:', error);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await fetch(`/api/passwords/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isResolved: true }),
      });
      fetchPasswords();
    } catch (error) {
      console.error('Error resolving breach:', error);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword({ ...showPassword, [id]: !showPassword[id] });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Passwords</h2>
        <button
          onClick={() => {
            setSelectedPassword(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + Add Password
        </button>
      </div>

      {passwords.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No passwords saved yet. Generate and save your first password!
        </div>
      ) : (
        <div className="grid gap-4">
          {passwords.map((entry) => {
            const breachDetails = entry.breachDetails ? JSON.parse(entry.breachDetails) : [];
            return (
              <div
                key={entry.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                  entry.isBreached && !entry.isResolved ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {entry.serviceName}
                    </h3>
                    {entry.username && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Username: {entry.username}
                      </p>
                    )}
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1 block"
                      >
                        {entry.url}
                      </a>
                    )}
                  </div>
                  {entry.isBreached && !entry.isResolved && (
                    <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-semibold">
                      🚨 Breached
                    </span>
                  )}
                  {entry.isResolved && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Resolved
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type={showPassword[entry.id] ? 'text' : 'password'}
                      value={entry.password}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => togglePasswordVisibility(entry.id)}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                    >
                      {showPassword[entry.id] ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(entry.password)}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {entry.isBreached && !entry.isResolved && breachDetails.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                      Breach Details:
                    </p>
                    <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                      {breachDetails.map((detail: string, idx: number) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{entry.notes}</p>
                )}

                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>Created: {format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span>Last checked: {format(new Date(entry.lastChecked), 'MMM d, yyyy')}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedPassword(entry);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCheckBreach(entry.id)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
                  >
                    Check Breach
                  </button>
                  {entry.isBreached && !entry.isResolved && (
                    <button
                      onClick={() => handleResolve(entry.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PasswordEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPassword(null);
        }}
        onSave={fetchPasswords}
        entry={selectedPassword}
      />
    </div>
  );
}

