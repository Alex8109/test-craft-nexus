
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { parseCSVContent, validateCSVData, Question } from '@/utils/csvParser';

const CSVUploader = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Question[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadSampleCSV = () => {
    const sampleData = `question,type,optionA,optionB,optionC,optionD,correctAnswers
Is the sky blue?,true-false,True,False,,,A
Which of these are fruits?,multiple,Apple,Car,Orange,Train,A|C
What is the capital of India?,single,Mumbai,Delhi,Kolkata,Chennai,B
The Earth is flat,true-false,True,False,,,B
Which are programming languages?,multiple,Python,Chair,JavaScript,Table,A|C`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Sample CSV Downloaded",
      description: "Use this template to format your exam questions.",
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);
    setErrors([]);
    
    try {
      const content = await file.text();
      const parsed = parseCSVContent(content);
      const validation = validateCSVData(parsed);
      
      if (validation.isValid) {
        setParsedData(parsed);
        toast({
          title: "CSV Uploaded Successfully",
          description: `Parsed ${parsed.length} questions successfully.`,
        });
      } else {
        setErrors(validation.errors);
        setParsedData([]);
        toast({
          title: "CSV Validation Failed",
          description: "Please check the errors and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setErrors(['Failed to parse CSV file. Please check the format.']);
      toast({
        title: "Upload Failed",
        description: "Failed to process the CSV file.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setParsedData([]);
    setErrors([]);
  };

  const saveExam = () => {
    if (parsedData.length === 0) return;
    
    // Mock save operation
    toast({
      title: "Exam Saved",
      description: `Exam with ${parsedData.length} questions saved successfully!`,
    });
    
    // Reset form
    clearUpload();
  };

  return (
    <div className="space-y-6">
      {/* Sample CSV Download */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Need a template?</h4>
                <p className="text-sm text-blue-700">Download our sample CSV to get started</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadSampleCSV}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Upload a CSV file containing your exam questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!uploadedFile ? (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button asChild variant="outline">
                    <span className="cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      Select CSV File
                    </span>
                  </Button>
                </label>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">{uploadedFile.name}</span>
                  <Badge variant={errors.length > 0 ? "destructive" : "secondary"}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                
                {isProcessing && (
                  <div className="flex items-center justify-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Processing...
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearUpload}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Found {errors.length} error(s):</div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Question Preview */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-600" />
                Question Preview
              </CardTitle>
              <CardDescription>
                {parsedData.length} question(s) loaded successfully
              </CardDescription>
            </div>
            <Button onClick={saveExam} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Exam
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {parsedData.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Q{index + 1}. {question.question}</h4>
                    <Badge variant="outline">{question.type}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionKey = `option${option}` as keyof Question;
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
        </Card>
      )}
    </div>
  );
};

export default CSVUploader;
