import React from 'react';
import { TemplateSection } from '../../types';
import RatedCommentSection from './RatedCommentSection';
import StandardCommentSection from './StandardCommentSection';
import OptionalAdditionalCommentSection from './OptionalAdditionalCommentSection';

interface SectionRendererProps {
  section: TemplateSection;
  sectionData: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

function SectionRenderer({ section, sectionData, updateSectionData }: SectionRendererProps) {
  const data = sectionData[section.id] || {};

  switch (section.type) {
    case 'rated-comment':
      return (
        <RatedCommentSection 
          section={section}
          data={data}
          updateSectionData={updateSectionData}
        />
      );

    case 'standard-comment':
      return (
        <StandardCommentSection 
          section={section}
          data={data}
          updateSectionData={updateSectionData}
        />
      );

    case 'optional-additional-comment':
      return (
        <OptionalAdditionalCommentSection 
          section={section}
          data={data}
          updateSectionData={updateSectionData}
        />
      );

    default:
      return null;
  }
}

export default SectionRenderer;