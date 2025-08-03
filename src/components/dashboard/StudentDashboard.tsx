
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Clock, Trophy, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-green-600 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Portal</h2>
          <p className="text-xl text-gray-600 mb-8">
            Take exams and track your progress
          </p>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                Student features are under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Available Exams
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Exam History
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  Results & Scores
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
