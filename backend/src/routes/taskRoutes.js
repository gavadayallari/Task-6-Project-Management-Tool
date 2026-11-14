const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/status')
  .patch(updateTaskStatus);

router.route('/:id/checklist')
  .post(addChecklistItem);

router.route('/:id/checklist/:itemId')
  .patch(toggleChecklistItem)
  .delete(deleteChecklistItem);

router.route('/:id/comments')
  .post(addComment);

router.route('/:id/comments/:commentId')
  .delete(deleteComment);

module.exports = router;
