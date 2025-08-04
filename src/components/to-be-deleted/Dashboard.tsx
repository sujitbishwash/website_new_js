import React from 'react';
import { BookOpen, MessageCircle, FileText, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-gray-400">Courses</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="text-gray-400">Chats</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-gray-400">Tests</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-400">Hours Studied</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-medium">Mathematics - Algebra</p>
                <p className="text-sm text-gray-400">Completed 2 hours ago</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Completed</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-medium">Physics Test Series</p>
                <p className="text-sm text-gray-400">In progress</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">In Progress</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 p-2 rounded-lg">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="font-medium">Chemistry Doubt Session</p>
                <p className="text-sm text-gray-400">Scheduled for tomorrow</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Scheduled</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Mathematics</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Physics</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Chemistry</span>
              <span>90%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
