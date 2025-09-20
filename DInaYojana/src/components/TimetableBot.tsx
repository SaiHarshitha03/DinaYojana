import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'template-selection' | 'text';
  options?: string[];
}

interface TimetableBotProps {
  onTimetableGenerated: (timetable: any) => void;
  onCancel: () => void;
}

interface UserData {
  template?: string;
  workingHoursPerDay?: number;
  periodsPerDay?: number;
  startTime?: string;
  endTime?: string;
  subjects?: string[];
  subjectHours?: { [key: string]: number };
  doublePeriodsSubjects?: string[];
  numberOfLabs?: number;
  labDuration?: number;
  minorSubjects?: number;
  morningBreak?: number;
  lunchBreak?: number;
  preferredSlots?: Array<{
    subject: string;
    class: string;
    day: string;
    time: string;
  }>;
}

const TimetableBot: React.FC<TimetableBotProps> = ({ onTimetableGenerated, onCancel }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const templates = [
    'Classic Grid (simple rows & columns)',
    'Modern Color-Coded (subjects with colors)',
    'Weekly Calendar View (Google Calendar style)',
    'Compact View (minimal, condensed)'
  ];

  const sections = [
    {
      name: 'Template Selection',
      steps: ['Select your preferred timetable template layout:']
    },
    {
      name: 'General Information',
      steps: [
        'How many working hours per day do you have? (e.g., 8)',
        'How many periods per day do you need?',
        'What time does the first period start? (e.g., 9:00 AM)',
        'What time does the last period end? (e.g., 5:00 PM)'
      ]
    },
    {
      name: 'Subjects & Labs',
      steps: [
        'How many subjects do you teach in total?',
        'Please enter the names of your subjects (comma-separated)',
        'Which subjects require double periods? (comma-separated, or type "none")',
        'How many lab subjects do you have?',
        'How many periods does each lab session take? (e.g., 2)',
        'How many minor subjects do you have?'
      ]
    },
    {
      name: 'Breaks & Special Slots',
      steps: [
        'How long is your morning break in minutes? (e.g., 15)',
        'How long is your lunch break in minutes? (e.g., 60)',
        'Do you have preferred time slots for certain subjects? (yes/no)'
      ]
    }
  ];

  console.log('TimetableBot initialized with step:', currentStep, 'section:', currentSection);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: "Hello! I'm your DinaYojana Assistant. I'll help you create a personalized weekly timetable step by step. Let's start by selecting a template layout that suits your preferences.",
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    setTimeout(() => {
      askQuestion(0, 0);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, isBot: boolean, type?: 'template-selection' | 'text', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      type,
      options
    };
    
    setMessages(prev => [...prev, newMessage]);
    console.log('Added message:', { text, isBot, type, options });
  };

  const askQuestion = (sectionIndex: number, stepIndex: number) => {
    const section = sections[sectionIndex];
    if (section && stepIndex < section.steps.length) {
      setTimeout(() => {
        if (sectionIndex === 0 && stepIndex === 0) {
          // Template selection with options
          addMessage(section.steps[stepIndex], true, 'template-selection', templates);
        } else {
          addMessage(section.steps[stepIndex], true);
        }
      }, 500);
    }
  };

  const validateInput = (input: string, sectionIndex: number, stepIndex: number): boolean => {
    const trimmedInput = input.trim();
    
    if (sectionIndex === 0) {
      // Template selection
      return templates.includes(trimmedInput);
    }
    
    if (sectionIndex === 1) {
      // General Info
      switch (stepIndex) {
        case 0: case 1: // Working hours, periods
          return /^\d+$/.test(trimmedInput) && parseInt(trimmedInput) > 0;
        case 2: case 3: // Start/end times
          return /\d{1,2}:\d{2}\s*(AM|PM)/i.test(trimmedInput);
        default:
          return trimmedInput.length > 0;
      }
    }
    
    if (sectionIndex === 2) {
      // Subjects & Labs
      switch (stepIndex) {
        case 0: case 3: case 4: case 5: // Number inputs
          return /^\d+$/.test(trimmedInput) && parseInt(trimmedInput) >= 0;
        case 1: case 2: // Subject names, double periods
          return trimmedInput.length > 0;
        default:
          return trimmedInput.length > 0;
      }
    }
    
    if (sectionIndex === 3) {
      // Breaks & Special Slots
      switch (stepIndex) {
        case 0: case 1: // Break durations
          return /^\d+$/.test(trimmedInput) && parseInt(trimmedInput) >= 0;
        case 2: // Yes/no question
          return /^(yes|no)$/i.test(trimmedInput);
        default:
          return trimmedInput.length > 0;
      }
    }
    
    return trimmedInput.length > 0;
  };

  const processInput = (input: string, sectionIndex: number, stepIndex: number) => {
    const trimmedInput = input.trim();
    const newUserData = { ...userData };

    if (sectionIndex === 0) {
      // Template Selection
      newUserData.template = trimmedInput;
    } else if (sectionIndex === 1) {
      // General Info
      switch (stepIndex) {
        case 0:
          newUserData.workingHoursPerDay = parseInt(trimmedInput);
          break;
        case 1:
          newUserData.periodsPerDay = parseInt(trimmedInput);
          break;
        case 2:
          newUserData.startTime = trimmedInput;
          break;
        case 3:
          newUserData.endTime = trimmedInput;
          break;
      }
    } else if (sectionIndex === 2) {
      // Subjects & Labs
      switch (stepIndex) {
        case 0:
          // Will collect subject names in next step
          break;
        case 1:
          newUserData.subjects = trimmedInput.split(',').map(s => s.trim());
          break;
        case 2:
          if (trimmedInput.toLowerCase() !== 'none') {
            newUserData.doublePeriodsSubjects = trimmedInput.split(',').map(s => s.trim());
          }
          break;
        case 3:
          newUserData.numberOfLabs = parseInt(trimmedInput);
          break;
        case 4:
          newUserData.labDuration = parseInt(trimmedInput);
          break;
        case 5:
          newUserData.minorSubjects = parseInt(trimmedInput);
          break;
      }
    } else if (sectionIndex === 3) {
      // Breaks & Special Slots
      switch (stepIndex) {
        case 0:
          newUserData.morningBreak = parseInt(trimmedInput);
          break;
        case 1:
          newUserData.lunchBreak = parseInt(trimmedInput);
          break;
        case 2:
          // Handle preferred slots logic if yes
          break;
      }
    }

    setUserData(newUserData);
    console.log('Updated user data:', newUserData);
  };

  const handleTemplateSelection = (template: string) => {
    addMessage(template, false);
    processInput(template, 0, 0);
    moveToNextStep();
  };

  const moveToNextStep = () => {
    const nextStep = currentStep + 1;
    const currentSectionData = sections[currentSection];
    
    if (nextStep < currentSectionData.steps.length) {
      setCurrentStep(nextStep);
      askQuestion(currentSection, nextStep);
    } else {
      // Move to next section
      const nextSection = currentSection + 1;
      if (nextSection < sections.length) {
        setCurrentSection(nextSection);
        setCurrentStep(0);
        
        setTimeout(() => {
          addMessage(`Great! Now let's move to ${sections[nextSection].name}.`, true);
          setTimeout(() => {
            askQuestion(nextSection, 0);
          }, 1000);
        }, 500);
      } else {
        // All sections completed
        setTimeout(() => {
          collectSubjectHours();
        }, 1000);
      }
    }
  };

  const collectSubjectHours = async () => {
    const subjects = userData.subjects || [];
    const subjectHours: { [key: string]: number } = {};

    addMessage(`Perfect! Now I need to know how many hours per week each subject requires.`, true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      
      addMessage(`How many hours per week do you need for ${subject}?`, true);
      
      // For demo, we'll assign random hours between 3-6
      const hours = Math.floor(Math.random() * 4) + 3;
      subjectHours[subject] = hours;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      addMessage(`${hours} hours`, false);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const finalUserData = {
      ...userData,
      subjectHours
    };
    
    setUserData(finalUserData);
    generateTimetable(finalUserData);
  };

  const generateTimetable = (finalData: UserData) => {
    setIsGenerating(true);
    addMessage("Excellent! I have all the information needed. Let me generate your personalized timetable using the selected template...", true);
    
    setTimeout(() => {
      const generatedTimetable = createTimetableStructure(finalData);
      addMessage("Your timetable has been successfully generated! You can now review, edit, and submit it for HOD approval.", true);
      setIsGenerating(false);
      onTimetableGenerated(generatedTimetable);
    }, 3000);
  };

  const createTimetableStructure = (data: UserData) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = Array.from({ length: data.periodsPerDay || 6 }, (_, i) => `Period ${i + 1}`);
    const subjects = data.subjects || ['Mathematics', 'Physics', 'Computer Science', 'English'];
    
    const timetable: { [key: string]: { [key: string]: string } } = {};
    
    days.forEach(day => {
      timetable[day] = {};
      periods.forEach((period, index) => {
        if (period.includes('3') && data.morningBreak) {
          timetable[day][period] = 'Morning Break';
        } else if (period.includes('5') && data.lunchBreak) {
          timetable[day][period] = 'Lunch Break';
        } else {
          const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
          timetable[day][period] = randomSubject;
        }
      });
    });

    return {
      structure: timetable,
      metadata: {
        ...data,
        createdAt: new Date().toISOString(),
        days,
        periods,
        status: 'pending_approval'
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    addMessage(currentInput, false);
    
    if (!validateInput(currentInput, currentSection, currentStep)) {
      setTimeout(() => {
        addMessage("I'm sorry, that doesn't seem to be a valid input for this question. Please try again.", true);
        setTimeout(() => {
          askQuestion(currentSection, currentStep);
        }, 1000);
      }, 500);
      setCurrentInput('');
      return;
    }

    processInput(currentInput, currentSection, currentStep);
    moveToNextStep();
    setCurrentInput('');
  };

  return (
    <div className="flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-gray-900">DinaYojana Assistant</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} chat-message`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.isBot ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                {message.isBot ? (
                  <Bot className="w-3 h-3 text-white" />
                ) : (
                  <User className="w-3 h-3 text-white" />
                )}
              </div>
              <Card className={`${message.isBot ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-100 border-gray-200'}`}>
                <CardContent className="p-3">
                  <p className="text-sm text-gray-800">{message.text}</p>
                  {message.type === 'template-selection' && message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => handleTemplateSelection(option)}
                        >
                          <Palette className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-xs">{option}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start chat-message">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Generating timetable...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isGenerating && currentSection < sections.length && (
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TimetableBot;