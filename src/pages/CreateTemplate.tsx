import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { TemplateSection } from '../types';
import SectionSelector from '../components/SectionSelector';

function CreateTemplate() {
  const [templateName, setTemplateName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [optionalCommentStates, setOptionalCommentStates] = useState<{[key: string]: boolean}>({});
  const { addTemplate } = useData();
  const navigate = useNavigate();

  const toggleOptionalComment = (sectionId: string) => {
    setOptionalCommentStates(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleCreateTemplate = () => {
    if (templateName.trim()) {
      setIsCreating(true);
    }
  };

  const handleAddSection = () => {
    setShowSectionSelector(true);
  };

  const handleSelectSection = (sectionType: string, data?: any) => {
    // Add the section to our template with default heading settings
    const newSection: TemplateSection = {
      id: Date.now().toString(),
      type: sectionType as any,
      data: {
        ...data,
        showHeading: data?.name ? true : false, // Default to true if there's a name
        headingText: data?.name || ''
      }
    };
    setSections([...sections, newSection]);
    setShowSectionSelector(false);
  };

  const updateSectionHeadingSettings = (sectionId: string, showHeading: boolean) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, data: { ...section.data, showHeading } }
        : section
    ));
  };

  const handleSaveTemplate = () => {
    // Save the template using our data context
    addTemplate({
      name: templateName,
      sections: sections
    });

    // Show success message and redirect
    alert(`Template "${templateName}" saved successfully!`);
    navigate('/manage-templates');
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

  const getSectionColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'rated-comment': '#3b82f6',
      'standard-comment': '#10b981',
      'assessment-comment': '#8b5cf6',
      'personalised-comment': '#f59e0b',
      'optional-additional-comment': '#ef4444',
      'next-steps': '#06b6d4',
      'new-line': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  if (showSectionSelector) {
    return (
      <SectionSelector 
        onSelectSection={handleSelectSection}
        onBack={() => setShowSectionSelector(false)}
      />
    );
  }

  if (isCreating) {
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
            Report Template Builder
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: '8px 0 0 0',
            fontSize: '16px'
          }}>
            {templateName}
          </p>
        </header>

        <main style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '32px 24px' 
        }}>
          
          <button 
            onClick={() => setIsCreating(false)}
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

          {/* Template Builder */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            
            {/* Must Have Section */}
            <div style={{
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              backgroundColor: '#f9fafb'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#111827',
                margin: '0 0 12px 0'
              }}>
                Student Information (Required)
              </h3>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                <div style={{ marginBottom: '8px' }}>✓ First Name: [Student First Name]</div>
                <div>✓ Surname: [Student Last Name]</div>
              </div>
            </div>

            {/* Added Sections */}
            {sections.map((section, index) => (
              <div key={section.id} style={{
                border: `2px solid ${getSectionColor(section.type)}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: 'white',
                position: 'relative'
              }}>
                {/* Section Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: getSectionColor(section.type),
                    margin: 0
                  }}>
                    {index + 1}. {getSectionDisplayName(section.type)}
                    {section.data?.name && (
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: '400',
                        color: '#6b7280',
                        marginLeft: '8px'
                      }}>
                        - {section.data.name}
                      </span>
                    )}
                  </h3>
                  <div>
                    <button style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}
                    onClick={() => removeSection(section.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                {/* Section Content - Show exactly what teacher will see */}
                {section.type === 'rated-comment' && section.data ? (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '16px'
                  }}>
                    
                    {/* Section Heading with Toggle - What teacher sees */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {section.data?.headingText || section.data?.name || 'Section Heading'}
                        </h4>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <input 
                            type="checkbox"
                            checked={section.data?.showHeading !== false}
                            onChange={(e) => updateSectionHeadingSettings(section.id, e.target.checked)}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                          />
                          <span>Show heading in report</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Rating Options - Horizontal layout with checkboxes */}
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Select rating:
                      </label>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '16px',
                        alignItems: 'center'
                      }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          <input 
                            type="radio" 
                            name={`rating-${section.id}`}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                            disabled
                          />
                          <span style={{ color: '#10b981', fontWeight: '500' }}>
                            Excellent
                          </span>
                        </label>
                        
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          <input 
                            type="radio" 
                            name={`rating-${section.id}`}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                            disabled
                          />
                          <span style={{ color: '#3b82f6', fontWeight: '500' }}>
                            Good
                          </span>
                        </label>
                        
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          <input 
                            type="radio" 
                            name={`rating-${section.id}`}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                            disabled
                          />
                          <span style={{ color: '#f59e0b', fontWeight: '500' }}>
                            Satisfactory
                          </span>
                        </label>
                        
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          <input 
                            type="radio" 
                            name={`rating-${section.id}`}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                            disabled
                          />
                          <span style={{ color: '#ef4444', fontWeight: '500' }}>
                            Needs Improvement
                          </span>
                        </label>
                        
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          <input 
                            type="radio" 
                            name={`rating-${section.id}`}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                            disabled
                          />
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>
                            No Comment
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Additional Comment Toggle */}
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        <input 
                          type="checkbox"
                          style={{ 
                            margin: 0,
                            transform: 'scale(1.1)'
                          }}
                          disabled
                        />
                        <span>Add additional comment</span>
                      </label>
                    </div>
                  </div>
                ) : section.type === 'personalised-comment' && section.data ? (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '16px'
                  }}>
                    
                    {/* Section Heading with Toggle - What teacher sees */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {section.data?.headingText || section.data?.name || 'Section Heading'}
                        </h4>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <input 
                            type="checkbox"
                            checked={section.data?.showHeading !== false}
                            onChange={(e) => updateSectionHeadingSettings(section.id, e.target.checked)}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                          />
                          <span>Show heading in report</span>
                        </label>
                      </div>
                    </div>

                    {/* Instruction and Input Field - What teacher sees */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        {section.data?.instruction || 'Enter personalised information:'}
                      </label>
                      <input
                        type="text"
                        placeholder="Teacher will enter custom information here..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: '#f9fafb',
                          boxSizing: 'border-box'
                        }}
                        disabled
                      />
                    </div>

                    {/* Heading Options (if any) - What teacher sees */}
                    {section.data?.headings && section.data.headings.length > 0 ? (
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Select option:
                        </label>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '16px',
                          alignItems: 'center'
                        }}>
                          {section.data.headings.map((heading: string, index: number) => (
                            <label key={index} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}>
                              <input 
                                type="radio" 
                                name={`personalised-${section.id}`}
                                style={{ 
                                  margin: 0,
                                  transform: 'scale(1.1)'
                                }}
                                disabled
                              />
                              <span style={{ color: '#f59e0b', fontWeight: '500' }}>
                                {heading}
                              </span>
                            </label>
                          ))}
                          
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}>
                            <input 
                              type="radio" 
                              name={`personalised-${section.id}`}
                              style={{ 
                                margin: 0,
                                transform: 'scale(1.1)'
                              }}
                              disabled
                            />
                            <span style={{ color: '#6b7280', fontWeight: '500' }}>
                              No Comment
                            </span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      // No headings - single option explanation
                      <div style={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '12px'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: 0,
                          fontStyle: 'italic'
                        }}>
                          No headings configured - random comment will be selected from available options
                        </p>
                      </div>
                    )}

                    {/* Additional Comment Toggle - What teacher sees */}
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        <input 
                          type="checkbox"
                          style={{ 
                            margin: 0,
                            transform: 'scale(1.1)'
                          }}
                          disabled
                        />
                        <span>Add additional comment</span>
                      </label>
                    </div>
                  </div>
                ) : section.type === 'next-steps' && section.data ? (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '16px'
                  }}>
                    
                    {/* Section Heading with Toggle - What teacher sees */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {section.data?.headingText || section.data?.name || 'Section Heading'}
                        </h4>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <input 
                            type="checkbox"
                            checked={section.data?.showHeading !== false}
                            onChange={(e) => updateSectionHeadingSettings(section.id, e.target.checked)}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.1)'
                            }}
                          />
                          <span>Show heading in report</span>
                        </label>
                      </div>
                    </div>

                    {/* Focus Area Options - What teacher sees */}
                    {section.data?.headings && section.data.headings.length > 0 && (
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Select focus area:
                        </label>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '16px',
                          alignItems: 'center'
                        }}>
                          {section.data.headings.map((heading: string, index: number) => (
                            <label key={index} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}>
                              <input 
                                type="radio" 
                                name={`next-steps-${section.id}`}
                                style={{ 
                                  margin: 0,
                                  transform: 'scale(1.1)'
                                }}
                                disabled
                              />
                              <span style={{ color: '#06b6d4', fontWeight: '500' }}>
                                {heading}
                              </span>
                            </label>
                          ))}
                          
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}>
                            <input 
                              type="radio" 
                              name={`next-steps-${section.id}`}
                              style={{ 
                                margin: 0,
                                transform: 'scale(1.1)'
                              }}
                              disabled
                            />
                            <span style={{ color: '#6b7280', fontWeight: '500' }}>
                              No Next Steps
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Additional Comment Toggle - What teacher sees */}
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        <input 
                          type="checkbox"
                          style={{ 
                            margin: 0,
                            transform: 'scale(1.1)'
                          }}
                          disabled
                        />
                        <span>Add additional next steps comment</span>
                      </label>
                    </div>
                  </div>
                ) : section.type === 'optional-additional-comment' ? (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '16px'
                  }}>
                    
                    {/* Section Heading with Interactive Checkbox - What teacher sees */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          <input 
                            type="checkbox"
                            checked={optionalCommentStates[section.id] || false}
                            onChange={() => toggleOptionalComment(section.id)}
                            style={{ 
                              margin: 0,
                              transform: 'scale(1.2)'
                            }}
                          />
                          <span>Optional Additional Comment</span>
                        </label>
                      </div>
                    </div>

                    {/* Text Area Container - Only shown when checkbox is checked */}
                    {optionalCommentStates[section.id] && (
                      <div 
                        style={{
                          backgroundColor: '#ffffff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '12px'
                        }}>
                        <textarea
                          placeholder="Enter any additional comments about this student..."
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            backgroundColor: '#ffffff',
                            boxSizing: 'border-box'
                          }}
                          disabled
                        />
                      </div>
                    )}
                  </div>
                ) : section.type === 'new-line' ? (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      This adds a line break for better formatting in the final report
                    </p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '16px'
                  }}>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '14px', 
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      {section.type === 'standard-comment' && 'Teachers will see the standard comment with editing options'}
                      {section.type === 'assessment-comment' && 'Teachers will enter assessment scores and select from performance-based comments'}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* No sections message */}
            {sections.length === 0 && (
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                color: '#9ca3af',
                marginBottom: '24px'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>No sections added yet.</p>
                <p style={{ margin: 0 }}>Click "Add Section" to start building your template!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleAddSection}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                + Add Section
              </button>

              <button 
                onClick={handleSaveTemplate}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                Save Template
              </button>
            </div>

          </div>
        </main>
      </div>
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
          Create Report Template
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
            Name Your Template
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '24px' 
          }}>
            Give your template a descriptive name (e.g. "S1 Reports PE", "Year 7 Math Reports")
          </p>

          <input
            type="text"
            placeholder="Enter template name..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '24px',
              boxSizing: 'border-box'
            }}
          />

          <button
            onClick={handleCreateTemplate}
            disabled={!templateName.trim()}
            style={{
              backgroundColor: templateName.trim() ? '#10b981' : '#d1d5db',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: templateName.trim() ? 'pointer' : 'not-allowed',
              width: '100%'
            }}
          >
            Create Template
          </button>
        </div>
      </main>
    </div>
  );
}

export default CreateTemplate;