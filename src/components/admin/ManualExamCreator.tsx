
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Image, 
  Save, 
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Question } from '@/utils/csvParser';

interface ManualQuestion extends Omit<Question, 'correctAnswers'> {
  id: string;
  image?: File;
  correctAnswers: string[];
}

const ManualExamCreator = () => {
  const [questions, setQuestions] = useState<ManualQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ManualQuestion>({
    id: Date.now().toString(),
    question: '',
    type: 'single',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswers: []
  });
  const [examTitle, setExamTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      id: Date.now().toString(),
      question: '',
      type: 'single',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswers: []
    });
  };

  const handleQuestionChange = (field: keyof ManualQuestion, value: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCorrectAnswerChange = (option: string, checked: boolean) => {
    setCurrentQuestion(prev => {
      let newCorrectAnswers = [...prev.correctAnswers];
      
      if (prev.type === 'single') {
        newCorrectAnswers = checked ? [option] : [];
      } else {
        if (checked) {
          if (!newCorrectAnswers.includes(option)) {
            newCorrectAnswers.push(option);
          }
        } else {
          newCorrectAnswers = newCorrectAnswers.filter(ans => ans !== option);
        }
      }
      
      return {
        ...prev,
        correctAnswers: newCorrectAnswers
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentQuestion(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentQuestion.optionA || !currentQuestion.optionB) {
      toast({
        title: "Validation Error",
        description: "At least options A and B are required.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentQuestion.correctAnswers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one correct answer.",
        variant: "destructive",
      });
      return;
    }
    
    setQuestions(prev => [...prev, { ...currentQuestion }]);
    resetCurrentQuestion();
    
    toast({
      title: "Question Added",
      description: `Question ${questions.length + 1} added successfully.`,
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Question Removed",
      description: "Question removed successfully.",
    });
  };

  const saveExam = () => {
    if (!examTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Exam title is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one question.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock save operation
    console.log('Saving exam:', { title: examTitle, questions });
    
    toast({
      title: "Exam Saved",
      description: `"${examTitle}" with ${questions.length} questions saved successfully!`,
    });
    
    // Reset form
    setExamTitle('');
    setQuestions([]);
    resetCurrentQuestion();
  };

  const getOptionLabel = (option: string) => {
    const optionKey = `option${option}` as keyof ManualQuestion;
    return currentQuestion[optionKey] as string || '';
  };

  return (
    <div className="space-y-6">
      {/* Exam Title */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exam-title">Exam Title *</Label>
              <Input
                id="exam-title"
                placeholder="Enter exam title..."
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
          <CardDescription>
            Create a new question for your exam
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Text */}
          <div>
            <Label htmlFor="question-text">Question Text *</Label>
            <Textarea
              id="question-text"
              placeholder="Enter your question..."
              value={currentQuestion.question}
              onChange={(e) => handleQuestionChange('question', e.target.value)}
              rows={3}
            />
          </div>

          {/* Question Type */}
          <div>
            <Label>Question Type *</Label>
            <Select
              value={currentQuestion.type}
              onValueChange={(value) => {
                handleQuestionChange('type', value);
                setCurrentQuestion(prev => ({ ...prev, correctAnswers: [] }));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="single">Single Choice</SelectItem>
                <SelectItem value="multiple">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Question Image (Optional)</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="question-image"
              />
              <label htmlFor="question-image">
                <Button asChild variant="outline" size="sm">
                  <span className="cursor-pointer">
                    <Image className="h-4 w-4 mr-2" />
                    Upload Image
                  </span>
                </Button>
              </label>
              {currentQuestion.image && (
                <span className="ml-2 text-sm text-gray-600">
                  {currentQuestion.image.name}
                </span>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            <Label>Answer Options *</Label>
            
            {currentQuestion.type === 'true-false' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="True option"
                    value={currentQuestion.optionA || 'True'}
                    onChange={(e) => handleQuestionChange('optionA', e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="False option"
                    value={currentQuestion.optionB || 'False'}
                    onChange={(e) => handleQuestionChange('optionB', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div key={option}>
                    <Label htmlFor={`option${option}`} className="text-sm">
                      Option {option} {['A', 'B'].includes(option) && '*'}
                    </Label>
                    <Input
                      id={`option${option}`}
                      placeholder={`Enter option ${option}...`}
                      value={getOptionLabel(option)}
                      onChange={(e) => handleQuestionChange(`option${option}` as keyof ManualQuestion, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Correct Answers */}
          <div>
            <Label>Correct Answer(s) *</Label>
            <div className="mt-2 space-y-2">
              {currentQuestion.type === 'single' ? (
                <RadioGroup
                  value={currentQuestion.correctAnswers[0] || ''}
                  onValueChange={(value) => handleCorrectAnswerChange(value, true)}
                >
                  {(['A', 'B', 'C', 'D'] as const).map((option) => {
                    const optionText = getOptionLabel(option);
                    if (!optionText && !['A', 'B'].includes(option)) return null;
                    
                    return (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`correct-${option}`} />
                        <Label htmlFor={`correct-${option}`} className="text-sm">
                          {option}: {optionText || `Option ${option}`}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => {
                    const optionText = getOptionLabel(option);
                    if (!optionText && !['A', 'B'].includes(option)) return null;
                    
                    return (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`correct-${option}`}
                          checked={currentQuestion.correctAnswers.includes(option)}
                          onCheckedChange={(checked) => handleCorrectAnswerChange(option, !!checked)}
                        />
                        <Label htmlFor={`correct-${option}`} className="text-sm">
                          {option}: {optionText || `Option ${option}`}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={addQuestion} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions Preview */}
      {questions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-600" />
                Questions Preview
              </CardTitle>
              <CardDescription>
                {questions.length} question(s) added
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button onClick={saveExam} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Exam
              </Button>
            </div>
          </CardHeader>
          
          {showPreview && (
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Q{index + 1}. {question.question}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{question.type}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {question.image && (
                      <div className="mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <Image className="h-3 w-3 mr-1" />
                          Has Image
                        </Badge>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      {(['A', 'B', 'C', 'D'] as const).map((option) => {
                        const optionKey = `option${option}` as keyof ManualQuestion;
                        const optionValue = question[optionKey] as string;
                        if (!optionValue) return null;
                        
                        const isCorrect = question.correctAnswers.includes(option);
                        return (
                          <div
                            key={option}
                            className={`p-2 rounded text-sm ${
                              isCorrect 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-white border'
                            }`}
                          >
                            <span className="font-medium">{option}:</span> {optionValue}
                            {isCorrect && <CheckCircle className="h-3 w-3 inline ml-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default ManualExamCreator;
