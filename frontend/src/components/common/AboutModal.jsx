import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Send,
  Database,
  Code2,
  CheckCircle,
  Copy,
  ExternalLink,
  Layers,
} from 'lucide-react';
import Modal from './Modal';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';

const AboutModal = () => {
  const { isAboutModalOpen, closeAboutModal } = useProject();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = (text, msg = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  const endpoints = [
    { method: 'POST', path: '/api/auth/register', desc: 'Register a new user account with role' },
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user & receive JWT Bearer token' },
    { method: 'GET', path: '/api/auth/me', desc: 'Get current user profile (requires JWT)' },
    { method: 'GET', path: '/api/auth/users', desc: 'List team members for task assignment' },
    { method: 'GET', path: '/api/projects', desc: 'List all projects with task counts and completion %' },
    { method: 'GET', path: '/api/projects/stats', desc: 'Get workspace metrics (total tasks, overdue, rate)' },
    { method: 'POST', path: '/api/projects', desc: 'Create a new project workspace' },
    { method: 'PUT', path: '/api/projects/:id', desc: 'Update project settings and members' },
    { method: 'DELETE', path: '/api/projects/:id', desc: 'Delete project and cascade delete tasks' },
    { method: 'GET', path: '/api/tasks', desc: 'List tasks (filter by project, status, priority, assignee)' },
    { method: 'POST', path: '/api/tasks', desc: 'Create task with auto-generated key (e.g. SYNC-101)' },
    { method: 'PUT', path: '/api/tasks/:id', desc: 'Update full task details, dates, checklist' },
    { method: 'PATCH', path: '/api/tasks/:id/status', desc: 'Fast Kanban column status movement' },
    { method: 'DELETE', path: '/api/tasks/:id', desc: 'Delete task permanently' },
    { method: 'POST', path: '/api/tasks/:id/checklist', desc: 'Add subtask to task checklist' },
    { method: 'PATCH', path: '/api/tasks/:id/checklist/:itemId', desc: 'Toggle checklist item completion' },
    { method: 'POST', path: '/api/tasks/:id/comments', desc: 'Post comment on task discussion thread' },
    { method: 'GET', path: '/api/activities', desc: 'Workspace audit log and recent activity feed' },
  ];

  return (
    <Modal
      isOpen={isAboutModalOpen}
      onClose={closeAboutModal}
      title="Auspify Task 5 — Project Specifications & API Guide"
      subtitle="Full Stack Internship Submission • SyncFlow Project Management & Kanban Platform"
      maxWidth="max-w-4xl"
    >
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === 'overview'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Project Overview
        </button>
        <button
          onClick={() => setActiveTab('apis')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === 'apis'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          REST API Catalog
        </button>
        <button
          onClick={() => setActiveTab('postman')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === 'postman'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Postman Testing Guide
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-brand-50/80 border border-brand-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h4 className="text-sm font-bold text-brand-900">
                Auspify Technologies Full Stack Internship — Task 5
              </h4>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>SyncFlow</strong> is an enterprise-grade Project Management and Kanban Collaboration web platform built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It empowers software teams to plan projects, orchestrate multi-column workflows, monitor deadlines, and maintain full audit accountability.
            </p>
            <div className="mt-3 flex items-center gap-3 text-slate-600">
              <span>Developer: <strong>Yallari Gavada</strong></span>
              <span>•</span>
              <span>Batch: Full Stack Development Internship</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                <span>Frontend Architecture</span>
              </h5>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>React 18 + Vite</li>
                <li>Tailwind CSS design system</li>
                <li>HTML5 Drag & Drop Kanban</li>
                <li>Context API (Auth, Project, Toast)</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Backend REST API</span>
              </h5>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>Node.js & Express.js</li>
                <li>JWT Authentication</li>
                <li>Role-Based Access (Admin/PM/Dev)</li>
                <li>Centralized Error Handling</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Database & ODM</span>
              </h5>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>MongoDB Compass / Server</li>
                <li>Mongoose Schemas & Hooks</li>
                <li>Cascade Task/Activity Deletion</li>
                <li>Pre-seeded Demo Dataset</li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <h5 className="font-bold text-slate-900 mb-2">Pre-Seeded Demo Test Credentials</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block">👑 Administrator</span>
                <code className="text-[11px] text-brand-600">admin@auspify.com</code>
                <span className="block text-slate-500 text-[10px]">pass: password123</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block">🚀 Project Manager</span>
                <code className="text-[11px] text-brand-600">pm@auspify.com</code>
                <span className="block text-slate-500 text-[10px]">pass: password123</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block">💻 Lead Developer</span>
                <code className="text-[11px] text-brand-600">dev@auspify.com</code>
                <span className="block text-slate-500 text-[10px]">pass: password123</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: APIs */}
      {activeTab === 'apis' && (
        <div className="space-y-2 text-xs max-h-96 overflow-y-auto pr-1">
          {endpoints.map((ep, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                    ep.method === 'GET'
                      ? 'bg-blue-100 text-blue-700'
                      : ep.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-700'
                      : ep.method === 'PUT'
                      ? 'bg-amber-100 text-amber-700'
                      : ep.method === 'PATCH'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {ep.method}
                </span>
                <code className="font-mono text-slate-900 font-semibold">{ep.path}</code>
              </div>
              <span className="text-slate-500 text-[11px]">{ep.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Postman Guide */}
      {activeTab === 'postman' && (
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 leading-relaxed">
            <h5 className="font-bold mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>How to verify SyncFlow APIs in Postman</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 mt-2 text-indigo-800">
              <li>
                Launch <strong>Postman</strong> and click <strong>Import</strong>.
              </li>
              <li>
                Select the pre-generated collection file at:{' '}
                <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">
                  project-management-tool/postman/SyncFlow_API.postman_collection.json
                </code>
              </li>
              <li>
                Execute request <code>1. Login (Admin)</code> to receive a JWT token.
              </li>
              <li>
                The collection automatically sets the Bearer Token in your environment for all subsequent requests!
              </li>
              <li>
                Test creating tasks, changing Kanban status, adding comments, and creating projects.
              </li>
            </ol>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
            <span className="font-mono text-slate-700">Base URL: http://localhost:5002/api</span>
            <button
              onClick={() => copyToClipboard('http://localhost:5002/api', 'Base URL copied')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AboutModal;
