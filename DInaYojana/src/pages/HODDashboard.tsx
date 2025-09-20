import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, Edit, LogOut, User, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PendingTimetable {
  id: string;
  teacherName: string;
  teacherEmail: string;
  department: string;
  data: any;
  createdAt: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}

const HODDashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [pendingTimetables, setPendingTimetables] = useState<PendingTimetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<PendingTimetable | null>(null);
  const navigate = useNavigate();

  console.log('Rendering HOD Dashboard for user:', user);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'hod') {
      console.log('User not authenticated as HOD, redirecting to home');
      navigate('/');
      return;
    }

    // Load pending timetables from localStorage (in real app, this would be from API)
    loadPendingTimetables();
  }, [isAuthenticated, navigate, user]);

  const loadPendingTimetables = () => {
    // Simulate loading pending timetables
    const mockTimetables: PendingTimetable[] = [
      {
        id: '1',
        teacherName: 'Dr. Sarah Johnson',
        teacherEmail: 'sarah.johnson@university.edu',
        department: 'CSE',
        data: {
          structure: {
            Monday: { 'Period 1': 'Data Structures', 'Period 2': 'Algorithms', 'Period 3': 'Morning Break' },
            Tuesday: { 'Period 1': 'Database Systems', 'Period 2': 'Software Engineering', 'Period 3': 'Morning Break' }
          },
          metadata: { template: 'Modern Color-Coded', periodsPerDay: 6, startTime: '9:00 AM', endTime: '4:00 PM' }
        },
        createdAt: new Date().toISOString(),
        status: 'pending_approval'
      },
      {
        id: '2',
        teacherName: 'Prof. Michael Chen',
        teacherEmail: 'michael.chen@university.edu',
        department: 'ECE',
        data: {
          structure: {
            Monday: { 'Period 1': 'Circuit Analysis', 'Period 2': 'Digital Logic', 'Period 3': 'Morning Break' },
            Tuesday: { 'Period 1': 'Microprocessors', 'Period 2': 'Signal Processing', 'Period 3': 'Morning Break' }
          },
          metadata: { template: 'Classic Grid', periodsPerDay: 7, startTime: '8:30 AM', endTime: '4:30 PM' }
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending_approval'
      }
    ];
    
    setPendingTimetables(mockTimetables);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const approveTimetable = (timetableId: string) => {
    setPendingTimetables(prev => 
      prev.map(tt => 
        tt.id === timetableId 
          ? { ...tt, status: 'approved' as const }
          : tt
      )
    );
    toast.success('Timetable approved successfully!');
    setSelectedTimetable(null);
  };

  const rejectTimetable = (timetableId: string) => {
    setPendingTimetables(prev => 
      prev.map(tt => 
        tt.id === timetableId 
          ? { ...tt, status: 'rejected' as const }
          : tt
      )
    );
    toast.success('Timetable rejected. Teacher will be notified.');
    setSelectedTimetable(null);
  };

  const requestModification = (timetableId: string) => {
    toast.info('Modification request sent to teacher');
    setSelectedTimetable(null);
  };

  if (!isAuthenticated || !user || user.role !== 'hod') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  DinaYojana HOD Portal
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  HOD - {user.department}
                </Badge>
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
            Welcome to HOD Portal, {user.name}
          </h1>
          <p className="text-gray-600">
            Review and approve timetables submitted by teachers in your department.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingTimetables.filter(tt => tt.status === 'pending_approval').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingTimetables.filter(tt => tt.status === 'approved').length}
                  </p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingTimetables.filter(tt => tt.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingTimetables.length}</p>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Timetables */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Clock className="w-5 h-5" />
              <span>Pending Timetable Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTimetables.filter(tt => tt.status === 'pending_approval').length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending timetables for review.</p>
            ) : (
              <div className="space-y-4">
                {pendingTimetables
                  .filter(tt => tt.status === 'pending_approval')
                  .map((timetable) => (
                    <div
                      key={timetable.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{timetable.teacherName}</h3>
                            <Badge variant="outline">{timetable.department}</Badge>
                            <Badge className="bg-orange-100 text-orange-700">
                              {timetable.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{timetable.teacherEmail}</p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(timetable.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Template: {timetable.data.metadata.template} | 
                            Periods: {timetable.data.metadata.periodsPerDay} | 
                            Time: {timetable.data.metadata.startTime} - {timetable.data.metadata.endTime}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTimetable(timetable)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timetable Review Modal */}
        {selectedTimetable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span>Review Timetable - {selectedTimetable.teacherName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTimetable(null)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Timetable Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Timetable Preview</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left font-medium text-gray-900 border-r border-gray-200">
                            Day / Period
                          </th>
                          {Object.keys(selectedTimetable.data.structure.Monday || {}).map(period => (
                            <th key={period} className="px-4 py-2 text-center font-medium text-gray-900 border-r border-gray-200 last:border-r-0">
                              {period}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedTimetable.data.structure).map(([day, periods]: [string, any]) => (
                          <tr key={day} className="border-t border-gray-200">
                            <td className="px-4 py-2 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">
                              {day}
                            </td>
                            {Object.values(periods).map((subject, index) => (
                              <td key={index} className="px-2 py-2 text-center border-r border-gray-200 last:border-r-0">
                                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {subject as string}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => requestModification(selectedTimetable.id)}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => rejectTimetable(selectedTimetable.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => approveTimetable(selectedTimetable.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HODDashboard;