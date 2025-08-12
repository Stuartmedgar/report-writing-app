import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Template, Class, Report, RatedComment, StandardComment, AssessmentComment, PersonalisedComment, NextStepsComment } from '../types';

interface DataState {
  templates: Template[];
  classes: Class[];
  reports: Report[];
  savedRatedComments: RatedComment[];
  savedStandardComments: StandardComment[];
  savedAssessmentComments: AssessmentComment[];
  savedPersonalisedComments: PersonalisedComment[];
  savedNextStepsComments: NextStepsComment[];
}

type DataAction = 
  | { type: 'ADD_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_TEMPLATE'; payload: Template }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_REPORT'; payload: Report }
  | { type: 'DELETE_REPORT'; payload: string }
  | { type: 'ADD_RATED_COMMENT'; payload: RatedComment }
  | { type: 'UPDATE_RATED_COMMENT'; payload: RatedComment }
  | { type: 'DELETE_RATED_COMMENT'; payload: string }
  | { type: 'ADD_STANDARD_COMMENT'; payload: StandardComment }
  | { type: 'UPDATE_STANDARD_COMMENT'; payload: StandardComment }
  | { type: 'DELETE_STANDARD_COMMENT'; payload: string }
  | { type: 'ADD_ASSESSMENT_COMMENT'; payload: AssessmentComment }
  | { type: 'UPDATE_ASSESSMENT_COMMENT'; payload: AssessmentComment }
  | { type: 'DELETE_ASSESSMENT_COMMENT'; payload: string }
  | { type: 'ADD_PERSONALISED_COMMENT'; payload: PersonalisedComment }
  | { type: 'UPDATE_PERSONALISED_COMMENT'; payload: PersonalisedComment }
  | { type: 'DELETE_PERSONALISED_COMMENT'; payload: string }
  | { type: 'ADD_NEXT_STEPS_COMMENT'; payload: NextStepsComment }
  | { type: 'UPDATE_NEXT_STEPS_COMMENT'; payload: NextStepsComment }
  | { type: 'DELETE_NEXT_STEPS_COMMENT'; payload: string }
  | { type: 'LOAD_DATA'; payload: DataState };

const initialState: DataState = {
  templates: [],
  classes: [],
  reports: [],
  savedRatedComments: [],
  savedStandardComments: [],
  savedAssessmentComments: [],
  savedPersonalisedComments: [],
  savedNextStepsComments: []
};

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(t => t.id !== action.payload)
      };
    
    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, action.payload] };
    
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(c => c.id !== action.payload),
        // Also delete all reports for this class
        reports: state.reports.filter(r => r.classId !== action.payload)
      };
    
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
    
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      };
    
    case 'DELETE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(r => r.id !== action.payload)
      };
    
    case 'ADD_RATED_COMMENT':
      return { ...state, savedRatedComments: [...state.savedRatedComments, action.payload] };
    
    case 'UPDATE_RATED_COMMENT':
      return {
        ...state,
        savedRatedComments: state.savedRatedComments.map(rc => 
          rc.name === action.payload.name ? action.payload : rc
        )
      };
    
    case 'DELETE_RATED_COMMENT':
      return {
        ...state,
        savedRatedComments: state.savedRatedComments.filter(rc => rc.name !== action.payload)
      };
    
    case 'ADD_STANDARD_COMMENT':
      return { ...state, savedStandardComments: [...state.savedStandardComments, action.payload] };
    
    case 'UPDATE_STANDARD_COMMENT':
      return {
        ...state,
        savedStandardComments: state.savedStandardComments.map(sc => 
          sc.name === action.payload.name ? action.payload : sc
        )
      };
    
    case 'DELETE_STANDARD_COMMENT':
      return {
        ...state,
        savedStandardComments: state.savedStandardComments.filter(sc => sc.name !== action.payload)
      };
    
    case 'ADD_ASSESSMENT_COMMENT':
      return { ...state, savedAssessmentComments: [...state.savedAssessmentComments, action.payload] };
    
    case 'UPDATE_ASSESSMENT_COMMENT':
      return {
        ...state,
        savedAssessmentComments: state.savedAssessmentComments.map(ac => 
          ac.name === action.payload.name ? action.payload : ac
        )
      };
    
    case 'DELETE_ASSESSMENT_COMMENT':
      return {
        ...state,
        savedAssessmentComments: state.savedAssessmentComments.filter(ac => ac.name !== action.payload)
      };
    
    case 'ADD_PERSONALISED_COMMENT':
      return { ...state, savedPersonalisedComments: [...state.savedPersonalisedComments, action.payload] };
    
    case 'UPDATE_PERSONALISED_COMMENT':
      return {
        ...state,
        savedPersonalisedComments: state.savedPersonalisedComments.map(pc => 
          pc.name === action.payload.name ? action.payload : pc
        )
      };
    
    case 'DELETE_PERSONALISED_COMMENT':
      return {
        ...state,
        savedPersonalisedComments: state.savedPersonalisedComments.filter(pc => pc.name !== action.payload)
      };
    
    case 'ADD_NEXT_STEPS_COMMENT':
      return { ...state, savedNextStepsComments: [...state.savedNextStepsComments, action.payload] };
    
    case 'UPDATE_NEXT_STEPS_COMMENT':
      return {
        ...state,
        savedNextStepsComments: state.savedNextStepsComments.map(nsc => 
          nsc.name === action.payload.name ? action.payload : nsc
        )
      };
    
    case 'DELETE_NEXT_STEPS_COMMENT':
      return {
        ...state,
        savedNextStepsComments: state.savedNextStepsComments.filter(nsc => nsc.name !== action.payload)
      };
    
    case 'LOAD_DATA':
      return action.payload;
    
    default:
      return state;
  }
}

interface DataContextType {
  state: DataState;
  addTemplate: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  addClass: (classData: Omit<Class, 'id' | 'createdAt'>) => void;
  updateClass: (classData: Class) => void;
  deleteClass: (id: string) => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  addRatedComment: (ratedComment: RatedComment) => void;
  updateRatedComment: (ratedComment: RatedComment) => void;
  deleteRatedComment: (name: string) => void;
  addStandardComment: (standardComment: StandardComment) => void;
  updateStandardComment: (standardComment: StandardComment) => void;
  deleteStandardComment: (name: string) => void;
  addAssessmentComment: (assessmentComment: AssessmentComment) => void;
  updateAssessmentComment: (assessmentComment: AssessmentComment) => void;
  deleteAssessmentComment: (name: string) => void;
  addPersonalisedComment: (personalisedComment: PersonalisedComment) => void;
  updatePersonalisedComment: (personalisedComment: PersonalisedComment) => void;
  deletePersonalisedComment: (name: string) => void;
  addNextStepsComment: (nextStepsComment: NextStepsComment) => void;
  updateNextStepsComment: (nextStepsComment: NextStepsComment) => void;
  deleteNextStepsComment: (name: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data from localStorage on startup
  useEffect(() => {
    const savedData = localStorage.getItem('reportGeneratorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Add missing fields if they don't exist (for existing users)
        if (!parsedData.savedNextStepsComments) {
          parsedData.savedNextStepsComments = [];
        }
        if (!parsedData.classes) {
          parsedData.classes = [];
        }
        if (!parsedData.reports) {
          parsedData.reports = [];
        }
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('reportGeneratorData', JSON.stringify(state));
  }, [state]);

  const addTemplate = (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    const template: Template = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const updateTemplate = (template: Template) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: template });
  };

  const deleteTemplate = (id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  };

  const addClass = (classData: Omit<Class, 'id' | 'createdAt'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_CLASS', payload: newClass });
  };

  const updateClass = (classData: Class) => {
    dispatch({ type: 'UPDATE_CLASS', payload: classData });
  };

  const deleteClass = (id: string) => {
    dispatch({ type: 'DELETE_CLASS', payload: id });
  };

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    const report: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_REPORT', payload: report });
  };

  const updateReport = (report: Report) => {
    const updatedReport = {
      ...report,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_REPORT', payload: updatedReport });
  };

  const deleteReport = (id: string) => {
    dispatch({ type: 'DELETE_REPORT', payload: id });
  };

  const addRatedComment = (ratedComment: RatedComment) => {
    dispatch({ type: 'ADD_RATED_COMMENT', payload: ratedComment });
  };

  const updateRatedComment = (ratedComment: RatedComment) => {
    dispatch({ type: 'UPDATE_RATED_COMMENT', payload: ratedComment });
  };

  const deleteRatedComment = (name: string) => {
    dispatch({ type: 'DELETE_RATED_COMMENT', payload: name });
  };

  const addStandardComment = (standardComment: StandardComment) => {
    dispatch({ type: 'ADD_STANDARD_COMMENT', payload: standardComment });
  };

  const updateStandardComment = (standardComment: StandardComment) => {
    dispatch({ type: 'UPDATE_STANDARD_COMMENT', payload: standardComment });
  };

  const deleteStandardComment = (name: string) => {
    dispatch({ type: 'DELETE_STANDARD_COMMENT', payload: name });
  };

  const addAssessmentComment = (assessmentComment: AssessmentComment) => {
    dispatch({ type: 'ADD_ASSESSMENT_COMMENT', payload: assessmentComment });
  };

  const updateAssessmentComment = (assessmentComment: AssessmentComment) => {
    dispatch({ type: 'UPDATE_ASSESSMENT_COMMENT', payload: assessmentComment });
  };

  const deleteAssessmentComment = (name: string) => {
    dispatch({ type: 'DELETE_ASSESSMENT_COMMENT', payload: name });
  };

  const addPersonalisedComment = (personalisedComment: PersonalisedComment) => {
    dispatch({ type: 'ADD_PERSONALISED_COMMENT', payload: personalisedComment });
  };

  const updatePersonalisedComment = (personalisedComment: PersonalisedComment) => {
    dispatch({ type: 'UPDATE_PERSONALISED_COMMENT', payload: personalisedComment });
  };

  const deletePersonalisedComment = (name: string) => {
    dispatch({ type: 'DELETE_PERSONALISED_COMMENT', payload: name });
  };

  const addNextStepsComment = (nextStepsComment: NextStepsComment) => {
    dispatch({ type: 'ADD_NEXT_STEPS_COMMENT', payload: nextStepsComment });
  };

  const updateNextStepsComment = (nextStepsComment: NextStepsComment) => {
    dispatch({ type: 'UPDATE_NEXT_STEPS_COMMENT', payload: nextStepsComment });
  };

  const deleteNextStepsComment = (name: string) => {
    dispatch({ type: 'DELETE_NEXT_STEPS_COMMENT', payload: name });
  };

  const value: DataContextType = {
    state,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addClass,
    updateClass,
    deleteClass,
    addReport,
    updateReport,
    deleteReport,
    addRatedComment,
    updateRatedComment,
    deleteRatedComment,
    addStandardComment,
    updateStandardComment,
    deleteStandardComment,
    addAssessmentComment,
    updateAssessmentComment,
    deleteAssessmentComment,
    addPersonalisedComment,
    updatePersonalisedComment,
    deletePersonalisedComment,
    addNextStepsComment,
    updateNextStepsComment,
    deleteNextStepsComment
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}