import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  CheckCircle2,
  Copy,
  Terminal,
  Database,
  ShieldCheck,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ApiDocs = () => {
  const toast = useToast();
  const [healthStatus, setHealthStatus] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        setHealthStatus(res.data);
      } catch (error) {
        setHealthStatus({ success: false, message: 'Server unreachable' });
      } finally {
        setLoadingHealth(false);
      }
    };
    checkHealth();
  }, []);

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const endpointGroups = [
    {
      category: 'Authentication & Profile',
      endpoints: [
        { method: 'POST', path: '/api/auth/register', desc: 'Create a new user account with role' },
        { method: 'POST', path: '/api/auth/login', desc: 'Authenticate with email/password and receive JWT' },
        { method: 'GET', path: '/api/auth/me', desc: 'Fetch currently authenticated user profile' },
        { method: 'PUT', path: '/api/auth/profile', desc: 'Update name, job title, and department' },
        { method: 'GET', path: '/api/auth/users', desc: 'Get team directory for task assignments' },
      ],
    },
    {
      category: 'Workspaces & Projects',
      endpoints: [
        { method: 'GET', path: '/api/projects', desc: 'Fetch all projects with dynamic task completion metrics' },
        { method: 'GET', path: '/api/projects/stats', desc: 'Dashboard analytics: active, overdue, completion %' },
        { method: 'GET', path: '/api/projects/:id', desc: 'Get single project details and task roster' },
        { method: 'POST', path: '/api/projects', desc: 'Create new project workspace (Admin / PM)' },
        { method: 'PUT', path: '/api/projects/:id', desc: 'Update project settings, deadline, or members' },
        { method: 'DELETE', path: '/api/projects/:id', desc: 'Cascade delete project and all linked tasks' },
      ],
    },
    {
      category: 'Tasks & Kanban Workflow',
      endpoints: [
        { method: 'GET', path: '/api/tasks', desc: 'List tasks with filtering by project, status, priority, assignee' },
        { method: 'GET', path: '/api/tasks/:id', desc: 'Get single task with full checklist and comments' },
        { method: 'POST', path: '/api/tasks', desc: 'Create new task with auto-generated key (e.g. SYNC-101)' },
        { method: 'PUT', path: '/api/tasks/:id', desc: 'Update task details, hours estimate, assignees' },
        { method: 'PATCH', path: '/api/tasks/:id/status', desc: 'Kanban column drag/drop fast status transition' },
        { method: 'DELETE', path: '/api/tasks/:id', desc: 'Delete task permanently' },
        { method: 'POST', path: '/api/tasks/:id/checklist', desc: 'Add subtask to task checklist' },
        { method: 'PATCH', path: '/api/tasks/:id/checklist/:itemId', desc: 'Toggle checklist item completion' },
        { method: 'DELETE', path: '/api/tasks/:id/checklist/:itemId', desc: 'Delete checklist item' },
        { method: 'POST', path: '/api/tasks/:id/comments', desc: 'Post new discussion comment on task' },
        { method: 'DELETE', path: '/api/tasks/:id/comments/:commentId', desc: 'Delete comment' },
      ],
    },
    {
      category: 'Audit Log & Activities',
      endpoints: [
        { method: 'GET', path: '/api/activities', desc: 'List recent workspace audit events' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              API Documentation & Postman Guide
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Auspify Task 5
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Complete REST API specifications and Postman collection testing instructions
          </p>
        </div>

        {/* Live Server Health Indicator */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              healthStatus?.success ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="font-semibold text-slate-700">
            Backend API: {healthStatus?.success ? 'Online (Port 5002)' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Postman Testing Steps Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-bold">How to verify SyncFlow in Postman</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-brand-300 font-extrabold text-xs block mb-1">STEP 1</span>
            <h3 className="font-bold text-sm mb-1">Import Collection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open Postman and import <code>postman/SyncFlow_API.postman_collection.json</code> located in your project directory.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-brand-300 font-extrabold text-xs block mb-1">STEP 2</span>
            <h3 className="font-bold text-sm mb-1">Authenticate (JWT)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Run <strong>POST /api/auth/login</strong> with <code>admin@auspify.com</code> / <code>password123</code>. The test script saves the token as an environment variable automatically!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <span className="text-brand-300 font-extrabold text-xs block mb-1">STEP 3</span>
            <h3 className="font-bold text-sm mb-1">Test Endpoints</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test creating projects, adding tasks with checklists, dragging cards (PATCH status), and viewing live audit activities.
            </p>
          </div>
        </div>

        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={() => copyText('http://localhost:5002/api', 'Base API URL')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Base URL: http://localhost:5002/api</span>
          </button>
        </div>
      </div>

      {/* Catalog of Endpoints */}
      <div className="space-y-6">
        {endpointGroups.map((group, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3"
          >
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span>{group.category}</span>
            </h2>

            <div className="divide-y divide-slate-100">
              {group.endpoints.map((ep, i) => (
                <div
                  key={i}
                  className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
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
                    <code className="font-mono text-slate-900 font-bold">{ep.path}</code>
                  </div>
                  <span className="text-slate-500 font-medium">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDocs;
