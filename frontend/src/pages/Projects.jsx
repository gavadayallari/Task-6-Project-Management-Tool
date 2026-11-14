import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  Users,
  ArrowRight,
  Settings,
  Trash2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/common/ConfirmModal';
import api from '../api/axios';

const Projects = () => {
  const {
    projects,
    setActiveProject,
    openProjectModal,
    refreshProjects,
    refreshStats,
  } = useProject();
  const toast = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/projects/${projectToDelete._id}`);
      if (res.data.success) {
        toast.success(`Project "${projectToDelete.title}" deleted`);
        setProjectToDelete(null);
        refreshProjects();
        refreshStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Workspaces & Projects Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage engineering initiatives, team allocations, and milestone delivery dates
          </p>
        </div>

        <button
          onClick={() => openProjectModal()}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data & AI">Data & AI</option>
            <option value="General">General</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const totalTasks = project.stats?.totalTasks || 0;
          const doneTasks = project.stats?.doneTasks || 0;
          const pct = project.stats?.progressPercentage || 0;

          return (
            <div
              key={project._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-md"
                      style={{ backgroundColor: project.color || '#4F46E5' }}
                    />
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {project.key}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {project.status}
                    </span>
                    <button
                      onClick={() => openProjectModal(project)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
                  {project.title}
                </h3>
                <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md inline-block mb-2">
                  {project.category}
                </span>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>

                {/* Dates */}
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-4">
                  {project.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Target: {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    {doneTasks}/{totalTasks} tasks
                  </span>
                </div>
              </div>

              <div>
                {/* Sprint Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: project.color || '#4F46E5',
                      }}
                    />
                  </div>
                </div>

                {/* Footer: Members & Open Board Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center -space-x-1.5">
                    {project.members?.slice(0, 3).map((m) => (
                      <div
                        key={m._id}
                        title={m.name}
                        className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                        style={{ backgroundColor: m.color || '#4F46E5' }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {project.members?.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveProject(project);
                      navigate('/board');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    <span>Open Board</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No projects found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new project workspace.
          </p>
        </div>
      )}

      {/* Delete Project Confirmation */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project Workspace"
        message={`Are you sure you want to delete project "${projectToDelete?.title}"? This will permanently delete all associated tasks, checklist items, and audit activities.`}
        confirmText="Delete Workspace"
        loading={isDeleting}
      />
    </div>
  );
};

export default Projects;
