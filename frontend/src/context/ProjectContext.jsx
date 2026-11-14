import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalData, setTaskModalData] = useState({ task: null, defaultStatus: 'todo' });

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalData, setProjectModalData] = useState(null);

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Fetch projects
  const refreshProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.projects);
        // Default active project to the first one if none selected
        setActiveProject((prev) => {
          if (!prev && res.data.projects.length > 0) {
            return res.data.projects[0];
          }
          if (prev) {
            const found = res.data.projects.find((p) => p._id === prev._id);
            return found || res.data.projects[0] || null;
          }
          return null;
        });
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  }, [isAuthenticated]);

  // Fetch team members
  const refreshTeam = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) {
        setTeamMembers(res.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  }, [isAuthenticated]);

  // Fetch stats
  const refreshStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/projects/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [isAuthenticated]);

  // Fetch activities
  const refreshActivities = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/activities?limit=15');
      if (res.data.success) {
        setActivities(res.data.activities);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  }, [isAuthenticated]);

  // Fetch tasks for active project or all tasks
  const refreshTasks = useCallback(async (projectId = null) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const targetProjectId = projectId || (activeProject ? activeProject._id : null);
      const url = targetProjectId ? `/tasks?project=${targetProjectId}` : '/tasks';
      const res = await api.get(url);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, activeProject]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      refreshProjects();
      refreshTeam();
      refreshStats();
      refreshActivities();
    } else {
      setProjects([]);
      setActiveProject(null);
      setTasks([]);
      setStats(null);
      setActivities([]);
      setTeamMembers([]);
    }
  }, [isAuthenticated, refreshProjects, refreshTeam, refreshStats, refreshActivities]);

  // Load tasks when active project changes
  useEffect(() => {
    if (activeProject && isAuthenticated) {
      refreshTasks(activeProject._id);
    }
  }, [activeProject, isAuthenticated, refreshTasks]);

  // Fast Kanban card status update
  const moveTaskStatus = async (taskId, newStatus) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Task moved to ${newStatus.replace('_', ' ').toUpperCase()}`);
        refreshStats();
        refreshActivities();
      }
    } catch (error) {
      toast.error('Failed to move task');
      // Revert on error
      if (activeProject) refreshTasks(activeProject._id);
    }
  };

  // Modal helpers
  const openTaskModal = (task = null, defaultStatus = 'todo') => {
    setTaskModalData({ task, defaultStatus });
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalData({ task: null, defaultStatus: 'todo' });
  };

  const openProjectModal = (project = null) => {
    setProjectModalData(project);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setProjectModalData(null);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        tasks,
        setTasks,
        stats,
        activities,
        teamMembers,
        loading,
        refreshProjects,
        refreshTasks,
        refreshStats,
        refreshActivities,
        refreshTeam,
        moveTaskStatus,
        // Modal states
        isTaskModalOpen,
        taskModalData,
        openTaskModal,
        closeTaskModal,
        isProjectModalOpen,
        projectModalData,
        openProjectModal,
        closeProjectModal,
        isAboutModalOpen,
        openAboutModal: () => setIsAboutModalOpen(true),
        closeAboutModal: () => setIsAboutModalOpen(false),
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
