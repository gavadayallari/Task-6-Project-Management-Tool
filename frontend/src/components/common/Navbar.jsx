import React, { useState } from 'react';
import {
  Menu,
  Plus,
  FolderKanban,
  HelpCircle,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';

const Navbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const {
    projects,
    activeProject,
    setActiveProject,
    openTaskModal,
    openProjectModal,
    openAboutModal,
  } = useProject();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger & Project Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Project Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200/60 text-left"
            >
              <div
                className="w-3.5 h-3.5 rounded-md shrink-0 shadow-sm"
                style={{ backgroundColor: activeProject?.color || '#4F46E5' }}
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[150px] sm:max-w-[220px]">
                  {activeProject ? activeProject.title : 'All Projects'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {activeProject ? `${activeProject.key} • ${activeProject.category}` : 'Select workspace'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {isProjectDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProjectDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Workspaces & Projects
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {projects.map((proj) => (
                      <button
                        key={proj._id}
                        onClick={() => {
                          setActiveProject(proj);
                          setIsProjectDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${
                          activeProject?._id === proj._id
                            ? 'bg-brand-50 text-brand-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-3 h-3 rounded-md shrink-0"
                            style={{ backgroundColor: proj.color || '#4F46E5' }}
                          />
                          <div className="truncate">
                            <p className="truncate font-medium">{proj.title}</p>
                            <span className="text-[10px] text-slate-400">{proj.key}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                          {proj.status}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        openProjectModal();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Project</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auspify Task 5 Spec Badge */}
          <button
            onClick={openAboutModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
            title="Auspify Internship Task 5 Specs & Postman Testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Task 5 Specs</span>
          </button>

          {/* New Task Button */}
          <button
            onClick={() => openTaskModal(null, 'todo')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-brand-600/30 transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div
                className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                style={{ backgroundColor: user?.color || '#4F46E5' }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                  {user?.name || 'Auspify User'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium capitalize">
                  {user?.role?.replace('_', ' ') || 'Member'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                        <ShieldCheck className="w-3 h-3 text-brand-600" />
                        {user?.role?.toUpperCase().replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">• {user?.jobTitle}</span>
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAboutModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>API Docs & Postman Guide</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
