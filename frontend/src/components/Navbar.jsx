import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, FolderKanban, LogIn, Eye } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}
          >
            <FolderKanban size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, tracking: '-0.5px' }}>
              Project<span style={{ color: '#6366f1' }}>Flow</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Management Workspace</p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.full_name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 10px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600
              }}
            >
              <Eye size={14} />
              Guest Demo Access
            </span>

            <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              <LogIn size={16} />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
