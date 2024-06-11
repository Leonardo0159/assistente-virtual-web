import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const Home = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await axios.get('http://localhost:3333/assistants');
        setAssistants(response.data);
      } catch (error) {
        console.error('Error fetching assistants:', error);
      }
    };

    fetchAssistants();
  }, []);

  const handleSelectConversation = (assistantId) => {
    setSelectedAssistantId(assistantId);
  };

  return (
    <div className="h-screen flex flex-col">
      <div>
        <NavBar />
      </div>
      <div className="flex-1 flex h-[90%]">
        <div className="w-1/4 h-full overflow-y-auto">
          <ConversationList
            conversations={assistants}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        {selectedAssistantId ? (
          <div className="w-3/4 h-full">
            <ChatWindow conversations_id={selectedAssistantId} />
          </div>
        ) : (
          <div className="w-3/4 h-full flex items-center justify-center">
            <h2 className="text-lg text-gray-500">Selecione uma conversa</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
