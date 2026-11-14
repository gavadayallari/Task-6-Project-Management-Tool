const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seeder] Connected to MongoDB. Clearing existing collections...');

    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Comment.deleteMany();
    await Activity.deleteMany();

    console.log('[Seeder] Creating Demo Users...');

    const admin = await User.create({
      name: 'Yallari Gavada (Admin)',
      email: 'admin@auspify.com',
      password: 'password123',
      role: 'admin',
      jobTitle: 'Head of Engineering',
      department: 'Executive',
      color: '#4F46E5', // Indigo
    });

    const pm = await User.create({
      name: 'Sarah Jenkins',
      email: 'pm@auspify.com',
      password: 'password123',
      role: 'project_manager',
      jobTitle: 'Senior Technical Project Manager',
      department: 'Product Management',
      color: '#059669', // Emerald
    });

    const dev = await User.create({
      name: 'Alex Rivera',
      email: 'dev@auspify.com',
      password: 'password123',
      role: 'member',
      jobTitle: 'Senior Full Stack Engineer',
      department: 'Engineering',
      color: '#2563EB', // Blue
    });

    const designer = await User.create({
      name: 'Priya Sharma',
      email: 'designer@auspify.com',
      password: 'password123',
      role: 'member',
      jobTitle: 'Product Design Lead',
      department: 'Design',
      color: '#DB2777', // Pink
    });

    const qa = await User.create({
      name: 'Marcus Chen',
      email: 'qa@auspify.com',
      password: 'password123',
      role: 'member',
      jobTitle: 'QA Automation Specialist',
      department: 'Quality Assurance',
      color: '#D97706', // Amber
    });

    console.log('[Seeder] Users created successfully.');
    console.log('[Seeder] Creating Realistic Projects...');

    const project1 = await Project.create({
      title: 'SyncFlow Cloud Platform v2.0',
      key: 'SYNC',
      description: 'Enterprise Kanban & collaboration software with real-time audit trail and task pipelines.',
      category: 'Web Development',
      status: 'active',
      priority: 'critical',
      owner: pm._id,
      members: [admin._id, pm._id, dev._id, designer._id, qa._id],
      startDate: new Date('2026-10-01'),
      dueDate: new Date('2026-11-30'),
      color: '#6366F1',
      taskCounter: 106,
    });

    const project2 = await Project.create({
      title: 'PulseHealth Mobile Client',
      key: 'PULSE',
      description: 'Next-generation telemetry and telemedicine mobile client for iOS and Android.',
      category: 'Mobile App',
      status: 'active',
      priority: 'high',
      owner: pm._id,
      members: [pm._id, dev._id, designer._id],
      startDate: new Date('2026-09-15'),
      dueDate: new Date('2026-12-15'),
      color: '#10B981',
      taskCounter: 104,
    });

    const project3 = await Project.create({
      title: 'Auspify Design System & Tokens',
      key: 'DS',
      description: 'Standardized UI component library, Figma sync, and accessible Tailwind tokens.',
      category: 'UI/UX Design',
      status: 'active',
      priority: 'medium',
      owner: admin._id,
      members: [admin._id, designer._id, dev._id],
      startDate: new Date('2026-10-10'),
      dueDate: new Date('2026-11-20'),
      color: '#EC4899',
      taskCounter: 103,
    });

    const project4 = await Project.create({
      title: 'Infrastructure & Kubernetes CI/CD',
      key: 'DEVOPS',
      description: 'Automated container build pipelines, blue-green deployment, and cluster autoscaling.',
      category: 'Cloud & DevOps',
      status: 'completed',
      priority: 'medium',
      owner: admin._id,
      members: [admin._id, dev._id],
      startDate: new Date('2026-08-01'),
      dueDate: new Date('2026-10-15'),
      color: '#8B5CF6',
      taskCounter: 102,
    });

    console.log('[Seeder] Creating Realistic Tasks for SyncFlow...');

    // Tasks for SYNC
    const t1 = await Task.create({
      title: 'Design high-converting Kanban drag-and-drop workspace',
      description: 'Create responsive Kanban board view supporting status columns, drag events, task cards, and interactive subtask checklists.',
      taskKey: 'SYNC-101',
      project: project1._id,
      status: 'in_progress',
      priority: 'urgent',
      assignees: [dev._id, designer._id],
      reporter: pm._id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days ahead
      estimatedHours: 16,
      spentHours: 10,
      labels: ['Frontend', 'Kanban', 'UI/UX'],
      checklist: [
        { text: 'Wireframe column layout and badge styles', isCompleted: true },
        { text: 'Implement HTML5 Drag and Drop events', isCompleted: true },
        { text: 'Add optimistic card move UI animations', isCompleted: false },
        { text: 'Mobile responsive column switcher', isCompleted: false },
      ],
      order: 0,
    });

    const t2 = await Task.create({
      title: 'Implement JWT Auth & RBAC Middleware with Demo Auto-Fill',
      description: 'Build secure authentication, bcrypt password hashing, role permissions (Admin, PM, Member), and instant 1-click test credentials.',
      taskKey: 'SYNC-102',
      project: project1._id,
      status: 'done',
      priority: 'high',
      assignees: [dev._id],
      reporter: admin._id,
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      spentHours: 8,
      labels: ['Backend', 'Security', 'Auth'],
      checklist: [
        { text: 'JWT sign and verify helper functions', isCompleted: true },
        { text: 'Role-based access middleware', isCompleted: true },
        { text: 'Demo account selector buttons in UI', isCompleted: true },
      ],
      order: 0,
    });

    const t3 = await Task.create({
      title: 'Audit Logging & Activity Feed Controller',
      description: 'Store every project action (creation, status movement, checklist completion, comments) to provide team transparency.',
      taskKey: 'SYNC-103',
      project: project1._id,
      status: 'in_review',
      priority: 'medium',
      assignees: [dev._id],
      reporter: pm._id,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      estimatedHours: 10,
      spentHours: 7,
      labels: ['Backend', 'API', 'Audit'],
      checklist: [
        { text: 'Create Activity schema with action enums', isCompleted: true },
        { text: 'Hook activity triggers in task status changes', isCompleted: true },
        { text: 'Front-end timeline feed component', isCompleted: true },
      ],
      order: 0,
    });

    const t4 = await Task.create({
      title: 'Task Commenting & Real-Time Discussion Thread',
      description: 'Enable team members to post comments, feedback, and technical notes directly on task drawer.',
      taskKey: 'SYNC-104',
      project: project1._id,
      status: 'todo',
      priority: 'medium',
      assignees: [dev._id, qa._id],
      reporter: pm._id,
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      estimatedHours: 6,
      spentHours: 0,
      labels: ['Fullstack', 'Discussions'],
      checklist: [
        { text: 'Build POST /api/tasks/:id/comments route', isCompleted: false },
        { text: 'Display author avatars with timestamp', isCompleted: false },
      ],
      order: 0,
    });

    const t5 = await Task.create({
      title: 'Export Project Summary & Tasks Report to CSV',
      description: 'Allow managers to export sprint velocity, task lists, and assignee workloads in standard CSV spreadsheet format.',
      taskKey: 'SYNC-105',
      project: project1._id,
      status: 'backlog',
      priority: 'low',
      assignees: [qa._id],
      reporter: pm._id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      estimatedHours: 5,
      spentHours: 0,
      labels: ['Export', 'Reporting'],
      checklist: [
        { text: 'Define CSV fields formatter', isCompleted: false },
        { text: 'Trigger client-side file download', isCompleted: false },
      ],
      order: 0,
    });

    const t6 = await Task.create({
      title: 'Cross-browser responsive testing & Postman API suite',
      description: 'Verify all REST API endpoints in Postman, ensure zero console errors, and validate layout on mobile/tablet viewports.',
      taskKey: 'SYNC-106',
      project: project1._id,
      status: 'in_progress',
      priority: 'high',
      assignees: [qa._id, dev._id],
      reporter: admin._id,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      spentHours: 4,
      labels: ['QA', 'Postman', 'Documentation'],
      checklist: [
        { text: 'Export Postman Collection v2.1', isCompleted: true },
        { text: 'Test 200, 201, 400, 401, 403, 404 response codes', isCompleted: true },
        { text: 'Verify Chrome, Safari, Firefox mobile viewports', isCompleted: false },
      ],
      order: 1,
    });

    // Tasks for PULSE
    await Task.create({
      title: 'Biometric Login & Apple HealthKit Sync',
      description: 'Integrate FaceID/TouchID authentication and secure health metrics synchronization.',
      taskKey: 'PULSE-101',
      project: project2._id,
      status: 'todo',
      priority: 'urgent',
      assignees: [dev._id],
      reporter: pm._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      estimatedHours: 20,
      spentHours: 2,
      labels: ['Mobile', 'iOS', 'HealthKit'],
      checklist: [
        { text: 'HealthKit permission flow', isCompleted: true },
        { text: 'Biometric keychain token storage', isCompleted: false },
      ],
      order: 0,
    });

    await Task.create({
      title: 'Doctor Appointment Scheduling UI',
      description: 'Calendar view showing available time slots, specialist profiles, and instant confirmation.',
      taskKey: 'PULSE-102',
      project: project2._id,
      status: 'in_progress',
      priority: 'high',
      assignees: [designer._id, dev._id],
      reporter: pm._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 14,
      spentHours: 8,
      labels: ['UI/UX', 'Calendar'],
      checklist: [
        { text: 'Time slot picker', isCompleted: true },
        { text: 'Doctor card components', isCompleted: true },
        { text: 'Push notification reminder hook', isCompleted: false },
      ],
      order: 0,
    });

    await Task.create({
      title: 'Patient Medical Record Encryption at Rest',
      description: 'Implement AES-256 field-level encryption for lab test reports and clinical prescriptions.',
      taskKey: 'PULSE-103',
      project: project2._id,
      status: 'done',
      priority: 'urgent',
      assignees: [dev._id],
      reporter: admin._id,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      estimatedHours: 12,
      spentHours: 12,
      labels: ['Security', 'HIPAA', 'Backend'],
      checklist: [
        { text: 'AES-256 encryption cipher utility', isCompleted: true },
        { text: 'Mongoose pre-save field encryption hook', isCompleted: true },
      ],
      order: 0,
    });

    // Tasks for DS
    await Task.create({
      title: 'Color Palette Tokens & Dark Mode Theme Config',
      description: 'Build semantic color hierarchy with accessible WCAG AAA contrast ratios.',
      taskKey: 'DS-101',
      project: project3._id,
      status: 'done',
      priority: 'medium',
      assignees: [designer._id],
      reporter: admin._id,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedHours: 6,
      spentHours: 6,
      labels: ['Design System', 'Tokens'],
      checklist: [
        { text: 'Define neutral and brand scales', isCompleted: true },
        { text: 'Contrast validation matrix', isCompleted: true },
      ],
      order: 0,
    });

    await Task.create({
      title: 'Accessible Modal & Drawer Component Suite',
      description: 'Focus trap, escape key listeners, backdrop blur, and animated enter/exit transitions.',
      taskKey: 'DS-102',
      project: project3._id,
      status: 'in_review',
      priority: 'high',
      assignees: [designer._id, dev._id],
      reporter: admin._id,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      spentHours: 7,
      labels: ['Components', 'Accessibility'],
      checklist: [
        { text: 'Escape key listener & focus restore', isCompleted: true },
        { text: 'Tailwind animation keyframes', isCompleted: true },
      ],
      order: 0,
    });

    console.log('[Seeder] Creating Task Comments...');
    await Comment.create({
      task: t1._id,
      author: pm._id,
      content: 'Great progress on the Kanban drag events! Let us make sure the cards also have smooth touch support for mobile tablets.',
    });

    await Comment.create({
      task: t1._id,
      author: dev._id,
      content: 'Added click-to-move dropdown fallback alongside HTML5 drag and drop for optimal mobile compatibility.',
    });

    await Comment.create({
      task: t3._id,
      author: admin._id,
      content: 'The audit logging looks very clean. Let us ensure status transitions record both previous and new statuses.',
    });

    console.log('[Seeder] Creating Activity Logs...');
    const activities = [
      {
        project: project1._id,
        task: t1._id,
        user: dev._id,
        action: 'status_changed',
        summary: 'moved SYNC-101 to IN PROGRESS',
      },
      {
        project: project1._id,
        task: t2._id,
        user: dev._id,
        action: 'completed_task',
        summary: 'completed SYNC-102: JWT Auth & RBAC',
      },
      {
        project: project1._id,
        task: t3._id,
        user: dev._id,
        action: 'status_changed',
        summary: 'moved SYNC-103 to IN REVIEW',
      },
      {
        project: project1._id,
        task: t6._id,
        user: qa._id,
        action: 'created_task',
        summary: 'created task SYNC-106: Cross-browser testing',
      },
      {
        project: project2._id,
        user: pm._id,
        action: 'created_project',
        summary: 'created project "PulseHealth Mobile Client"',
      },
    ];

    await Activity.insertMany(activities);

    console.log('====================================================');
    console.log('🎉 Seeding successfully completed!');
    console.log('----------------------------------------------------');
    console.log('Demo Accounts:');
    console.log('1. Admin:           admin@auspify.com   / password123');
    console.log('2. Project Manager: pm@auspify.com      / password123');
    console.log('3. Lead Developer:  dev@auspify.com     / password123');
    console.log('4. UI/UX Designer:  designer@auspify.com/ password123');
    console.log('5. QA Engineer:     qa@auspify.com      / password123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
