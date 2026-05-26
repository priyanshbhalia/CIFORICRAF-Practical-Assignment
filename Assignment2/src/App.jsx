import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sprout, 
  Sun, 
  Moon, 
  Trees, 
  MapPin, 
  Activity,
  CalendarDays
} from 'lucide-react';
import { INITIAL_RECORDS } from './data/mockData';
import DataTable from './components/DataTable';
import MonitoringChart from './components/MonitoringChart';
import RecordForm from './components/RecordForm';

export default function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('agroforestry_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('agroforestry_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Keep records stored in localStorage
  useEffect(() => {
    localStorage.setItem('agroforestry_records', JSON.stringify(records));
  }, [records]);

  // Apply dark mode class to HTML body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('agroforestry_theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('agroforestry_theme', 'light');
    }
  }, [darkMode]);

  // Handle addition of new records
  const handleAddRecord = (newRecord) => {
    const nextId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
    setRecords(prev => [
      ...prev,
      { ...newRecord, id: nextId }
    ]);
  };

  // Compute stats metrics dynamically
  const stats = useMemo(() => {
    const totalTrees = records.reduce((acc, curr) => acc + curr.treesPlanted, 0);
    const uniqueDistricts = new Set(records.map(r => r.district)).size;
    const uniqueSpecies = new Set(records.map(r => r.species)).size;
    
    // Percentage of trees in 'Excellent' or 'Good' health
    const healthyTreesCount = records
      .filter(r => r.healthStatus === 'excellent' || r.healthStatus === 'good')
      .reduce((acc, curr) => acc + curr.treesPlanted, 0);

    const healthRate = totalTrees > 0 
      ? Math.round((healthyTreesCount / totalTrees) * 100) 
      : 0;

    return {
      totalTrees,
      uniqueDistricts,
      uniqueSpecies,
      healthRate
    };
  }, [records]);

  return (
    <div className="app-container">
      {/* Dashboard Top Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <Sprout size={32} strokeWidth={2.5} />
          </div>
          <div className="brand-title">
            <h1>GreenCanopy</h1>
            <p>Agroforestry Monitoring Dashboard</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            id="theme-toggle"
            className="btn-icon" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark/Light Mode"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Stats Cards Section */}
      <section className="stats-grid" aria-label="Key Performance Indicators">
        {/* Card 1: Total Trees */}
        <div className="stat-card" id="stat-total-trees">
          <div className="stat-icon-wrapper">
            <Trees size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalTrees.toLocaleString()}</span>
            <span className="stat-label">Total Trees Planted</span>
          </div>
        </div>

        {/* Card 2: Districts */}
        <div className="stat-card" id="stat-districts">
          <div className="stat-icon-wrapper" style={{ color: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.15)' }}>
            <MapPin size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.uniqueDistricts}</span>
            <span className="stat-label">Monitored Districts</span>
          </div>
        </div>

        {/* Card 3: Species Count */}
        <div className="stat-card" id="stat-species">
          <div className="stat-icon-wrapper" style={{ color: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
            <Sprout size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.uniqueSpecies}</span>
            <span className="stat-label">Tree Species Cultivated</span>
          </div>
        </div>

        {/* Card 4: Health Success Rate */}
        <div className="stat-card" id="stat-health">
          <div className="stat-icon-wrapper" style={{ color: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.15)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.healthRate}%</span>
            <span className="stat-label">Survival Health Index</span>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="dashboard-body">
        {/* Left Side: Chart and Table */}
        <div className="main-column">
          <MonitoringChart records={records} />
          <DataTable records={records} />
        </div>

        {/* Right Side: Form panel */}
        <aside className="sidebar-column">
          <RecordForm onAddRecord={handleAddRecord} />
        </aside>
      </main>

      {/* Footer information */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '1.5rem', 
        fontSize: '0.85rem', 
        color: 'var(--text-muted)', 
        borderTop: '1px solid var(--border-color)',
        marginTop: '1rem',
        fontWeight: 500
      }}>
        <p>&copy; {new Date().getFullYear()} GreenCanopy Agroforestry Initiative. All rights reserved.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>CIFOR-ICRAF Practical Assignment 2</p>
      </footer>
    </div>
  );
}
