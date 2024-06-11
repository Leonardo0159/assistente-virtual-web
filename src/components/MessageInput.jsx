// components/MessageInput.js
import { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex items-center">
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-l-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="bg-blue-500 text-white p-2 rounded-r-lg" onClick={handleSendMessage}>
        Enviar
      </button>
    </div>
  );
};

export default MessageInput;
