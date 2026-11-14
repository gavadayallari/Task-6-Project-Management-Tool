const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all projects with task counts and progress
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { search, status, priority, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email jobTitle department color')
      .populate('members', 'name email jobTitle department color')
      .sort({ updatedAt: -1 });

    // Enhance projects with live task progress statistics
    const enhancedProjects = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id }).select('status priority dueDate');
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter((t) => t.status === 'done').length;
        const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
        const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        return {
          ...project.toObject(),
          stats: {
            totalTasks,
            doneTasks,
            inProgressTasks,
            progressPercentage,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enhancedProjects.length,
      projects: enhancedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system-wide dashboard statistics
// @route   GET /api/projects/stats
// @access  Private
const getProjectStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    const totalTasks = await Task.countDocuments();
    const backlogTasks = await Task.countDocuments({ status: 'backlog' });
    const todoTasks = await Task.countDocuments({ status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ status: 'in_progress' });
    const inReviewTasks = await Task.countDocuments({ status: 'in_review' });
    const doneTasks = await Task.countDocuments({ status: 'done' });

    const urgentTasks = await Task.countDocuments({ priority: 'urgent', status: { $ne: 'done' } });
    
    // Tasks overdue (due date < now and status != done)
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    });

    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        backlogTasks,
        todoTasks,
        inProgressTasks,
        inReviewTasks,
        doneTasks,
        urgentTasks,
        overdueTasks,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID with members and stats
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email jobTitle department color')
      .populate('members', 'name email jobTitle department color');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignees', 'name email jobTitle color')
      .sort({ order: 1, createdAt: -1 });

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        stats: {
          totalTasks,
          doneTasks,
          inProgressTasks,
          progressPercentage,
        },
      },
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, key, description, category, priority, members, startDate, dueDate, color } = req.body;

    if (!title || !key) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project title and key',
      });
    }

    const cleanKey = key.trim().toUpperCase();

    // Check if key already in use
    const existingKey = await Project.findOne({ key: cleanKey });
    if (existingKey) {
      return res.status(400).json({
        success: false,
        message: `Project key '${cleanKey}' is already in use. Please select a different key.`,
      });
    }

    const memberList = members && Array.isArray(members) ? members : [];
    if (!memberList.includes(req.user.id)) {
      memberList.push(req.user.id);
    }

    const project = await Project.create({
      title,
      key: cleanKey,
      description,
      category: category || 'Web Development',
      priority: priority || 'medium',
      owner: req.user.id,
      members: memberList,
      startDate: startDate || Date.now(),
      dueDate: dueDate || null,
      color: color || '#4F46E5',
    });

    // Record Activity
    await Activity.create({
      project: project._id,
      user: req.user.id,
      action: 'created_project',
      summary: `created project "${project.title}" (${project.key})`,
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email jobTitle department color')
      .populate('members', 'name email jobTitle department color');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const { title, description, category, status, priority, members, startDate, dueDate, color } = req.body;

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (category) project.category = category;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (members && Array.isArray(members)) project.members = members;
    if (startDate) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (color) project.color = color;

    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user.id,
      action: 'updated_project',
      summary: `updated project details for "${project.title}"`,
    });

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email jobTitle department color')
      .populate('members', 'name email jobTitle department color');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project and its tasks
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Role check: Only admin, project owner, or project_manager can delete
    if (
      req.user.role !== 'admin' &&
      project.owner.toString() !== req.user.id &&
      req.user.role !== 'project_manager'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this project',
      });
    }

    // Delete all tasks under this project
    await Task.deleteMany({ project: project._id });
    await Activity.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: `Project "${project.title}" and its associated tasks deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
