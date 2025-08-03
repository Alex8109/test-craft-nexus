
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, PlusCircle } from 'lucide-react';
import CSVUploader from './CSVUploader';
import ManualExamCreator from './ManualExamCreator';

const ExamCreator = () => {
  const [activeTab, setActiveTab] = useState('csv-upload');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
            Create New Exam
          </CardTitle>
          <CardDescription>
            Create exams by uploading a CSV file or building them manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="csv-upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </TabsTrigger>
              <TabsTrigger value="manual-create" className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Manually
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv-upload">
              <CSVUploader />
            </TabsContent>

            <TabsContent value="manual-create">
              <ManualExamCreator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamCreator;
