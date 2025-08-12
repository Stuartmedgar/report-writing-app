import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import CreateClass from '../components/CreateClass';
import ClassDetail from '../components/ClassDetail';

function ClassManagement() {
  const { state, deleteClass } = useData();
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const handleDeleteClass = (classId: string, className: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the class "${className}"? This will also delete all reports for this class. This action cannot be undone.`
    );
    if (confirmed) {
      deleteClass(classId);
    }
  };

  const handleCreateClassComplete = () => {
    setShowCreateClass(false);
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleBackFromClassDetail = () => {
    setSelectedClassId(null);
  };

  // Show Create Class page
  if (showCreateClass) {
    return (
      <CreateClass 
        onComplete={handleCreateClassComplete}
        onCancel={() => setShowCreateClass(false)}
      />
    );
  }

  // Show specific class detail page
  if (selectedClassId) {
    const selectedClass = state.classes.find(c => c.id === selectedClassId);
    if (selectedClass) {
      return (
        <ClassDetail 
          classData={selectedClass}
          onBack={handleBackFromClassDetail}
        />
      );
    }
  }

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
          Class Management
        </h1>
        <p style={{ 
          color: '#6b7280', 
          margin: '8px 0 0 0',
          fontSize: '16px'
        }}>
          Create and manage your student classes
        </p>
      </header>

      <main style={{ 
        maxWidth: '800px', 
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
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          
          {/* Create New Class Button */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={() => setShowCreateClass(true)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%'
              }}
            >
              Create New Class
            </button>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              margin: '8px 0 0 0',
              textAlign: 'center'
            }}>
              Add a new class and import your student list
            </p>
          </div>

          {/* Current Classes */}
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Your Classes ({state.classes.length})
          </h2>

          {state.classes.length === 0 ? (
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>No classes created yet.</p>
              <p style={{ margin: 0 }}>Create your first class to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.classes.map((classItem) => (
                <div key={classItem.id} style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#fafafa';
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div 
                      style={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => handleClassSelect(classItem.id)}
                    >
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#111827',
                        margin: '0 0 8px 0'
                      }}>
                        {classItem.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <span>{classItem.students.length} students</span>
                        <span>Created: {new Date(classItem.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    flexWrap: 'wrap' 
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassSelect(classItem.id);
                      }}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View Students ({classItem.students.length})
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Navigate to reports for this class
                        alert('View Reports functionality coming soon!');
                      }}
                      style={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View Reports
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(classItem.id, classItem.name);
                      }}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ClassManagement;