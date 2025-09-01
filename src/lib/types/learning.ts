export interface AnswerOption {
    answerText: string;
    isCorrect: boolean;
  }
  
export interface Question {
    questionText: string;
    answerOptions: AnswerOption[];
  }

export interface QuizResponse {
    questions: Question[];
  }

export interface QuizRequest {
    topics: string[];
  }