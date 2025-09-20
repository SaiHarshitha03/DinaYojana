import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, Users, BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  console.log('Rendering DinaYojana HomePage');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    if (searchQuery.trim()) {
      navigate('/signup');
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered timetable generation with template selection and customization'
    },
    {
      icon: Clock,
      title: 'Flexible Timings',
      description: 'Configure periods, breaks, and special slots according to your needs'
    },
    {
      icon: Users,
      title: 'Multi-Department',
      description: 'Support for CSE, ECE, EEE, Civil, MEC, Cyber Security, AI, ML, DS, IoT, and more'
    },
    {
      icon: GraduationCap,
      title: 'HOD Approval',
      description: 'Built-in approval workflow for Head of Department review and modifications'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DinaYojana
                </span>
                <p className="text-xs text-gray-500 -mt-1">Smart Timetable Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">
                  Teacher Login
                </Button>
              </Link>
              <Link to="/hod-login">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                  HOD Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Educational Planning</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                DinaYojana
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              The intelligent timetable management system designed for educational institutions. 
              Create, customize, and approve academic schedules with our advanced AI assistant 
              supporting teachers and HODs throughout the planning process.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16 animate-slide-up">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for timetable templates or get started..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg"
                >
                  Get Started
                </Button>
              </div>
            </form>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-gray-200 hover:bg-white/80 transition-all duration-300 group hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to streamline your academic scheduling?
            </h2>
            <p className="text-gray-600 mb-6">
              Join educational institutions worldwide who trust DinaYojana for efficient timetable management 
              with intelligent assistance and seamless approval workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8">
                  Create Teacher Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 px-8">
                  Already have an account?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;