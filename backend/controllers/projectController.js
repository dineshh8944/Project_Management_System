const { pool } = require('../config/db');

// Get all projects owned by user with search, status filter, and task count stats
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status } = req.query;

    let sql = `
      SELECT 
        p.*, 
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = ?
    `;
    const params = [userId];

    if (search) {
      sql += ` AND p.name LIKE ?`;
      params.push(`%${search.trim()}%`);
    }

    if (status) {
      sql += ` AND p.status = ?`;
      params.push(status);
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [projects] = await pool.query(sql, params);

    return res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get Projects Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving projects.' });
  }
};

// Get single project by ID (scoped to authenticated user)
const getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const [projects] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);

    if (projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found or unauthorized.' });
    }

    // Get all tasks under this project
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE project_id = ? AND user_id = ? ORDER BY created_at DESC', [projectId, userId]);

    return res.json({
      success: true,
      project: {
        ...projects[0],
        tasks
      }
    });
  } catch (error) {
    console.error('Get Project By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving project details.' });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, status = 'Not Started', start_date, end_date } = req.body;

    const [result] = await pool.query(
      'INSERT INTO projects (user_id, name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, description || null, status, start_date || null, end_date || null]
    );

    const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project: newProject[0]
    });
  } catch (error) {
    console.error('Create Project Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating project.' });
  }
};

// Update project (scoped to user)
const updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, description, status, start_date, end_date } = req.body;

    // Check ownership
    const [existing] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found or unauthorized access.' });
    }

    await pool.query(
      'UPDATE projects SET name = ?, description = ?, status = ?, start_date = ?, end_date = ? WHERE id = ? AND user_id = ?',
      [name, description || null, status, start_date || null, end_date || null, projectId, userId]
    );

    const [updated] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);

    return res.json({
      success: true,
      message: 'Project updated successfully.',
      project: updated[0]
    });
  } catch (error) {
    console.error('Update Project Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating project.' });
  }
};

// Delete project (scoped to user)
const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const [existing] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found or unauthorized access.' });
    }

    await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);

    return res.json({
      success: true,
      message: 'Project and all associated tasks deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Project Error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting project.' });
  }
};

// Get Dashboard Aggregated Statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Projects Statistics
    const [projStats] = await pool.query(`
      SELECT 
        COUNT(*) AS total_projects,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_projects,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_projects,
        SUM(CASE WHEN status = 'Not Started' THEN 1 ELSE 0 END) AS not_started_projects
      FROM projects WHERE user_id = ?
    `, [userId]);

    // 2. Tasks Statistics
    const [taskStats] = await pool.query(`
      SELECT 
        COUNT(*) AS total_tasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending_tasks,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tasks
      FROM tasks WHERE user_id = ?
    `, [userId]);

    // 3. Recent Projects
    const [recentProjects] = await pool.query(`
      SELECT p.*, COUNT(t.id) as total_tasks,
      SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC LIMIT 5
    `, [userId]);

    return res.json({
      success: true,
      stats: {
        total_projects: Number(projStats[0].total_projects || 0),
        in_progress_projects: Number(projStats[0].in_progress_projects || 0),
        completed_projects: Number(projStats[0].completed_projects || 0),
        not_started_projects: Number(projStats[0].not_started_projects || 0),
        total_tasks: Number(taskStats[0].total_tasks || 0),
        completed_tasks: Number(taskStats[0].completed_tasks || 0),
        pending_tasks: Number(taskStats[0].pending_tasks || 0),
        in_progress_tasks: Number(taskStats[0].in_progress_tasks || 0),
      },
      recent_projects: recentProjects
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving dashboard statistics.' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDashboardStats
};
