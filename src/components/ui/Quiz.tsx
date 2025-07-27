import React, { useState, useEffect } from 'react';
import styles from './Quiz.module.css';

interface QuizProps {
  videoId: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const Quiz: React.FC<QuizProps> = ({ videoId }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionType, setQuestionType] = useState<'multiple-choice' | 'true-false'>('multiple-choice');

  // Sample questions - In a real app, these would come from an API
  const sampleQuestions: Question[] = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: "Blue Whale"
    }
  ];

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateQuestion = async () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setFeedback('');

    try {
      // In a real app, this would be an API call using the videoId
      // const response = await fetch(`/api/quiz/${videoId}`);
      // const data = await response.json();
      // setCurrentQuestion(data);

      // For now, we'll use sample questions
      const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setCurrentQuestion({
        ...randomQuestion,
        options: shuffleArray(randomQuestion.options)
      });
    } catch (error) {
      console.error('Error generating question:', error);
      setFeedback('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelection = (answer: string) => {
    if (!currentQuestion) return;

    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setFeedback('Correct! Well done!');
    } else {
      setFeedback(`Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [videoId]);

  return (
    <div className={styles.quizAppContainer}>
      <div className={styles.quizAppHeader}>
        <h1>Quiz</h1>
      </div>

      <div className={styles.quizComponentContainer}>
        <div className={styles.quizSetupArea}>
          <h2 className={styles.quizTitle}>Test Your Knowledge</h2>
          <div className={styles.questionTypeSelector}>
            <button
              className={`${styles.questionTypeBtn} ${questionType === 'multiple-choice' ? styles.selected : ''}`}
              onClick={() => setQuestionType('multiple-choice')}
            >
              Multiple Choice
            </button>
            <button
              className={`${styles.questionTypeBtn} ${questionType === 'true-false' ? styles.selected : ''}`}
              onClick={() => setQuestionType('true-false')}
            >
              True/False
            </button>
          </div>
          <button
            className={styles.quizGenerateBtn}
            onClick={generateQuestion}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate New Question'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L20 12L12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {currentQuestion && (
          <div className={styles.quizActiveArea}>
            <div className={styles.questionDisplayContainer}>
              <p className={styles.questionText}>{currentQuestion.question}</p>
            </div>

            <div className={styles.answerOptionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`${styles.answerOptionBtn} ${
                    selectedAnswer === option ? styles.selected : ''
                  } ${
                    selectedAnswer && option === currentQuestion.correctAnswer ? styles.correct : ''
                  } ${
                    selectedAnswer === option && option !== currentQuestion.correctAnswer ? styles.incorrect : ''
                  }`}
                  onClick={() => handleAnswerSelection(option)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && (
              <p className={`${styles.quizFeedback} ${
                feedback.includes('Correct') ? styles.correct : styles.incorrect
              }`}>
                {feedback}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
