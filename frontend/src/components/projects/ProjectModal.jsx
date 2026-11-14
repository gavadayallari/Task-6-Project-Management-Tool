import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const ProjectModal = () => {
  const {
    isProjectModalOpen,
    projectModalData,
    closeProjectModal,
    teamMembers,
    refreshProjects,
    refreshStats,
    refreshActivities,
    setActiveProject,
  } = useProject();

  const toast = useToast();
  const isEditing = !!projectModalData;

  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [status, setStatus] = useState('active');
  const [priority, setPriority] = useState('medium');
  const [color, setColor] = useState('#4F46E5');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  const colors = [
    '#4F46E5', // Indigo
    '#2563EB', // Blue
    '#059669', // Emerald
    '#D97706', // Amber
    '#DC2626', // Red
    '#DB2777', // Pink
    '#7C3AED', // Violet
    '#0891B2', // Cyan
  ];

  useEffect(() => {
    if (isProjectModalOpen) {
      if (projectModalData) {
        setTitle(projectModalData.title || '');
        setKey(projectModalData.key || '');
        setDescription(projectModalData.description || '');
        setCategory(projectModalData.category || 'Web Development');
        setStatus(projectModalData.status || 'active');
        setPriority(projectModalData.priority || 'medium');
        setColor(projectModalData.color || '#4F46E5');
        setStartDate(
          projectModalData.startDate
            ? new Date(projectModalData.startDate).toISOString().split('T')[0]
            : ''
        );
        setDueDate(
          projectModalData.dueDate
            ? new Date(projectModalData.dueDate).toISOString().split('T')[0]
            : ''
        );
        setMembers(
          projectModalData.members
            ? projectModalData.members.map((m) => (typeof m === 'object' ? m._id : m))
            : []
        );
      } else {
        setTitle('');
        setKey('');
        setDescription('');
        setCategory('Web Development');
        setStatus('active');
        setPriority('medium');
        setColor('#4F46E5');
        setStartDate(new Date().toISOString().split('T')[0]);
        setDueDate('');
        setMembers([]);
      }
    }
  }, [isProjectModalOpen, projectModalData]);

  const toggleMember = (id) => {
    if (members.includes(id)) {
      setMembers(members.filter((m) => m !== id));
    } else {
      setMembers([...members, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !key.trim()) {
      toast.error('Title and Project Key are required');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      category,
      status,
      priority,
      color,
      startDate: startDate || null,
      dueDate: dueDate || null,
      members,
    };

    try {
      if (isEditing) {
        const res = await api.put(`/projects/${projectModalData._id}`, payload);
        if (res.data.success) {
          toast.success('Project updated successfully');
          setActiveProject(res.data.project);
        }
      } else {
        const res = await api.post('/projects', payload);
        if (res.data.success) {
          toast.success('Project created successfully');
          setActiveProject(res.data.project);
        }
      }

      closeProjectModal();
      refreshProjects();
      refreshStats();
      refreshActivities();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error saving project';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isProjectModalOpen}
      onClose={closeProjectModal}
      title={isEditing ? 'Edit Project Workspace' : 'Create New Project'}
      subtitle="Organize team tasks, deliverables, and Kanban workflow"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title and Key */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud Portal Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Key / Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isEditing}
              maxLength="5"
              placeholder="e.g. CPR"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono font-bold uppercase disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows="2"
            placeholder="High-level project goals and scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Category, Status, Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Data & AI">Data & AI</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800"
            >
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Color swatch picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Accent Brand Color
          </label>
          <div className="flex items-center gap-3">
            {colors.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-xl transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Start Date & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Team Members Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Project Members ({members.length})
          </label>
          <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
            {teamMembers.map((member) => {
              const isSelected = members.includes(member._id);
              return (
                <button
                  type="button"
                  key={member._id}
                  onClick={() => toggleMember(member._id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{member.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={closeProjectModal}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
