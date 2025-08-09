const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const { body, validationResult } = require('express-validator');

/**
 * Create task
 * POST /api/tasks
 */
router.post(
  '/',
  auth,
  [body('title').notEmpty().withMessage('Title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, status, dueDate } = req.body;
      const task = new Task({
        user: req.user.id,
        title,
        description,
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      await task.save();
      return res.json(task);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * Get tasks (paginated + filters)
 * GET /api/tasks
 * Query params:
 *  - page (default 1)
 *  - limit (default 10)
 *  - status (pending|in-progress|completed)
 *  - dueBefore (ISO date)
 *  - dueAfter (ISO date)
 */
router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const status = req.query.status;
    const dueBefore = req.query.dueBefore;
    const dueAfter = req.query.dueAfter;

    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (dueBefore || dueAfter) {
      filter.dueDate = {};
      if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      tasks,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get single task
 * GET /api/tasks/:id
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) return res.status(404).json({ message: 'Not found' });
    return res.json(task);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update task
 * PUT /api/tasks/:id
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const { title, description, status, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined && ['pending', 'in-progress', 'completed'].includes(status)) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;

    await task.save();
    return res.json(task);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Delete task
 * DELETE /api/tasks/:id
 */

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json({ message: 'Deleted successfully' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
