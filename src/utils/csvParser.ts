
export interface Question {
  question: string;
  type: 'true-false' | 'single' | 'multiple';
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswers: string[];
}

export const parseCSVContent = (csvContent: string): Question[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const questions: Question[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const question: Question = {
      question: '',
      type: 'single',
      correctAnswers: []
    };
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      
      switch (header) {
        case 'question':
          question.question = value;
          break;
        case 'type':
          if (['true-false', 'single', 'multiple'].includes(value)) {
            question.type = value as Question['type'];
          }
          break;
        case 'optiona':
          question.optionA = value;
          break;
        case 'optionb':
          question.optionB = value;
          break;
        case 'optionc':
          question.optionC = value;
          break;
        case 'optiond':
          question.optionD = value;
          break;
        case 'correctanswers':
          question.correctAnswers = value.split('|').map(a => a.trim()).filter(a => a);
          break;
      }
    });
    
    if (question.question && question.correctAnswers.length > 0) {
      questions.push(question);
    }
  }
  
  return questions;
};

const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i - 1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const validateCSVData = (questions: Question[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (questions.length === 0) {
    errors.push('No valid questions found in CSV');
    return { isValid: false, errors };
  }
  
  questions.forEach((question, index) => {
    const rowNum = index + 2; // +2 because index starts at 0 and we skip header
    
    if (!question.question) {
      errors.push(`Row ${rowNum}: Question text is required`);
    }
    
    if (!['true-false', 'single', 'multiple'].includes(question.type)) {
      errors.push(`Row ${rowNum}: Invalid question type. Must be 'true-false', 'single', or 'multiple'`);
    }
    
    if (question.type === 'true-false') {
      if (!question.optionA || !question.optionB) {
        errors.push(`Row ${rowNum}: True-false questions must have optionA and optionB`);
      }
    } else {
      const hasOptions = !!(question.optionA && question.optionB);
      if (!hasOptions) {
        errors.push(`Row ${rowNum}: Questions must have at least optionA and optionB`);
      }
    }
    
    if (question.correctAnswers.length === 0) {
      errors.push(`Row ${rowNum}: At least one correct answer is required`);
    }
    
    if (question.type === 'single' && question.correctAnswers.length > 1) {
      errors.push(`Row ${rowNum}: Single-choice questions can only have one correct answer`);
    }
    
    // Validate correct answers are valid options
    const validOptions = ['A', 'B', 'C', 'D'].filter(opt => {
      const optionKey = `option${opt}` as keyof Question;
      return question[optionKey];
    });
    
    const invalidAnswers = question.correctAnswers.filter(ans => !validOptions.includes(ans));
    if (invalidAnswers.length > 0) {
      errors.push(`Row ${rowNum}: Invalid correct answers: ${invalidAnswers.join(', ')}`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
};
