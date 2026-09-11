import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  Layers,
  Users,
  Lock,
  Database
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onLogin }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', overflowX: 'hidden' }}>
      {/* Top Header Navigation */}
      <header
        style={{
          height: '76px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <FolderKanban size={24} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Project<span style={{ color: '#6366f1' }}>Flow</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onLogin} className="btn btn-secondary" style={{ padding: '8px 18px' }}>
            Sign In
          </button>
          <button onClick={onGetStarted} className="btn btn-primary" style={{ padding: '8px 20px' }}>
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '100px 24px 80px',
          textAlign: 'center',
          background: 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 60%)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}
        >
          <Zap size={16} />
          <span>Next-Generation Project Management System</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '24px',
            color: '#fff'
          }}
        >
          Streamline Projects & Tasks <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            With Real-Time Analytics
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}
        >
          ProjectFlow enables teams and individuals to organize projects, prioritize tasks, track live progress meters, and maintain complete workspace authorization control.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={onGetStarted}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '12px' }}
          >
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onLogin}
            className="btn btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}
          >
            Sign In to Account
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 24px 100px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Built for Peak Productivity
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Everything you need to plan, track, and complete your projects on time.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px'
          }}
        >
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                marginBottom: '20px'
              }}
            >
              <FolderKanban size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Project Management</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Create and manage project workspaces with start/end dates, description details, and status tracking (Not Started, In Progress, Completed).
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
                marginBottom: '20px'
              }}
            >
              <CheckCircle2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Task Workspace</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Assign tasks to projects with priority levels (Low, Medium, High), due dates, and quick status check toggles.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                marginBottom: '20px'
              }}
            >
              <BarChart3 size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Interactive Dashboard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              View aggregated stats: Total Projects, Active Projects, Total Tasks, Completed Tasks, and Pending Tasks in real-time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171',
                marginBottom: '20px'
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Enterprise Security</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              JWT authentication, bcrypt password hashing, SQL injection defense with parameterized queries, and rate limiting.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(30, 41, 59, 0.4)',
          padding: '40px 24px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
          POWERED BY MODERN WEB TECHNOLOGIES
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', fontSize: '1.1rem', fontWeight: 700, color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers color="#61dafb" size={20} />
            <span>React</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap color="#68a063" size={20} />
            <span>Node.js / Express</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database color="#00758f" size={20} />
            <span>MySQL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock color="#818cf8" size={20} />
            <span>JWT & Bcrypt</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>
          Ready to boost your project productivity?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>
          Join ProjectFlow today and start organizing your work seamlessly.
        </p>
        <button onClick={onGetStarted} className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: '12px' }}>
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        © 2026 ProjectFlow - Full-Stack Project & Task Management System
      </footer>
    </div>
  );
};

export default LandingPage;
