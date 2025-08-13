import React, { useState, useMemo } from 'react';

// --- TYPE DEFINITIONS (TypeScript) ---
// Defines the structure for a single exam's details
type ExamDetails = {
  name: string;
  description: string;
  eligibility: string;
  pattern: string[];
};

// Defines the structure for a category of exams
type ExamCategory = {
  [examKey: string]: ExamDetails;
};

// Defines the overall structure for all exam data
type ExamData = {
  [categoryKey: string]: {
    displayName: string;
    exams: ExamCategory;
  };
};

// --- MOCK DATA ---
// A comprehensive dataset for various exams.
// This can be easily replaced with data from an API.
const examData: ExamData = {
  ssc: {
    displayName: 'SSC',
    exams: {
      cgl: { 
        name: 'SSC CGL (Combined Graduate Level)',
        description: 'A national-level exam to recruit candidates for Group B and C posts in various ministries and departments of the Government of India.',
        eligibility: 'Bachelor\'s Degree from a recognized university.',
        pattern: ['Tier 1: Computer Based Examination', 'Tier 2: Computer Based Examination', 'Tier 3: Pen and Paper Mode (Descriptive)', 'Tier 4: Computer Proficiency Test/Skill Test'],
      },
      chsl: { 
        name: 'SSC CHSL (Combined Higher Secondary Level)',
        description: 'Conducted to recruit candidates for various posts such as LDC, JSA, PA, SA, and DEO in different ministries and departments.',
        eligibility: 'Passed 12th Standard or equivalent examination.',
        pattern: ['Tier 1: Computer-Based Exam', 'Tier 2: Descriptive Paper', 'Tier 3: Typing Test/Skill Test'],
      },
      je: { 
        name: 'SSC JE (Junior Engineer)',
        description: 'Recruits Junior Engineers for various government departments and organizations.',
        eligibility: 'Diploma or Degree in Engineering in the relevant discipline.',
        pattern: ['Paper-I: Computer Based Examination (Objective)', 'Paper-II: Descriptive Type'],
      },
      gd: { 
        name: 'SSC GD Constable',
        description: 'Recruitment of constables (General Duty) in Border Security Force (BSF), Central Industrial Security Force (CISF), etc.',
        eligibility: 'Matriculation or 10th Class pass.',
        pattern: ['Computer Based Examination (CBE)', 'Physical Efficiency Test (PET)', 'Physical Standard Test (PST)', 'Detailed Medical Examination (DME)'],
      },
    },
  },
  bank: {
    displayName: 'Bank',
    exams: {
      sbi_po: {
        name: 'SBI PO (Probationary Officer)',
        description: 'A competitive examination to recruit Probationary Officers for the State Bank of India, known for its high standards and career growth.',
        eligibility: 'Graduation in any discipline from a recognised University.',
        pattern: ['Phase-I: Preliminary Examination (Objective)', 'Phase-II: Main Examination (Objective & Descriptive)', 'Phase-III: Psychometric Test, Group Exercise & Interview'],
      },
      ibps_po: { 
        name: 'IBPS PO (Probationary Officer)',
        description: 'A common written exam for the recruitment of Probationary Officers in multiple public sector banks.',
        eligibility: 'A degree (Graduation) in any discipline from a University recognised by the Govt. Of India.',
        pattern: ['Prelims: Objective Test', 'Mains: Objective & Descriptive Test', 'Interview'],
      },
      sbi_clerk: { 
        name: 'SBI Clerk (Junior Associate)',
        description: 'Recruits candidates for the clerical cadre in the State Bank of India.',
        eligibility: 'Graduation in any discipline from a recognised University.',
        pattern: ['Preliminary Examination', 'Main Examination', 'Test of specified opted local language'],
      },
      ibps_clerk: { 
        name: 'IBPS Clerk',
        description: 'A common recruitment process for clerical positions in various public sector banks across India.',
        eligibility: 'A degree (Graduation) in any discipline.',
        pattern: ['Preliminary Examination', 'Main Examination'],
      },
    },
  },
  class10: {
    displayName: 'Class 10',
    exams: {
      cbse: { 
        name: 'CBSE Board Exam',
        description: 'Central Board of Secondary Education annual examination for 10th-grade students.',
        eligibility: 'Students who have passed the 9th-grade examination from a CBSE affiliated school.',
        pattern: ['Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English', 'Second Language'],
      },
      icse: { 
        name: 'ICSE Board Exam',
        description: 'Indian Certificate of Secondary Education examination, known for its comprehensive syllabus.',
        eligibility: 'Completion of 10 years of formal education.',
        pattern: ['Group I (Compulsory): English, History, Civics & Geography, Second Language', 'Group II (Any 2): Science, Maths, Economics', 'Group III (Any 1): Computer Applications, Art'],
      },
    },
  },
  railways: {
    displayName: 'Railways',
    exams: {
      rrb_ntpc: { 
        name: 'RRB NTPC',
        description: 'Recruitment for various non-technical posts in the Indian Railways.',
        eligibility: 'Varies from 12th pass to Graduate depending on the post.',
        pattern: ['1st Stage CBT', '2nd Stage CBT', 'Typing Skill Test/Computer Based Aptitude Test', 'Document Verification'],
      },
      rrb_group_d: { 
        name: 'RRB Group D',
        description: 'Recruitment for Level 1 posts in the Indian Railways.',
        eligibility: '10th Pass (or ITI from institutions recognised by NCVT/SCVT).',
        pattern: ['Computer Based Test (CBT)', 'Physical Efficiency Test (PET)', 'Document Verification'],
      },
    },
  },
};

// --- STYLING ---
const theme = {
  background: "#111827",
  cardBackground: "#1F2937",
  inputBackground: "#374151",
  primaryText: "#FFFFFF",
  secondaryText: "#9CA3AF",
  mutedText: "#6B7280",
  accent: "#60A5FA",
  divider: "#4B5563",
};

interface ExamConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamConfigurationModal({ isOpen, onClose }: ExamConfigurationModalProps) {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(Object.keys(examData)[0]);
  const [selectedExamKey, setSelectedExamKey] = useState<string>(
    Object.keys(examData[Object.keys(examData)[0]].exams)[0]
  );

  const { categories, currentExams, selectedExamDetails } = useMemo(() => {
    const categories = Object.keys(examData).map(key => ({
      key: key,
      displayName: examData[key].displayName,
    }));
    const currentExams = Object.keys(examData[selectedCategoryKey].exams).map(key => ({
        key: key,
        name: examData[selectedCategoryKey].exams[key].name,
    }));
    const selectedExamDetails = examData[selectedCategoryKey].exams[selectedExamKey];
    return { categories, currentExams, selectedExamDetails };
  }, [selectedCategoryKey, selectedExamKey]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryKey = e.target.value;
    setSelectedCategoryKey(newCategoryKey);
    const firstExamInNewCategory = Object.keys(examData[newCategoryKey].exams)[0];
    setSelectedExamKey(firstExamInNewCategory);
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamKey(e.target.value);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: theme.background,
      color: theme.primaryText,
      maxWidth: '900px',
      width: '90%',
      maxHeight: '90vh',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      backgroundColor: theme.cardBackground,
      padding: '1.5rem 2rem',
      borderBottom: `1px solid ${theme.divider}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: theme.primaryText,
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: theme.secondaryText,
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '4px',
      transition: 'color 0.2s',
    },
    content: {
      padding: '2rem',
      maxHeight: 'calc(90vh - 120px)',
      overflowY: 'auto',
    },
    controlsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginBottom: '2.5rem',
      backgroundColor: theme.cardBackground,
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    controlGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '0.9rem',
        color: theme.secondaryText,
        marginBottom: '0.5rem',
    },
    select: {
      padding: '0.75rem',
      backgroundColor: theme.inputBackground,
      color: theme.primaryText,
      border: `1px solid ${theme.divider}`,
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      width: '100%',
    },
    detailsCard: {
      backgroundColor: theme.cardBackground,
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    detailTitle: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: theme.accent,
      marginBottom: '1.5rem',
      borderBottom: `2px solid ${theme.divider}`,
      paddingBottom: '1rem',
    },
    detailSection: {
        marginBottom: '1.5rem',
    },
    detailHeading: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: theme.secondaryText,
        marginBottom: '0.5rem',
    },
    detailText: {
        fontSize: '1rem',
        color: theme.primaryText,
        lineHeight: '1.6',
    },
    detailList: {
        listStylePosition: 'inside',
        paddingLeft: '0.5rem',
    },
    detailListItem: {
        marginBottom: '0.5rem',
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Exam Configuration</h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => (e.currentTarget.style.color = theme.primaryText)}
            onMouseOut={(e) => (e.currentTarget.style.color = theme.secondaryText)}
          >
            ×
          </button>
        </div>
        
        <div style={styles.content}>
          <div style={{...styles.controlsContainer, ...{flexDirection: window.innerWidth < 600 ? 'column' : 'row'}}}>
            <div style={{...styles.controlGroup, flex: 1}}>
              <label htmlFor="category-select" style={styles.label}>Exam Category</label>
              <select id="category-select" value={selectedCategoryKey} onChange={handleCategoryChange} style={styles.select}>
                {categories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div style={{...styles.controlGroup, flex: 1}}>
              <label htmlFor="exam-select" style={styles.label}>Specific Exam</label>
              <select id="exam-select" value={selectedExamKey} onChange={handleExamChange} style={styles.select}>
                {currentExams.map(exam => (
                  <option key={exam.key} value={exam.key}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedExamDetails && (
            <div style={styles.detailsCard}>
              <h3 style={styles.detailTitle}>{selectedExamDetails.name}</h3>
              
              <div style={styles.detailSection}>
                  <h4 style={styles.detailHeading}>Description</h4>
                  <p style={styles.detailText}>{selectedExamDetails.description}</p>
              </div>

              <div style={styles.detailSection}>
                  <h4 style={styles.detailHeading}>Eligibility</h4>
                  <p style={styles.detailText}>{selectedExamDetails.eligibility}</p>
              </div>

              <div style={styles.detailSection}>
                  <h4 style={styles.detailHeading}>Exam Pattern</h4>
                  <ul style={{...styles.detailText, ...styles.detailList}}>
                      {selectedExamDetails.pattern.map((step, index) => (
                          <li key={index} style={styles.detailListItem}>{step}</li>
                      ))}
                  </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
