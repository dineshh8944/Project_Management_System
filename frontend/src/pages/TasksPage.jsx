import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  FolderKanban
} from 'lucide-react';

const TasksPage = ({ onOpenCreateModal, onEditTask, showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      if (res.data.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error('Error fetching projects list:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (projectFilter) params.project_id = projectFilter;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await API.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [search, projectFilter, statusFilter, priorityFilter]);

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await API.patch(`/tasks/${task.id}/status`, { status: nextStatus });
      if (res.data.success) {
        showToast(`Task updated to ${nextStatus}`, 'success');
        fetchTasks();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete task "${name}"?`)) {
      return;
    }
    try {
      const res = await API.delete(`/tasks/${id}`);
      if (res.data.success) {
        showToast(`Task "${name}" deleted successfully`, 'success');
        fetchTasks();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Task Workspace</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Filter, manage, and complete action items across your projects
          </p>
        </div>
        <button onClick={onOpenCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Multi-Criteria Search & Filter Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '32px'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '42px' }}
            placeholder="Search tasks by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Project Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderKanban size={16} color="var(--text-muted)" />
          <select
            className="form-control"
            style={{ width: '160px' }}
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="form-control"
            style={{ width: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} color="var(--text-muted)" />
          <select
            className="form-control"
            style={{ width: '140px' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Task List / Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading task items...
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <CheckSquare size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Tasks Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            {search || projectFilter || statusFilter || priorityFilter
              ? 'No tasks matched your search or filter parameters.'
              : 'Create your first task to start organizing work.'}
          </p>
          <button onClick={onOpenCreateModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '8px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 20px', width: '50px' }}>DONE</th>
                <th style={{ padding: '16px 20px' }}>TASK NAME</th>
                <th style={{ padding: '16px 20px' }}>PROJECT</th>
                <th style={{ padding: '16px 20px' }}>PRIORITY</th>
                <th style={{ padding: '16px 20px' }}>STATUS</th>
                <th style={{ padding: '16px 20px' }}>DUE DATE</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const isCompleted = t.status === 'Completed';

                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      opacity: isCompleted ? 0.75 : 1
                    }}
                  >
                    {/* Toggle Checkbox */}
                    <td style={{ padding: '16px 20px' }}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggleStatus(t)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366f1' }}
                      />
                    </td>

                    {/* Name & Description */}
                    <td style={{ padding: '16px 20px' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: isCompleted ? 'var(--text-muted)' : '#fff',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}
                      >
                        {t.name}
                      </div>
                      {t.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {t.description}
                        </div>
                      )}
                    </td>

                    {/* Project Tag */}
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {t.project_name}
                      </span>
                    </td>

                    {/* Priority Badge */}
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        className={`badge badge-priority-${
                          t.priority === 'Low' ? 'low' : t.priority === 'Medium' ? 'medium' : 'high'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        className={`badge badge-${
                          t.status === 'Pending' ? 'pending' : t.status === 'In Progress' ? 'in-progress' : 'completed'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {t.due_date ? t.due_date : 'No deadline'}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button onClick={() => onEditTask(t)} className="btn-icon" title="Edit Task">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.name)} className="btn-icon" title="Delete Task">
                          <Trash2 size={16} color="#f87171" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
