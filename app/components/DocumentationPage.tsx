'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocFile {
  name: string;
  title: string;
  description: string;
  path: string;
}

const documentationFiles: DocFile[] = [
  {
    name: 'QUICKSTART.md',
    title: 'Quick Start Guide',
    description: 'Get up and running with the Secure Password Manager in minutes!',
    path: '/docs/QUICKSTART.md',
  },
  {
    name: 'DOCKER.md',
    title: 'Docker Setup Guide',
    description: 'Complete guide for running the application with Docker, including troubleshooting and production deployment.',
    path: '/docs/DOCKER.md',
  },
  {
    name: 'LOGIN_INSTRUCTIONS.md',
    title: 'Login Instructions',
    description: 'Complete guide for accessing and using the Secure Password Manager, including troubleshooting.',
    path: '/docs/LOGIN_INSTRUCTIONS.md',
  },
  {
    name: 'DEFAULT_CREDENTIALS.md',
    title: 'Default Credentials & Features',
    description: 'Overview of features, API endpoints, and database configuration.',
    path: '/docs/DEFAULT_CREDENTIALS.md',
  },
  {
    name: 'FIX_PRISMA.md',
    title: 'Prisma Client Setup',
    description: 'Information about Prisma Client configuration and troubleshooting.',
    path: '/docs/FIX_PRISMA.md',
  },
];

export default function DocumentationPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadDocumentation = async (doc: DocFile) => {
    setLoading(true);
    setSelectedDoc(doc);
    try {
      const response = await fetch(doc.path);
      if (response.ok) {
        const content = await response.text();
        setDocContent(content);
      } else {
        setDocContent(`# ${doc.title}\n\nDocumentation file not found.`);
      }
    } catch (error) {
      setDocContent(`# ${doc.title}\n\nError loading documentation: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          📚 Documentation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Complete guides and instructions for the Secure Password Manager
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Documentation List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Available Guides
            </h2>
            <div className="space-y-2">
              {documentationFiles.map((doc) => (
                <button
                  key={doc.name}
                  onClick={() => loadDocumentation(doc)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedDoc?.name === doc.name
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="font-semibold">{doc.title}</div>
                  <div className="text-sm mt-1 opacity-75">{doc.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 min-h-[600px]">
            {!selectedDoc ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Select a Documentation Guide
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a guide from the list on the left to view detailed documentation.
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading documentation...</p>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-4 mt-8 first:mt-0" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold mb-3 mt-6" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl font-bold mb-2 mt-4" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-xl font-semibold mb-2 mt-3" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    code: ({node, inline, ...props}: any) => 
                      inline ? (
                        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      ) : (
                        <code className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4" {...props} />
                      ),
                    pre: ({node, ...props}) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
                    table: ({node, ...props}) => <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 my-4" {...props} />,
                    th: ({node, ...props}) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-left" {...props} />,
                    td: ({node, ...props}) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />,
                  }}
                >
                  {docContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

