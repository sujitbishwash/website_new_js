import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { examGoalApi, ExamType } from '@/lib/api-client';
import styles from './ExamGoalPage.module.css';

const ExamGoalPage: React.FC = () => {
  const navigate = useNavigate();
  const [examType, setExamType] = useState<string>('');
  const [specificExam, setSpecificExam] = useState<string>('');
  const [specificExamOptions, setSpecificExamOptions] = useState<string[]>([]);
  const [examTypeOptions, setExamTypeOptions] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await examGoalApi.getExamTypes();
        if (response.data.success) {
          setExamTypeOptions(response.data.data);
        } else {
          setError('Failed to fetch exam types');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch exam types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamTypes();
  }, []);

  const handleExamTypeChange = (value: string) => {
    setExamType(value);
    setSpecificExam('');
    
    // Find the selected exam type and use its group data
    const selectedExamType = examTypeOptions.find(option => option.value === value);
    if (selectedExamType) {
      setSpecificExamOptions(selectedExamType.group);
    } else {
      setSpecificExamOptions([]);
    }
  };

  const handleContinue = async () => {
    try {
      setIsSubmitting(true);
      const response = await examGoalApi.addExamGoal(examType, specificExam);
      
      if (response.data.success) {
        console.log('Exam goal saved successfully');
        navigate('/link-input');
      } else {
        throw new Error(response.data.message || 'Failed to save exam preferences');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save exam preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading exam types...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className="flex items-center justify-center p-8">
            <div className="text-center text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Select Your Exam Goal</h1>
          <p className={styles.description}>
            Choose the exam you are preparing for to personalize your learning experience
          </p>
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="examType" className={styles.label}>Exam Type</Label>
          <Select value={examType} onValueChange={handleExamTypeChange}>
            <SelectTrigger className={styles.select}>
              <SelectValue placeholder="Select Exam Type" />
            </SelectTrigger>
            <SelectContent>
              {examTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="specificExam" className={styles.label}>Specific Exam / Board</Label>
          <Select 
            value={specificExam} 
            onValueChange={setSpecificExam}
            disabled={!examType}
          >
            <SelectTrigger className={styles.select}>
              <SelectValue placeholder="Select Specific Exam / Board" />
            </SelectTrigger>
            <SelectContent>
              {specificExamOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!examType || !specificExam || isSubmitting}
          className={styles.button}
        >
          {isSubmitting ? 'Saving...' : 'Continue to Dashboard'}
        </Button>

        <div className={styles.footer}>
          <p>&copy; 2024 AI Padhai. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ExamGoalPage;
