'use client';

import { useEffect, useState } from 'react';
import PasswordGenerator from './components/PasswordGenerator';
import PasswordList from './components/PasswordList';
import MonitoringStatus from './components/MonitoringStatus';
import AuthWrapper from './components/AuthWrapper';
import Navigation from './components/Navigation';
import SettingsPage from './components/SettingsPage';
import BreachDashboard from './components/BreachDashboard';
import DocumentationPage from './components/DocumentationPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'breaches' | 'settings' | 'documentation'>('dashboard');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation 
          onNavigate={setCurrentPage} 
          currentPage={currentPage}
          userEmail={user?.email}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {currentPage === 'dashboard' && (
            <>
              <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  🔐 Secure Password Manager
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Generate, store, and monitor your passwords with intelligent breach detection
                </p>
              </header>

        <div className="mb-8">
          <MonitoringStatus />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <PasswordGenerator />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Security Features
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Automatic breach detection using Have I Been Pwned API</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Email notifications when breaches are detected</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Proactive monitoring and alerts</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure password generation with customizable options</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track where passwords are used</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Mark breaches as resolved after password changes</span>
              </li>
            </ul>
          </div>
        </div>

              <PasswordList />
            </>
          )}

          {currentPage === 'breaches' && (
            <>
              <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  🔍 Breach Monitor
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Real-time monitoring of your passwords against known data breaches
                </p>
              </header>
              <BreachDashboard />
            </>
          )}

          {currentPage === 'settings' && user && (
            <SettingsPage user={user} />
          )}

          {currentPage === 'documentation' && (
            <DocumentationPage />
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
