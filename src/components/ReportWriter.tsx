import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Template, Class, Student, TemplateSection } from '../types';

interface ReportWriterProps {
  template: Template;
  classData: Class;
  students: Student[];
  onBack: () => void;
}

interface SectionData {
  [sectionId: string]: {
    rating?: string;
    personalisedInfo?: string;
    additionalComment?: string;
    showOptional?: boolean;
    selectedHeading?: string;
    assessmentScore?: string;
    assessmentOutOf?: string;
    assessmentPercentage?: string;
  };
}

function ReportWriter({ template, classData, students, onBack }: ReportWriterProps) {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [sectionData, setSectionData] = useState<SectionData>({});
  const [generatedReport, setGeneratedReport] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { addReport, updateReport, state } = useData();

  const currentStudent = students[currentStudentIndex];

  const updateSectionData = (sectionId: string, data: Partial<SectionData[string]>) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], ...data }
    }));
    setHasUnsavedChanges(true);
  };

  const generateReport = () => {
    if (!currentStudent) return;

    let report = `${currentStudent.firstName} ${currentStudent.lastName}\n\n`;
    
    template.sections.forEach(section => {
      const data = sectionData[section.id] || {};
      
      switch (section.type) {
        case 'rated-comment':
          if (data.rating && data.rating !== 'no-comment') {
            // Add heading if configured
            if (section.data?.showHeading && section.data?.headingText) {
              report += `${section.data.headingText}\n`;
            }
            
            // Get random comment from selected rating
            const comments = section.data?.comments?.[data.rating] || [];
            if (comments.length > 0) {
              const randomComment = comments[Math.floor(Math.random() * comments.length)];
              const processedComment = randomComment.replace(/\[Name\]/g, currentStudent.firstName);
              report += `${processedComment}\n`;
            }
            
            // Add additional comment if provided
            if (data.additionalComment?.trim()) {
              report += `${data.additionalComment.trim()}\n`;
            }
            report += '\n';
          }
          break;

        case 'standard-comment':
          // Add heading if configured
          if (section.data?.showHeading && section.data?.headingText) {
            report += `${section.data.headingText}\n`;
          }
          
          // Use the standard comment (can be edited by teacher)
          if (data.additionalComment?.trim()) {
            report += `${data.additionalComment.trim()}\n\n`;
          } else if (section.data?.comment) {
            const processedComment = section.data.comment.replace(/\[Name\]/g, currentStudent.firstName);
            report += `${processedComment}\n\n`;
          }
          break;

        case 'optional-additional-comment':
          if (data.showOptional && data.additionalComment?.trim()) {
            report += `${data.additionalComment.trim()}\n\n`;
          }
          break;

        case 'new-line':
          report += '\n';
          break;
      }
    });

    setGeneratedReport(report.trim());
  };

  // Load existing report if it exists
  useEffect(() => {
    if (currentStudent) {
      const existingReport = state.reports.find(
        r => r.studentId === currentStudent.id && r.templateId === template.id && r.classId === classData.id
      );
      
      if (existingReport) {
        // TODO: Parse existing report data back into form
        // For now, start fresh each time
      }
      
      // Reset form for new student
      setSectionData({});
      setHasUnsavedChanges(false);
      generateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStudentIndex, currentStudent, template.id, classData.id, state.reports]);

  // Generate report preview whenever data changes
  useEffect(() => {
    generateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionData, currentStudent]);

  const handleSaveReport = () => {
    if (!currentStudent) return;

    const existingReport = state.reports.find(
      r => r.studentId === currentStudent.id && r.templateId === template.id && r.classId === classData.id
    );

    const reportData = {
      studentId: currentStudent.id,
      templateId: template.id,
      classId: classData.id,
      content: generatedReport
    };

    if (existingReport) {
      updateReport({ ...existingReport, ...reportData });
    } else {
      addReport(reportData);
    }

    setHasUnsavedChanges(false);
    alert(`Report saved for ${currentStudent.firstName} ${currentStudent.lastName}!`);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (hasUnsavedChanges) {
      const shouldContinue = window.confirm(
        'You have unsaved changes. Are you sure you want to continue? Changes will be lost.'
      );
      if (!shouldContinue) return;
    }

    if (direction === 'next' && currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentStudentIndex > 0) {
      setCurrentStudentIndex(prev => prev - 1);
    }
  };

  const renderSectionForm = (section: TemplateSection) => {
    const data = sectionData[section.id] || {};

    switch (section.type) {
      case 'rated-comment':
        return (
          <div key={section.id} style={{
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f8fafc'
          }}>
            {/* Heading Display */}
            {section.data?.showHeading && (
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#3b82f6',
                margin: '0 0 16px 0'
              }}>
                {section.data.headingText || section.data.name}
              </h3>
            )}

            {/* Rating Selection */}
            <div style={{ marginBottom: '16px' }}>
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
                gap: '12px' 
              }}>
                {['excellent', 'good', 'satisfactory', 'needsImprovement', 'no-comment'].map(rating => (
                  <label key={rating} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer'
                  }}>
                    <input 
                      type="radio"
                      name={`rating-${section.id}`}
                      value={rating}
                      checked={data.rating === rating}
                      onChange={(e) => updateSectionData(section.id, { rating: e.target.value })}
                      style={{ transform: 'scale(1.1)' }}
                    />
                    <span style={{ 
                      color: rating === 'excellent' ? '#10b981' :
                            rating === 'good' ? '#3b82f6' :
                            rating === 'satisfactory' ? '#f59e0b' :
                            rating === 'needsImprovement' ? '#ef4444' : '#6b7280',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      {rating === 'needsImprovement' ? 'Needs Improvement' :
                       rating === 'no-comment' ? 'No Comment' :
                       rating.charAt(0).toUpperCase() + rating.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Comment */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <input 
                  type="checkbox"
                  checked={!!data.additionalComment}
                  onChange={(e) => updateSectionData(section.id, { 
                    additionalComment: e.target.checked ? '' : undefined 
                  })}
                  style={{ transform: 'scale(1.1)' }}
                />
                <span>Add additional comment</span>
              </label>
              {data.additionalComment !== undefined && (
                <textarea
                  value={data.additionalComment}
                  onChange={(e) => updateSectionData(section.id, { additionalComment: e.target.value })}
                  placeholder="Enter additional comment..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              )}
            </div>
          </div>
        );

      case 'standard-comment':
        return (
          <div key={section.id} style={{
            border: '2px solid #10b981',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f0fdf4'
          }}>
            {/* Heading Display */}
            {section.data?.showHeading && (
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#10b981',
                margin: '0 0 16px 0'
              }}>
                {section.data.headingText || section.data.name}
              </h3>
            )}

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Standard comment (you can edit this for this student):
              </label>
              <textarea
                value={data.additionalComment || section.data?.comment || ''}
                onChange={(e) => updateSectionData(section.id, { additionalComment: e.target.value })}
                placeholder="Standard comment..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        );

      case 'optional-additional-comment':
        return (
          <div key={section.id} style={{
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#fef2f2'
          }}>
            {/* Optional Comment Checkbox */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ef4444',
                marginBottom: '12px'
              }}>
                <input 
                  type="checkbox"
                  checked={!!data.showOptional}
                  onChange={(e) => updateSectionData(section.id, { 
                    showOptional: e.target.checked,
                    additionalComment: e.target.checked ? (data.additionalComment || '') : undefined
                  })}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Optional Additional Comment</span>
              </label>
              
              {data.showOptional && (
                <textarea
                  value={data.additionalComment || ''}
                  onChange={(e) => updateSectionData(section.id, { additionalComment: e.target.value })}
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
                    boxSizing: 'border-box'
                  }}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentStudent) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p>No students available for report writing.</p>
        <button onClick={onBack} style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '20px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#111827',
              margin: '0 0 4px 0'
            }}>
              Writing Report: {currentStudent.firstName} {currentStudent.lastName}
            </h1>
            <p style={{ 
              color: '#6b7280', 
              margin: 0,
              fontSize: '14px'
            }}>
              {template.name} • {classData.name} • Student {currentStudentIndex + 1} of {students.length}
            </p>
          </div>
          
          {/* Navigation */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => handleNavigate('prev')}
              disabled={currentStudentIndex === 0}
              style={{
                backgroundColor: currentStudentIndex === 0 ? '#d1d5db' : '#6b7280',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentStudentIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Previous
            </button>
            
            <button
              onClick={handleSaveReport}
              style={{
                backgroundColor: hasUnsavedChanges ? '#10b981' : '#059669',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {hasUnsavedChanges ? 'Save Report' : 'Saved ✓'}
            </button>
            
            <button
              onClick={() => handleNavigate('next')}
              disabled={currentStudentIndex === students.length - 1}
              style={{
                backgroundColor: currentStudentIndex === students.length - 1 ? '#d1d5db' : '#6b7280',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentStudentIndex === students.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
            
            <button
              onClick={onBack}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        
        {/* Left Column - Form */}
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px'
          }}>
            Report Sections
          </h2>
          
          {/* Student Info Section */}
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 8px 0'
            }}>
              Student Information
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              First Name: {currentStudent.firstName}<br/>
              Surname: {currentStudent.lastName}
            </p>
          </div>

          {/* Dynamic Sections */}
          {template.sections.map(section => renderSectionForm(section))}
        </div>

        {/* Right Column - Preview */}
        <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Report Preview
          </h2>
          
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white',
            minHeight: '400px',
            fontFamily: 'serif',
            lineHeight: '1.6'
          }}>
            <pre style={{
              fontFamily: 'inherit',
              fontSize: '14px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {generatedReport || 'Report preview will appear here as you fill out the sections...'}
            </pre>
          </div>

          {/* Preview Actions */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => navigator.clipboard.writeText(generatedReport)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              📋 Copy Report
            </button>
            
            <button
              onClick={() => {
                const blob = new Blob([generatedReport], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${currentStudent.firstName}_${currentStudent.lastName}_Report.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              💾 Download
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportWriter;