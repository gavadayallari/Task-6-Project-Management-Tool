import React, { useState } from 'react';
import {
  Users,
  Mail,
  Briefcase,
  Building,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Search,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const Team = () => {
  const { teamMembers, tasks } = useProject();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = teamMembers.filter((m) => {
    return (
      searchTerm === '' ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.jobTitle && m.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.department && m.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Team & Engineering Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-functional engineers, product leads, and QA specialists assigned to tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {teamMembers.length} Active Members
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          // Count assigned tasks
          const assignedCount = tasks.filter(
            (t) =>
              t.assignees &&
              t.assignees.some((a) => (typeof a === 'object' ? a._id === member._id : a === member._id))
          ).length;

          return (
            <div
              key={member._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl text-white font-bold text-base flex items-center justify-center shadow-md"
                    style={{ backgroundColor: member.color || '#4F46E5' }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase">
                    <ShieldCheck className="w-3 h-3 text-brand-600" />
                    {member.role?.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {member.name}
                </h3>
                <p className="text-xs text-brand-600 font-semibold mb-3 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {member.jobTitle || 'Full Stack Engineer'}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.department || 'Engineering'}</span>
                  </div>
                </div>
              </div>

              {/* Footer task count */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned Tasks:</span>
                <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {assignedCount} tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
