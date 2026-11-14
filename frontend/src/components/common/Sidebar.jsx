import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  FolderKanban,
  Users,
  FileCode2,
  Plus,
  X,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { projects, activeProject, setActiveProject, openProjectModal, openAboutModal } = useProject();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Kanban Board', path: '/board', icon: KanbanSquare },
    { name: 'Task Directory', path: '/tasks', icon: ListTodo },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Team Members', path: '/team', icon: Users },
    { name: 'API Docs & Postman', path: '/docs', icon: FileCode2 },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Sync<span className="text-brand-600">Flow</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                  Kanban Platform
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Nav Links */}
          <div className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Projects Quick List */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Workspaces ({projects.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  openProjectModal();
                }}
                className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title="Create Project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 max-h-44 overflow-y-auto">
              {projects.map((proj) => {
                const isSelected = activeProject?._id === proj._id;
                return (
                  <button
                    key={proj._id}
                    onClick={() => {
                      setActiveProject(proj);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color || '#4F46E5' }}
                      />
                      <span className="truncate">{proj.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {proj.key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info: Auspify Internship badge */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="rounded-xl p-3 bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-sm shadow-brand-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1 text-white">
              <Sparkles className="w-3.5 h-3.5 text-brand-200" />
              <span>Auspify Task 5</span>
            </div>
            <p className="text-[11px] text-indigo-100 leading-relaxed">
              Full Stack Internship Project by <strong className="text-white">Yallari Gavada</strong>
            </p>
            <button
              onClick={() => {
                onClose();
                openAboutModal();
              }}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              <span>View Specs & APIs</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
