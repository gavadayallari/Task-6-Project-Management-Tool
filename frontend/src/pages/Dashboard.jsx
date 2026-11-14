import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
  Activity,
  Layers,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    projects,
    stats,
    activities,
    tasks,
    setActiveProject,
    openTaskModal,
    openProjectModal,
  } = useProject();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Urgent tasks
  const urgentTasks = tasks
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done')
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-brand-200 border border-white/10">
                {formattedDate}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auspify Task 5
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Developer'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Here is your engineering workspace pulse. Track sprints, manage task pipelines, and collaborate across teams seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openTaskModal(null, 'todo')}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => openProjectModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Workspaces
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats ? stats.totalProjects : projects.length}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {stats?.activeProjects || 0} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Across {projects.length} cross-functional teams
          </p>
        </div>

        {/* Active Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tasks in Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats ? stats.totalTasks : tasks.length}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {stats ? stats.inProgressTasks + stats.inReviewTasks : 0} In Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            {stats?.todoTasks || 0} to do • {stats?.backlogTasks || 0} in backlog
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {stats ? `${stats.completionRate}%` : '0%'}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {stats?.doneTasks || 0} Completed
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats?.completionRate || 0}%` }}
            />
          </div>
        </div>

        {/* Urgent & Overdue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Urgent & Overdue
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              {stats ? stats.urgentTasks : 0}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
              {stats?.overdueTasks || 0} Overdue
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Needs team focus & sprint priority
          </p>
        </div>
      </div>

      {/* Main Content: Projects Grid & Right Sidebar (Urgent Tasks & Activity Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects Showcase */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span>Active Workspaces & Projects</span>
            </h2>
            <Link
              to="/projects"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const taskCount = proj.stats?.totalTasks || 0;
              const doneCount = proj.stats?.doneTasks || 0;
              const pct = proj.stats?.progressPercentage || 0;

              return (
                <div
                  key={proj._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-md"
                          style={{ backgroundColor: proj.color || '#4F46E5' }}
                        />
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {proj.key}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {proj.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {proj.description || 'No description provided.'}
                    </p>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span>Sprint Progress</span>
                        <span className="font-bold text-slate-800">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: proj.color || '#4F46E5',
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer: Member avatars & Board Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center -space-x-1.5">
                        {proj.members?.slice(0, 3).map((m) => (
                          <div
                            key={m._id}
                            title={m.name}
                            className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                            style={{ backgroundColor: m.color || '#4F46E5' }}
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {proj.members?.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                            +{proj.members.length - 3}
                          </div>
                        )}
                      </div>

                      <Link
                        to="/board"
                        onClick={() => setActiveProject(proj)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <span>Open Board</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Urgent Tasks & Activity Stream */}
        <div className="space-y-6">
          {/* Urgent Tasks Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Priority Action Items</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {urgentTasks.length} pending
              </span>
            </div>

            <div className="space-y-2.5">
              {urgentTasks.map((t) => (
                <div
                  key={t._id}
                  onClick={() => openTaskModal(t)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200/80 hover:border-brand-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {t.taskKey || 'TASK'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {t.title}
                  </h4>
                  {t.dueDate && (
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}

              {urgentTasks.length === 0 && (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  No urgent tasks at the moment. Great job!
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>Live Activity Stream</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activities.slice(0, 7).map((act) => (
                <div key={act._id} className="flex items-start gap-2.5 text-xs">
                  <div
                    className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: act.user?.color || '#4F46E5' }}
                  >
                    {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-700 leading-snug">
                      <strong className="text-slate-900">{act.user?.name || 'User'}</strong>{' '}
                      {act.summary}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  No recent activities recorded.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
