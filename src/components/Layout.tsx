import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings, LogOut, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { seedDatabase } from '../utils/seedData';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('This will clear existing data and generate new seed data. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      await seedDatabase();
      alert('Database seeded successfully! Refresh the page to see the data.');
      window.location.reload();
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Failed to seed database. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Risk Analysis Platform</div>
                  <div className="text-slate-400 text-xs">Transaction Surveillance</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                title="Seed database with sample data"
              >
                <Database className="w-4 h-4" />
                {seeding ? 'Seeding...' : 'Seed Data'}
              </button>

              <div className="text-right">
                <div className="text-sm font-medium text-white">{profile?.fullName}</div>
                <div className="text-xs text-slate-400 capitalize">{profile?.role}</div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
