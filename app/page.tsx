import PasswordGenerator from './components/PasswordGenerator';
import PasswordList from './components/PasswordList';
import MonitoringStatus from './components/MonitoringStatus';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
      </div>
    </div>
  );
}
