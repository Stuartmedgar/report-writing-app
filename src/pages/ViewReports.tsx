import React from 'react';
import { Link } from 'react-router-dom';

function ViewReports() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
          View Reports
        </h1>
      </header>

      <main style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '32px 24px' 
      }}>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '24px'
          }}>
            ← Back to Home
          </button>
        </Link>

        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Completed Reports
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '24px' 
          }}>
            Review and export your completed student reports.
          </p>

          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>No reports available yet.</p>
            <p>Complete some reports to see them here!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewReports;