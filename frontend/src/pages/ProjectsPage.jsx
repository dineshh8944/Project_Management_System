import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  LogIn
} from 'lucide-react';

const INITIAL_DEMO_PROJECTS = [
  {
    id: 'demo-1',
    name: 'E-Commerce Platform Redesign',
    description: 'Modernizing storefront UI with React, Tailwind CSS, and Stripe payment checkout.',
    status: 'In Progress',
    start_date: '2026-09-01',
    end_date: '2026-10-15',
    total_tasks: 4,
    completed_tasks: 2
  },
  {
    id: 'demo-2',
    name: 'Mobile Banking App API Integration',
    description: 'Secure REST API endpoints with JWT authentication, bcrypt password hashing, and rate limiting.',
    status: 'Completed',
    start_date: '2026-08-10',
    end_date: '2026-09-05',
    total_tasks: 3,
    completed_tasks: 3
  },
  {
    id: 'demo-3',
    name: 'AI Analytics Dashboard',
    description: 'Real-time metrics charts, exportable PDF reports, and automated predictive insights.',
    status: 'Not Started',
    start_date: '2026-10-01',
    end_date: '2026-11-30',
    total_tasks: 3,
    completed_tasks: 0
  }
];

const ProjectsPage = ({ isGuest, onOpenCreateModal, onEditProject, showToast, onOpenAuth }) => {
  const [projects, setProjects] = useState(isGuest ? INITIAL_DEMO_PROJECTS : []);
  const [loading, setLoading] = useState(!isGuest);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProjects = async () => {
    if (isGuest) {
      // Filter local demo projects
      let filtered = INITIAL_DEMO_PROJECTS;
      if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      if (statusFilter) {
        filtered = filtered.filter(p => p.status === statusFilter);
      }
      setProjects(filtered);
      return;
    }

    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/projects', { params });
      if (res.data.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, statusFilter, isGuest]);

  const handleDelete = async (id, name) => {
    if (isGuest) {
      onOpenAuth();
      return;
    }
    if (!window.confirm(`Are you sure you want to delete project "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await API.delete(`/projects/${id}`);
      if (res.data.success) {
        showToast(`Project "${name}" deleted successfully`, 'success');
        fetchProjects();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete project', 'error');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px' }}>
      {/* Guest Banner */}
      {isGuest && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500 }}>
              Viewing sample projects in <strong>Guest Mode</strong>. Sign in to create, edit, or delete live projects.
            </span>
          </div>
          <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Header & Controls Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Projects Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Create and organize project workspaces
          </p>
        </div>
        <button onClick={isGuest ? onOpenAuth : onOpenCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '42px' }}
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by Status:</span>
          <select
            className="form-control"
            style={{ width: '180px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <FolderKanban size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Projects Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            {search || statusFilter ? 'Try clearing your search or status filter criteria.' : 'Get started by creating your first project!'}
          </p>
          <button onClick={isGuest ? onOpenAuth : onOpenCreateModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {projects.map((p) => {
            const taskCount = Number(p.total_tasks || 0);
            const completedCount = Number(p.completed_tasks || 0);
            const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

            return (
              <div
                key={p.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span
                      className={`badge badge-${
                        p.status === 'Not Started' ? 'not-started' : p.status === 'In Progress' ? 'in-progress' : 'completed'
                      }`}
                    >
                      {p.status}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => (isGuest ? onOpenAuth() : onEditProject(p))} className="btn-icon" title="Edit Project">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="btn-icon" title="Delete Project">
                        <Trash2 size={16} color="#f87171" />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{p.name}</h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      marginBottom: '20px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '60px'
                    }}
                  >
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  {/* Progress ratio */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Task Progress ({completedCount}/{taskCount})</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  {/* Dates Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>{p.start_date ? p.start_date : 'No start date'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>Due: {p.end_date ? p.end_date : 'Open'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
