import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { PersonalisedComment } from '../types';
import PersonalisedCommentBuilder from './PersonalisedCommentBuilder';

interface PersonalisedCommentSelectorProps {
  onSelectComment: (comment: PersonalisedComment) => void;
  onBack: () => void;
}

function PersonalisedCommentSelector({ onSelectComment, onBack }: PersonalisedCommentSelectorProps) {
  const { state, addPersonalisedComment, deletePersonalisedComment } = useData();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingComment, setEditingComment] = useState<PersonalisedComment | undefined>();

  const handleCreateNew = () => {
    setEditingComment(undefined);
    setShowBuilder(true);
  };

  const handleEdit = (comment: PersonalisedComment) => {
    setEditingComment(comment);
    setShowBuilder(true);
  };

  const handleSaveComment = (comment: PersonalisedComment) => {
    // Check if comment name already exists
    const existingComment = state.savedPersonalisedComments.find(pc => pc.name === comment.name);
    
    if (existingComment && !editingComment) {
      const shouldReplace = window.confirm(
        `A personalised comment named "${comment.name}" already exists. Do you want to replace it?`
      );
      if (!shouldReplace) return;
    }

    addPersonalisedComment(comment);
    onSelectComment(comment);
    setShowBuilder(false);
  };

  const handleDeleteComment = (commentName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the personalised comment "${commentName}"? This action cannot be undone.`
    );
    if (confirmed) {
      deletePersonalisedComment(commentName);
    }
  };

  if (showBuilder) {
    return (
      <PersonalisedCommentBuilder
        onSave={handleSaveComment}
        onCancel={() => setShowBuilder(false)}
        existingComment={editingComment}
      />
    );
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
          Personalised Comments
        </h1>
        <p style={{ 
          color: '#6b7280', 
          margin: '8px 0 0 0',
          fontSize: '16px'
        }}>
          Create a new personalised comment or select from your saved comments
        </p>
      </header>

      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '32px 24px' 
      }}>
        
        <button 
          onClick={onBack}
          style={{
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
          ← Back to Add Section
        </button>

        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          
          {/* Create New Button */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={handleCreateNew}
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
              Create New Personalised Comment
            </button>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              margin: '8px 0 0 0',
              textAlign: 'center'
            }}>
              Build a new personalised comment from scratch
            </p>
          </div>

          {/* Saved Comments */}
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Or select a saved personalised comment ({state.savedPersonalisedComments.length})
          </h2>

          {state.savedPersonalisedComments.length === 0 ? (
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>No saved personalised comments yet.</p>
              <p style={{ margin: 0 }}>Create your first personalised comment to see it here!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.savedPersonalisedComments.map((comment) => (
                <div key={comment.name} style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#111827',
                        margin: '0 0 8px 0'
                      }}>
                        {comment.name}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        fontStyle: 'italic'
                      }}>
                        Instruction: "{comment.instruction}"
                      </p>
                      
                      {/* Show headings if they exist */}
                      {comment.headings && comment.headings.length > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          {comment.headings.map((heading, index) => (
                            <span key={index} style={{
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {heading}: {comment.comments[heading]?.length || 0} options
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Show total comment count */}
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        Total comment options: {Object.values(comment.comments).flat().length}
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
                      onClick={() => onSelectComment(comment)}
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
                      Add to Template
                    </button>
                    
                    <button
                      onClick={() => handleEdit(comment)}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteComment(comment.name)}
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

export default PersonalisedCommentSelector;