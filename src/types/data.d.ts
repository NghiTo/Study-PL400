export type QuestionData = {
  question: string;
  answer: string;
  answerDescription?: string;
  questionImage?: string[];
  answerImage?: string[];
  choices?: {
    [key: string]: string;
  };
};
