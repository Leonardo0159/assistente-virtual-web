import { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import axios from 'axios';

const ChatWindow = ({ conversations_id }) => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async (page) => {
      try {
        const response = await axios.get(`http://localhost:3333/messages?conversations_id=${conversations_id}&limit=20&page=${page}`);
        if (response.data.length < 20) {
          setHasMore(false);
        }
        if (page === 1) {
          setMessages(response.data);
          // Rolar até o final apenas na primeira carga
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          setMessages(prevMessages => [...response.data, ...prevMessages]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (conversations_id) {
      fetchMessages(page);
    }
  }, [conversations_id, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current.scrollTop === 0 && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => {
        messagesContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasMore]);

  // Polling to fetch new messages
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:3333/messages?conversations_id=${conversations_id}&limit=20&page=1`);
        setMessages(response.data);
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 3000); // Fetch new messages every 3 seconds

    return () => clearInterval(interval);
  }, [conversations_id]);

  const onSendMessage = async (text) => {
    const newMessage = { conversations_id, sender: 'user', text, image_url: null };

    // Adicionar a mensagem do usuário imediatamente
    const tempUserMessage = { ...newMessage, temp: true };
    setMessages((prevMessages) => [...prevMessages, tempUserMessage]);

    try {
      // Enviar mensagem para o backend
      const response = await axios.post('http://localhost:3333/messages', newMessage);

      // Atualizar a lista de mensagens com a resposta do backend
      setMessages((prevMessages) => {
        const newMessages = prevMessages.filter(msg => !msg.temp);
        return [...newMessages, ...response.data];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove a mensagem temporária em caso de erro
      setMessages((prevMessages) => prevMessages.filter(msg => !msg.temp));
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto py-4 px-[5%] space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[45%] p-2 rounded-xl break-words ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-gray-200 rounded-tl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="h-[10%] px-4">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
