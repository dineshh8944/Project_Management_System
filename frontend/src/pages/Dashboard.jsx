import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  PlayCircle,
  Plus,
  ArrowRight,
  Activity
} from 'lucide-react';

const Dashboard = ({ onNavigate, onOpenProjectModal, onOpenTaskModal }) => {
  const [stats, setStats] = useState({
    total_projects: 0,
    in_progress_projects: 0,
    completed_projects: 0,
    not_started_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/projects/stats/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentProjects(res.data.recent_projects || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const taskCompletionRate = stats.total_tasks > 0
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
    : 0;

  return (
    <div className="animate-fade-in" style={{ padding: '32px' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Dashboard Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time analytics and task tracking progress
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onOpenProjectModal} className="btn btn-secondary">
            <Plus size={18} />
            <span>New Project</span>
          </button>
          <button onClick={onOpenTaskModal} className="btn btn-primary">
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 5 Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {/* Total Projects */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Projects
            </span>
            <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: '#818cf8' }}>
              <FolderKanban size={22} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats.total_projects}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Projects owned by you
          </div>
        </div>

        {/* Projects In Progress */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Projects In Progress
            </span>
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '10px', color: '#fbbf24' }}>
              <PlayCircle size={22} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats.in_progress_projects}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active execution phase</div>
        </div>

        {/* Total Tasks */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Tasks
            </span>
            <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '10px', color: '#c084fc' }}>
              <Activity size={22} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats.total_tasks}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across all projects</div>
        </div>

        {/* Completed Tasks */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Completed Tasks
            </span>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#34d399' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats.completed_tasks}</div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '4px' }}>{taskCompletionRate}% completion rate</div>
        </div>

        {/* Pending Tasks */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Pending Tasks
            </span>
            <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '10px', color: '#f87171' }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{stats.pending_tasks}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tasks awaiting resolution</div>
        </div>
      </div>

      {/* Task Completion Progress Section */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Overall Productivity Index</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Completed {stats.completed_tasks} of {stats.total_tasks} total tasks
            </p>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8' }}>{taskCompletionRate}%</span>
        </div>
        <div className="progress-bar-bg" style={{ height: '12px' }}>
          <div className="progress-bar-fill" style={{ width: `${taskCompletionRate}%` }}></div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Projects</h3>
          <button
            onClick={() => onNavigate('projects')}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>PROJECT NAME</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>PROGRESS</th>
                <th style={{ padding: '12px 16px' }}>START DATE</th>
                <th style={{ padding: '12px 16px' }}>END DATE</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading projects...' : 'No projects found. Create a new project to get started!'}
                  </td>
                </tr>
              ) : (
                recentProjects.map((p) => {
                  const projectProgress = p.total_tasks > 0
                    ? Math.round((p.completed_tasks / p.total_tasks) * 100)
                    : 0;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#fff' }}>{p.name}</td>
                      <td style={{ padding: '16px' }}>
                        <span
                          className={`badge badge-${
                            p.status === 'Not Started' ? 'not-started' : p.status === 'In Progress' ? 'in-progress' : 'completed'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', width: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="progress-bar-bg" style={{ flex: 1 }}>
                            <div className="progress-bar-fill" style={{ width: `${projectProgress}%` }}></div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{projectProgress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{p.start_date || 'N/A'}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{p.end_date || 'N/A'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
