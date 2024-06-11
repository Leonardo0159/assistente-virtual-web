const ConversationList = ({ conversations, onSelectConversation }) => {
  return (
    <div className="w-full h-full bg-gray-100 border-r border-gray-200 overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="p-4 hover:bg-gray-200 cursor-pointer"
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className="flex flex-row items-center gap-4">
            <img src="/images/foto.webp" className="rounded-full h-16"/>
            <h2 className="text-2xl">{conversation.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
