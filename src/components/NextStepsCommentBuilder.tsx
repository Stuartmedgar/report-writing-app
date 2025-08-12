import React, { useState } from 'react';
import { NextStepsComment } from '../types';

interface NextStepsCommentBuilderProps {
  onSave: (comment: NextStepsComment) => void;
  onCancel: () => void;
  existingComment?: NextStepsComment;
}

function NextStepsCommentBuilder({ onSave, onCancel, existingComment }: NextStepsCommentBuilderProps) {
  const [commentName, setCommentName] = useState(existingComment?.name || '');
  const [headings, setHeadings] = useState<string[]>(existingComment?.headings || ['Focus Areas']);
  const [comments, setComments] = useState<{ [heading: string]: string[] }>(
    existingComment?.comments || { 'Focus Areas': [''] }
  );
  const [showBatchInput, setShowBatchInput] = useState<string | null>(null);
  const [batchText, setBatchText] = useState('');
  const [separator, setSeparator] = useState('double-line');

  const handleBatchPaste = (heading: string) => {
    if (batchText.trim()) {
      let newComments: string[] = [];
      
      // Split based on selected separator
      switch (separator) {
        case 'double-line':
          newComments = batchText.split('\n\n');
          break;
        case 'single-line':
          newComments = batchText.split('\n');
          break;
        case 'semicolon':
          newComments = batchText.split(';');
          break;
        case 'pipe':
          newComments = batchText.split('|');
          break;
        case 'triple-dash':
          newComments = batchText.split('---');
          break;
      }

      // Clean up comments - trim whitespace and filter out empty ones
      newComments = newComments
        .map(comment => comment.trim())
        .filter(comment => comment.length > 0);

      if (newComments.length > 0) {
        // Replace existing comments with new ones, or add to existing
        const shouldReplace = window.confirm(
          `This will add ${newComments.length} new comments. Do you want to replace existing comments (OK) or add to them (Cancel)?`
        );

        setComments(prev => ({
          ...prev,
          [heading]: shouldReplace ? newComments : [...(prev[heading] || []).filter(c => c.trim()), ...newComments]
        }));
      }
    }
    setShowBatchInput(null);
    setBatchText('');
  };

  const addHeading = () => {
    const newHeading = `Focus Area ${headings.length + 1}`;
    setHeadings([...headings, newHeading]);
    setComments(prev => ({ ...prev, [newHeading]: [''] }));
  };

  const removeHeading = (index: number) => {
    const headingToRemove = headings[index];
    const newHeadings = headings.filter((_, i) => i !== index);
    const newComments = { ...comments };
    delete newComments[headingToRemove];
    setHeadings(newHeadings);
    setComments(newComments);
  };

  const updateHeading = (index: number, value: string) => {
    const oldHeading = headings[index];
    const newHeadings = [...headings];
    newHeadings[index] = value;
    
    const newComments = { ...comments };
    if (oldHeading !== value) {
      newComments[value] = comments[oldHeading] || [''];
      delete newComments[oldHeading];
    }
    
    setHeadings(newHeadings);
    setComments(newComments);
  };

  const addCommentOption = (heading: string) => {
    setComments(prev => ({
      ...prev,
      [heading]: [...(prev[heading] || []), '']
    }));
  };

  const removeCommentOption = (heading: string, index: number) => {
    if ((comments[heading] || []).length > 1) {
      setComments(prev => ({
        ...prev,
        [heading]: prev[heading].filter((_, i) => i !== index)
      }));
    }
  };

  const updateCommentOption = (heading: string, index: number, value: string) => {
    setComments(prev => ({
      ...prev,
      [heading]: prev[heading].map((comment, i) => i === index ? value : comment)
    }));
  };

  const handleSave = () => {
    if (!commentName.trim()) {
      alert('Please enter a name for this next steps comment');
      return;
    }

    // Check they all have at least one comment
    const hasEmptyHeadings = headings.some(heading => 
      !comments[heading] || comments[heading].every(comment => !comment.trim())
    );

    if (hasEmptyHeadings) {
      alert('Please add at least one next step for each focus area, or remove empty focus areas');
      return;
    }

    const nextStepsComment: NextStepsComment = {
      name: commentName.trim(),
      headings: headings.filter(h => h.trim()),
      comments: Object.fromEntries(
        Object.entries(comments).map(([heading, commentList]) => [
          heading,
          commentList.filter(c => c.trim())
        ]).filter(([_, commentList]) => commentList.length > 0)
      )
    };

    onSave(nextStepsComment);
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
          {existingComment ? 'Edit' : 'Create'} Next Steps Comment
        </h1>
      </header>

      <main style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '32px 24px' 
      }}>
        
        <button 
          onClick={onCancel}
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
          ← Back
        </button>

        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          
          {/* Comment Name */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '8px'
            }}>
              Next Steps Comment Name
            </label>
            <input
              type="text"
              placeholder="e.g. Study Skills, Practice Areas, Development Goals..."
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Focus Areas Management */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  Focus Areas
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  margin: 0
                }}>
                  Add focus areas like "Study Skills", "Practice Areas", "Development Goals" for teachers to choose from
                </p>
              </div>
              <button
                onClick={addHeading}
                style={{
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                + Add Focus Area
              </button>
            </div>

            {headings.map((heading, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => updateHeading(index, e.target.value)}
                  placeholder="Enter focus area name..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {headings.length > 1 && (
                  <button
                    onClick={() => removeHeading(index)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e40af',
              margin: '0 0 8px 0'
            }}>
              How to use placeholders:
            </h3>
            <p style={{ 
              color: '#1e40af', 
              fontSize: '14px',
              margin: 0
            }}>
              • Use [Name] to insert the student's name in your next steps suggestions
            </p>
          </div>

          {/* Comment Sections */}
          {headings.map((heading) => (
            <div key={heading} style={{
              border: `2px solid #06b6d4`,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#06b6d4',
                  margin: 0
                }}>
                  {heading}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowBatchInput(heading)}
                    style={{
                      backgroundColor: 'white',
                      color: '#06b6d4',
                      border: `2px solid #06b6d4`,
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Paste Multiple
                  </button>
                  <button
                    onClick={() => addCommentOption(heading)}
                    style={{
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Next Step
                  </button>
                </div>
              </div>

              {/* Batch Input Modal */}
              {showBatchInput === heading && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#1e40af',
                    margin: '0 0 8px 0'
                  }}>
                    Paste Multiple Next Steps for {heading}
                  </h4>
                  
                  {/* Separator Selection */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block',
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#1e40af',
                      marginBottom: '8px'
                    }}>
                      How are your next steps separated?
                    </label>
                    <select
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        border: '2px solid #bfdbfe',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        color: '#1e40af',
                        fontWeight: '500'
                      }}
                    >
                      <option value="double-line">Double line break (press Enter twice)</option>
                      <option value="single-line">Single line break (one per line)</option>
                      <option value="semicolon">Semicolon (;)</option>
                      <option value="pipe">Pipe symbol (|)</option>
                      <option value="triple-dash">Triple dash (---)</option>
                    </select>
                  </div>

                  <textarea
                    placeholder={
                      separator === 'double-line' ? 
                        `[Name] should focus on improving their study organization skills by creating a weekly study planner.\n\n[Name] would benefit from practicing past exam questions to build confidence.\n\n[Name] should work on time management by breaking larger tasks into smaller steps.` :
                      separator === 'single-line' ?
                        `[Name] should focus on improving study organization skills\n[Name] would benefit from practicing past exam questions\n[Name] should work on time management techniques` :
                      separator === 'semicolon' ?
                        `[Name] should focus on improving study organization skills; [Name] would benefit from practicing past exam questions; [Name] should work on time management techniques` :
                      separator === 'pipe' ?
                        `[Name] should focus on improving study organization skills | [Name] would benefit from practicing past exam questions | [Name] should work on time management techniques` :
                        `[Name] should focus on improving study organization skills --- [Name] would benefit from practicing past exam questions --- [Name] should work on time management techniques`
                    }
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    style={{
                      width: '100%',
                      height: '200px',
                      padding: '12px',
                      border: '2px solid #bfdbfe',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      marginBottom: '12px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setShowBatchInput(null);
                        setBatchText('');
                      }}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleBatchPaste(heading)}
                      disabled={!batchText.trim()}
                      style={{
                        backgroundColor: batchText.trim() ? '#3b82f6' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: batchText.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Add Next Steps
                    </button>
                  </div>
                </div>
              )}

              <div>
                {(comments[heading] || ['']).map((comment, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <textarea
                      placeholder={`Enter next step suggestion ${index + 1}... Use [Name] for student name.`}
                      value={comment}
                      onChange={(e) => updateCommentOption(heading, index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                    {(comments[heading] || []).length > 1 && (
                      <button
                        onClick={() => removeCommentOption(heading, index)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          height: 'fit-content'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Save Button */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'flex-end' 
          }}>
            <button
              onClick={onCancel}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#06b6d4',
                color: 'white',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Save Next Steps Comment
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default NextStepsCommentBuilder;