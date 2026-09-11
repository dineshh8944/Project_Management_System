import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProjectModal from './components/ProjectModal';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';

import API from './services/api';

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [projectsList, setProjectsList] = useState([]);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 4000);
  };

  // Fetch projects list for task modal creation
  const fetchUserProjects = async () => {
    try {
      const res = await API.get('/projects');
      if (res.data.success) {
        setProjectsList(res.data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load user projects for modal', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user, activeTab, isProjectModalOpen, isTaskModalOpen]);

  // Project modal handlers
  const handleOpenProjectCreate = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenProjectEdit = (project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (formData) => {
    if (editingProject) {
      const res = await API.put(`/projects/${editingProject.id}`, formData);
      if (res.data.success) {
        showToast('Project updated successfully!', 'success');
      }
    } else {
      const res = await API.post('/projects', formData);
      if (res.data.success) {
        showToast('Project created successfully!', 'success');
      }
    }
    fetchUserProjects();
  };

  // Task modal handlers
  const handleOpenTaskCreate = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenTaskEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    if (editingTask) {
      const res = await API.put(`/tasks/${editingTask.id}`, formData);
      if (res.data.success) {
        showToast('Task updated successfully!', 'success');
      }
    } else {
      const res = await API.post('/tasks', formData);
      if (res.data.success) {
        showToast('Task created successfully!', 'success');
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#818cf8',
          fontSize: '1.2rem',
          fontWeight: 600
        }}
      >
        Initializing ProjectFlow...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={setActiveTab}
              onOpenProjectModal={handleOpenProjectCreate}
              onOpenTaskModal={handleOpenTaskCreate}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              onOpenCreateModal={handleOpenProjectCreate}
              onEditProject={handleOpenProjectEdit}
              showToast={showToast}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              onOpenCreateModal={handleOpenTaskCreate}
              onEditTask={handleOpenTaskEdit}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Project Creation/Editing Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />

      {/* Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        projects={projectsList}
      />

      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
