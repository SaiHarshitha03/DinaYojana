import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Calendar, ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const HODLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  console.log('Rendering HOD LoginPage');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    console.log('Attempting HOD login with:', { email, password: '***' });
    setIsLoading(true);

    try {
      const success = await login(email, password, 'hod');
      if (success) {
        toast.success('HOD login successful!');
        navigate('/hod-dashboard');
      } else {
        toast.error('Invalid HOD credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('HOD Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-md shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">HOD Portal</CardTitle>
            <p className="text-gray-600 mt-2">Sign in as Head of Department</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">HOD Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your HOD email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    required
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In as HOD'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Are you a teacher?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Teacher Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HODLoginPage;