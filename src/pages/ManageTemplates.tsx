import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

function ManageTemplates() {
  const { state, deleteTemplate } = useData();

  const handleDeleteTemplate = (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the template "${name}"? This action cannot be undone.`);
    if (confirmed) {
      deleteTemplate(id);
    }
  };

  const getSectionDisplayName = (type: string) => {
    const names: { [key: string]: string } = {
      'rated-comment': 'Rated Comment',
      'standard-comment': 'Standard Comment',
      'assessment-comment': 'Assessment Comment',
      'personalised-comment': 'Personalised Comment',
      'optional-additional-comment': 'Optional Additional Comment',
      'next-steps': 'Next Steps',
      'new-line': 'New Line'
    };
    return names[type] || type;
  };

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
          Manage Templates
        </h1>
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
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          
          {/* Import Template Button */}
          <div style={{ marginBottom: '32px' }}>
            <button style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Import Template
            </button>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              margin: '8px 0 0 0'
            }}>
              Import templates shared by colleagues or administrators
            </p>
          </div>

          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Your Templates ({state.templates.length})
          </h2>

          {/* Templates List */}
          {state.templates.length === 0 ? (
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>No templates created yet.</p>
              <p style={{ margin: '0 0 16px 0' }}>Create your first template to see it here!</p>
              <Link to="/create-template" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Create Template
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {state.templates.map((template) => (
                <div key={template.id} style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '16px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        color: '#111827',
                        margin: '0 0 8px 0'
                      }}>
                        {template.name}
                      </h3>
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '14px',
                        margin: 0
                      }}>
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Template Sections Preview */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '500', 
                      color: '#374151',
                      margin: '0 0 8px 0'
                    }}>
                      Sections ({template.sections.length}):
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '8px' 
                    }}>
                      {template.sections.map((section, index) => (
                        <span key={section.id} style={{
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {index + 1}. {getSectionDisplayName(section.type)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    flexWrap: 'wrap' 
                  }}>
                    <button style={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Share
                    </button>
                    
                    <button style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Edit
                    </button>
                    
                    <button style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Duplicate
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteTemplate(template.id, template.name)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
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

export default ManageTemplates;