import React from 'react';

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">AI Chat</h1>
      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            <div className="flex justify-start">
              <div className="bg-gray-700 p-4 rounded-lg max-w-md">
                <p>Hello! How can I help you with your studies today?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-600 p-4 rounded-lg max-w-md">
                <p>I need help understanding quadratic equations.</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-700 p-4 rounded-lg max-w-md">
                <p>Sure! Quadratic equations are polynomial equations of degree 2. The standard form is ax² + bx + c = 0.</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-gray-700 text-white p-3 rounded-l-lg focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
