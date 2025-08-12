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
            const comments = section.data?.comments?.[data.rating] || [];
            if (comments.length > 0) {
              const randomComment = comments[Math.floor(Math.random() * comments.length)];
              const processedComment = randomComment.replace(/\[Name\]/g, currentStudent.firstName);
              report += `${processedComment}\n`;
            }
            if (data.additionalComment?.trim()) {
              report += `${data.additionalComment.trim()}\n`;
            }
            report += '\n';
          }
          break;

        case 'standard-comment':
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentStudent) {
      setSectionData({});
      setHasUnsavedChanges(false);
    }
  }, [currentStudentIndex, currentStudent, template.id, classData.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    generateReport();
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
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#3b82f6',
              margin: '0 0 16px 0'
            }}>
              {section.data?.name || 'Rated Comment'}
            </h3>

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
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#10b981',
              margin: '0 0 16px 0'
            }}>
              {section.data?.name || 'Standard Comment'}
            </h3>

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
