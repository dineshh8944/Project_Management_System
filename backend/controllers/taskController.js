const { pool } = require('../config/db');

// Get all tasks with search, project, status, and priority filters
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, project_id, status, priority } = req.query;

    let sql = `
      SELECT t.*, p.name AS project_name 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (search) {
      sql += ` AND t.name LIKE ?`;
      params.push(`%${search.trim()}%`);
    }

    if (project_id) {
      sql += ` AND t.project_id = ?`;
      params.push(project_id);
    }

    if (status) {
      sql += ` AND t.status = ?`;
      params.push(status);
    }

    if (priority) {
      sql += ` AND t.priority = ?`;
      params.push(priority);
    }

    sql += ` ORDER BY t.created_at DESC`;

    const [tasks] = await pool.query(sql, params);

    return res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving tasks.' });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [tasks] = await pool.query(
      `SELECT t.*, p.name AS project_name FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ? AND t.user_id = ?`,
      [taskId, userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized access.' });
    }

    return res.json({
      success: true,
      task: tasks[0]
    });
  } catch (error) {
    console.error('Get Task By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving task.' });
  }
};

// Create task under a user project
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { project_id, name, description, priority = 'Medium', status = 'Pending', due_date } = req.body;

    // Verify project belongs to user
    const [project] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [project_id, userId]);
    if (project.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid project ID or project does not belong to you.' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (project_id, user_id, name, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [project_id, userId, name, description || null, priority, status, due_date || null]
    );

    const [newTask] = await pool.query(
      'SELECT t.*, p.name as project_name FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task: newTask[0]
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating task.' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { project_id, name, description, priority, status, due_date } = req.body;

    // Check ownership of task
    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized access.' });
    }

    // Verify project ownership if project_id is being changed
    if (project_id) {
      const [project] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [project_id, userId]);
      if (project.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid target project ID.' });
      }
    }

    await pool.query(
      `UPDATE tasks SET name = ?, description = ?, priority = ?, status = ?, due_date = ? ${project_id ? ', project_id = ?' : ''} WHERE id = ? AND user_id = ?`,
      project_id
        ? [name, description || null, priority, status, due_date || null, project_id, taskId, userId]
        : [name, description || null, priority, status, due_date || null, taskId, userId]
    );

    const [updated] = await pool.query(
      'SELECT t.*, p.name as project_name FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ?',
      [taskId]
    );

    return res.json({
      success: true,
      message: 'Task updated successfully.',
      task: updated[0]
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating task.' });
  }
};

// Toggle or patch task status
const patchTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized access.' });
    }

    await pool.query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, taskId, userId]);

    return res.json({
      success: true,
      message: `Task marked as ${status}.`
    });
  } catch (error) {
    console.error('Patch Task Status Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating task status.' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const [existing] = await pool.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized access.' });
    }

    await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

    return res.json({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting task.' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTaskStatus,
  deleteTask
};
