const Activity = require('../models/Activity');

// @desc    Get recent workspace activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const { project, limit = 20 } = req.query;
    let query = {};

    if (project) {
      query.project = project;
    }

    const activities = await Activity.find(query)
      .populate('user', 'name email jobTitle color')
      .populate('project', 'title key color')
      .populate('task', 'title taskKey status')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
};
