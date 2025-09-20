import React from 'react';
import { Calendar, Clock, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface TimetableDisplayProps {
  timetable: {
    structure: { [key: string]: { [key: string]: string } };
    metadata: any;
  };
}

const TimetableDisplay: React.FC<TimetableDisplayProps> = ({ timetable }) => {
  console.log('Displaying timetable:', timetable);

  const { structure, metadata } = timetable;
  const days = Object.keys(structure);
  const periods = metadata.periods || Object.keys(structure[days[0]] || {});

  const subjectColors: { [key: string]: string } = {
    'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
    'Physics': 'bg-purple-100 text-purple-800 border-purple-200',
    'Chemistry': 'bg-green-100 text-green-800 border-green-200',
    'Computer Science': 'bg-orange-100 text-orange-800 border-orange-200',
    'English': 'bg-pink-100 text-pink-800 border-pink-200',
    'Data Structures': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Digital Electronics': 'bg-teal-100 text-teal-800 border-teal-200',
    'Programming': 'bg-red-100 text-red-800 border-red-200',
    'Statistics': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Economics': 'bg-gray-100 text-gray-800 border-gray-200',
    'Morning Break': 'bg-amber-100 text-amber-800 border-amber-200',
    'Lunch Break': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const getSubjectStyle = (subject: string) => {
    return subjectColors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleDownload = () => {
    // Convert timetable to CSV format
    let csvContent = 'Time/Day,' + days.join(',') + '\n';
    
    periods.forEach(period => {
      const row = [period];
      days.forEach(day => {
        row.push(structure[day][period] || '');
      });
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Timetable downloaded successfully!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Timetable',
        text: 'Check out my personalized timetable created with Smart Timetable Assistant!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Your Weekly Timetable</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Timetable Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                {metadata.timings?.start} - {metadata.timings?.end}
              </span>
            </div>
            <span>•</span>
            <span>{metadata.numberOfPeriods} periods/day</span>
            <span>•</span>
            <span>{metadata.numberOfSubjects} subjects</span>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-medium text-gray-900 border-r border-gray-200">
                  Time / Day
                </th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-center font-medium text-gray-900 border-r border-gray-200 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, periodIndex) => (
                <tr key={period} className={periodIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200 bg-gray-100">
                    {period}
                  </td>
                  {days.map(day => {
                    const subject = structure[day][period] || '';
                    return (
                      <td key={`${day}-${period}`} className="px-2 py-3 text-center border-r border-gray-200 last:border-r-0">
                        {subject && (
                          <div className={`px-3 py-2 rounded-lg text-xs font-medium border timetable-cell ${getSubjectStyle(subject)}`}>
                            {subject}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Subject Legend:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(subjectColors).map(subject => (
              <div key={subject} className={`px-2 py-1 rounded text-xs font-medium border ${getSubjectStyle(subject)}`}>
                {subject}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimetableDisplay;