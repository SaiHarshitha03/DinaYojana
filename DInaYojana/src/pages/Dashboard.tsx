import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, LogOut, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import TimetableBot from '@/components/TimetableBot';
import TimetableDisplay from '@/components/TimetableDisplay';

interface Timetable {
  id: string;
  name: string;
  data: any;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showBot, setShowBot] = useState(false);
  const [savedTimetables, setSavedTimetables] = useState<Timetable[]>([]);
  const [currentTimetable, setCurrentTimetable] = useState<any>(null);
  const navigate = useNavigate();

  console.log('Rendering Dashboard for user:', user);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      navigate('/');
      return;
    }

    // Load saved timetables from localStorage
    const saved = localStorage.getItem(`timetables_${user?.id}`);
    if (saved) {
      setSavedTimetables(JSON.parse(saved));
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTimetableGenerated = (timetableData: any) => {
    console.log('New timetable generated:', timetableData);
    setCurrentTimetable(timetableData);
    
    // Save to localStorage
    const newTimetable: Timetable = {
      id: Date.now().toString(),
      name: `Timetable ${savedTimetables.length + 1}`,
      data: timetableData,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [...savedTimetables, newTimetable];
    setSavedTimetables(updated);
    localStorage.setItem(`timetables_${user?.id}`, JSON.stringify(updated));
    
    setShowBot(false);
  };

  const timetableExamples = [
    {
      title: 'Computer Science Schedule',
      description: 'Balanced timetable with programming labs and theory classes',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Engineering Schedule',
      description: 'Comprehensive schedule with practical sessions and workshops',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Mathematics Schedule',
      description: 'Problem-solving focused timetable with adequate breaks',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Timetable
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">({user.department})</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Ready to create your perfect academic schedule? Let's get started.
          </p>
        </div>

        {/* Current Timetable */}
        {currentTimetable && (
          <div className="mb-8">
            <TimetableDisplay timetable={currentTimetable} />
          </div>
        )}

        {/* Create Timetable Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>AI Timetable Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!showBot ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Create Your Timetable
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Our AI assistant will guide you through creating a personalized weekly schedule
                      based on your requirements and preferences.
                    </p>
                    <Button
                      onClick={() => setShowBot(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Start Creating Timetable
                    </Button>
                  </div>
                ) : (
                  <TimetableBot 
                    onTimetableGenerated={handleTimetableGenerated}
                    onCancel={() => setShowBot(false)}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Saved Timetables */}
          <div>
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Clock className="w-5 h-5" />
                  <span>Your Timetables</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedTimetables.length === 0 ? (
                  <p className="text-gray-500 text-sm">No timetables created yet.</p>
                ) : (
                  <div className="space-y-3">
                    {savedTimetables.map((timetable) => (
                      <div
                        key={timetable.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setCurrentTimetable(timetable.data)}
                      >
                        <div className="font-medium text-gray-900">{timetable.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(timetable.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Example Timetables */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Timetable Examples
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {timetableExamples.map((example, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-md shadow-xl border-0 overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <img
                    src={example.image}
                    alt={example.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${example.color} opacity-20`} />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{example.title}</h3>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;