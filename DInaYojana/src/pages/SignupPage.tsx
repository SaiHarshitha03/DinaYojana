import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEPARTMENTS = [
  'CSE', 'ECE', 'EEE', 'Civil', 'MEC', 'Cyber Security', 'Blockchain', 
  'AI', 'ML', 'DS', 'IoT', 'AI&DS', 'AI&ML', 'CSBS'
];

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    role: 'teacher' as 'teacher' | 'hod'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  console.log('Rendering DinaYojana SignupPage');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log(`Updated ${field}:`, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, password, department, role } = formData;
    
    if (!name || !email || !password || !department) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    console.log('Attempting signup with:', { ...formData, password: '***' });
    setIsLoading(true);

    try {
      const success = await signup(formData);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Email already exists. Please use a different email.');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-md shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Join DinaYojana</CardTitle>
            <p className="text-gray-600 mt-2">Create your teacher account to get started</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-white/60 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your institutional email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/60 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-white/60 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)} required>
                  <SelectTrigger className="bg-white/60 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                <Select onValueChange={(value) => handleInputChange('role', value as 'teacher' | 'hod')} defaultValue="teacher">
                  <SelectTrigger className="bg-white/60 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="hod">Head of Department (HOD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;