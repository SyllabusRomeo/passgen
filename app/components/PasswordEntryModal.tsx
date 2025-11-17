'use client';

import { useState, useEffect } from 'react';
import PasswordGenerator from './PasswordGenerator';

interface PasswordEntry {
  id?: string;
  serviceName: string;
  username?: string;
  password: string;
  url?: string;
  notes?: string;
}

interface PasswordEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  entry?: PasswordEntry | null;
}

export default function PasswordEntryModal({ isOpen, onClose, onSave, entry }: PasswordEntryModalProps) {
  const [formData, setFormData] = useState<PasswordEntry>({
    serviceName: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });

  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        serviceName: entry.serviceName || '',
        username: entry.username || '',
        password: entry.password || '',
        url: entry.url || '',
        notes: entry.notes || '',
      });
    } else {
      setFormData({
        serviceName: '',
        username: '',
        password: generatedPassword || '',
        url: '',
        notes: '',
      });
    }
  }, [entry, generatedPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceName || !formData.password) {
      alert('Service name and password are required');
      return;
    }

    try {
      const url = entry ? `/api/passwords/${entry.id}` : '/api/passwords';
      const method = entry ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      onSave();
      onClose();
      setFormData({
        serviceName: '',
        username: '',
        password: '',
        url: '',
        notes: '',
      });
      setGeneratedPassword('');
    } catch (error) {
      console.error('Error saving password:', error);
      alert('Failed to save password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {entry ? 'Edit Password' : 'Add New Password'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service/Website Name *
              </label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username/Email
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(formData.password)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            {!entry && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <PasswordGenerator
                  onPasswordGenerated={(password) => {
                    setGeneratedPassword(password);
                    setFormData({ ...formData, password });
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {entry ? 'Update' : 'Save'} Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

