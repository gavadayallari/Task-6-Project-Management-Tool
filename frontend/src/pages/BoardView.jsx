import React from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  Settings,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { useProject } from '../context/ProjectContext';

const BoardView = () => {
  const {
    activeProject,
    projects,
    setActiveProject,
    openTaskModal,
    openProjectModal,
  } = useProject();

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in pb-4">
      {/* Board View Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Active Project Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: activeProject?.color || '#4F46E5' }}
          >
            <FolderKanban className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {activeProject ? activeProject.title : 'Project Kanban Board'}
              </h1>
              {activeProject?.key && (
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {activeProject.key}
                </span>
              )}
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {activeProject?.category || 'Workspace'}
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
              {activeProject?.description || 'Track deliverables, review code, and manage team sprint pipelines.'}
            </p>
          </div>
        </div>

        {/* Right: Quick project switcher & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Members Avatars */}
          {activeProject?.members && activeProject.members.length > 0 && (
            <div className="hidden lg:flex items-center -space-x-1.5 mr-2">
              {activeProject.members.slice(0, 4).map((m) => (
                <div
                  key={m._id}
                  title={m.name}
                  className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: m.color || '#4F46E5' }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {activeProject.members.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  +{activeProject.members.length - 4}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => openProjectModal(activeProject)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Edit Project Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => openTaskModal(null, 'todo')}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-brand-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Embedded Kanban Board */}
      <div className="flex-1">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default BoardView;
