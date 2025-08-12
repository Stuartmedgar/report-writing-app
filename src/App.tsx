import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import WriteReports from './pages/WriteReports';
import CreateTemplate from './pages/CreateTemplate';
import ManageTemplates from './pages/ManageTemplates';
import ClassManagement from './pages/ClassManagement';
import ViewReports from './pages/ViewReports';
import './index.css';

function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#111827',
          margin: 0
        }}>
          Report Generator
        </h1>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '32px 24px' 
      }}>
        
        {/* Write Reports */}
        <Link to="/write-reports" style={{ textDecoration: 'none' }}>
          <button className="report-button btn-blue">
            <div className="button-title">Write Reports</div>
            <div className="button-description">Create student reports</div>
          </button>
        </Link>

        {/* Create Report Template */}
        <Link to="/create-template" style={{ textDecoration: 'none' }}>
          <button className="report-button btn-green">
            <div className="button-title">Create Report Template</div>
            <div className="button-description">Design new report templates</div>
          </button>
        </Link>

        {/* Manage Templates */}
        <Link to="/manage-templates" style={{ textDecoration: 'none' }}>
          <button className="report-button btn-purple">
            <div className="button-title">Manage Templates</div>
            <div className="button-description">Edit, share and organize templates</div>
          </button>
        </Link>

        {/* Class Management */}
        <Link to="/class-management" style={{ textDecoration: 'none' }}>
          <button className="report-button btn-orange">
            <div className="button-title">Class Management</div>
            <div className="button-description">Manage students and classes</div>
          </button>
        </Link>

        {/* View Reports */}
        <Link to="/view-reports" style={{ textDecoration: 'none' }}>
          <button className="report-button btn-red">
            <div className="button-title">View Reports</div>
            <div className="button-description">Review and export completed reports</div>
          </button>
        </Link>

      </main>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write-reports" element={<WriteReports />} />
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/manage-templates" element={<ManageTemplates />} />
          <Route path="/class-management" element={<ClassManagement />} />
          <Route path="/view-reports" element={<ViewReports />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;