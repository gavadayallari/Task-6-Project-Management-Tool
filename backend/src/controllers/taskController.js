const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

// @desc    Get all tasks with filtering
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignee, search, label } = req.query;
    let query = {};

    if (project) {
      query.project = project;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (assignee && assignee !== 'all') {
      query.assignees = assignee;
    }

    if (label && label !== 'all') {
      query.labels = label;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { taskKey: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('project', 'title key color')
      .populate('assignees', 'name email jobTitle department color')
      .populate('reporter', 'name email jobTitle color')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task with full details & comments
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title key color members')
      .populate('assignees', 'name email jobTitle department color')
      .populate('reporter', 'name email jobTitle color');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const comments = await Comment.find({ task: task._id })
      .populate('author', 'name email jobTitle color')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      task,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      project: projectId,
      status,
      priority,
      assignees,
      dueDate,
      estimatedHours,
      labels,
      checklist,
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title and target project',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Auto-generate next task key (e.g., SYNC-101)
    project.taskCounter = (project.taskCounter || 100) + 1;
    await project.save();
    const taskKey = `${project.key}-${project.taskCounter}`;

    // Get order within column
    const currentStatus = status || 'todo';
    const lastTaskInCol = await Task.findOne({ project: projectId, status: currentStatus })
      .sort({ order: -1 });
    const order = lastTaskInCol ? lastTaskInCol.order + 1 : 0;

    const task = await Task.create({
      title,
      description: description || '',
      taskKey,
      project: projectId,
      status: currentStatus,
      priority: priority || 'medium',
      assignees: assignees || [],
      reporter: req.user.id,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 0,
      labels: labels || [],
      checklist: checklist || [],
      order,
    });

    // Record Activity
    await Activity.create({
      project: project._id,
      task: task._id,
      user: req.user.id,
      action: 'created_task',
      summary: `created task ${taskKey}: "${task.title}"`,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title key color')
      .populate('assignees', 'name email jobTitle department color')
      .populate('reporter', 'name email jobTitle color');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const {
      title,
      description,
      status,
      priority,
      assignees,
      dueDate,
      estimatedHours,
      spentHours,
      labels,
      checklist,
      order,
    } = req.body;

    const oldStatus = task.status;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignees !== undefined) task.assignees = assignees;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (spentHours !== undefined) task.spentHours = spentHours;
    if (labels !== undefined) task.labels = labels;
    if (checklist !== undefined) task.checklist = checklist;
    if (order !== undefined) task.order = order;

    await task.save();

    // Check if status changed
    if (status && status !== oldStatus) {
      await Activity.create({
        project: task.project,
        task: task._id,
        user: req.user.id,
        action: status === 'done' ? 'completed_task' : 'status_changed',
        summary: `moved ${task.taskKey || 'task'} from ${oldStatus.toUpperCase()} to ${status.toUpperCase()}`,
      });
    } else {
      await Activity.create({
        project: task.project,
        task: task._id,
        user: req.user.id,
        action: 'updated_task',
        summary: `updated task ${task.taskKey || task.title}`,
      });
    }

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'title key color')
      .populate('assignees', 'name email jobTitle department color')
      .populate('reporter', 'name email jobTitle color');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fast status update (Kanban Drag & Drop or Click)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;

    if (!['backlog', 'todo', 'in_progress', 'in_review', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const oldStatus = task.status;
    task.status = status;
    if (order !== undefined) task.order = order;

    await task.save();

    await Activity.create({
      project: task.project,
      task: task._id,
      user: req.user.id,
      action: status === 'done' ? 'completed_task' : 'status_changed',
      summary: `moved ${task.taskKey || task.title} to ${status.toUpperCase().replace('_', ' ')}`,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'title key color')
      .populate('assignees', 'name email jobTitle department color')
      .populate('reporter', 'name email jobTitle color');

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}`,
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await Comment.deleteMany({ task: task._id });
    await Activity.create({
      project: task.project,
      user: req.user.id,
      action: 'deleted_task',
      summary: `deleted task ${task.taskKey || task.title}`,
    });

    await Task.findByIdAndDelete(task._id);

    res.status(200).json({
      success: true,
      message: `Task ${task.taskKey || ''} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add checklist subtask
// @route   POST /api/tasks/:id/checklist
// @access  Private
const addChecklistItem = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Checklist item text is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.checklist.push({ text: text.trim(), isCompleted: false });
    await task.save();

    res.status(201).json({
      success: true,
      checklist: task.checklist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle checklist item completion
// @route   PATCH /api/tasks/:id/checklist/:itemId
// @access  Private
const toggleChecklistItem = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const item = task.checklist.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Checklist item not found' });
    }

    item.isCompleted = !item.isCompleted;
    await task.save();

    res.status(200).json({
      success: true,
      checklist: task.checklist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete checklist item
// @route   DELETE /api/tasks/:id/checklist/:itemId
// @access  Private
const deleteChecklistItem = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.checklist.pull(req.params.itemId);
    await task.save();

    res.status(200).json({
      success: true,
      checklist: task.checklist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: task._id,
      author: req.user.id,
      content: content.trim(),
    });

    await Activity.create({
      project: task.project,
      task: task._id,
      user: req.user.id,
      action: 'added_comment',
      summary: `commented on ${task.taskKey || 'task'}`,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name email jobTitle color'
    );

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  addComment,
  deleteComment,
};
