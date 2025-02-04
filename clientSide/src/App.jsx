import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:4000', { withCredentials: true });

const App = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('receive_message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Handle message submission
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const messageData = {
      message,
      time: new Date().toLocaleTimeString(),
    };

    // Send message to the server
    socket.emit('send_message', messageData);

    // Clear input field
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Real-Time Chat App</h1>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        <div className="h-64 overflow-y-auto mb-4 border p-2 rounded-lg bg-gray-50">
          {chat.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="text-sm text-gray-500">{msg.time}:</span>
              <span className="ml-2">{msg.message}</span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l-lg p-2 focus:outline-none"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
