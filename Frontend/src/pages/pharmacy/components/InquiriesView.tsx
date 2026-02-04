
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin';
  text: string;
}

export function InquiriesView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for demo: user/admin
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: isAdmin ? 'admin' : 'user', text: input }
    ]);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col h-[70vh] bg-white rounded-xl border border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-gray-900 text-lg font-bold">Inquiries Chat</h2>
        <button
          className="text-xs text-blue-700 underline"
          onClick={() => setIsAdmin(a => !a)}
          title="Switch role (for demo)"
        >
          Switch to {isAdmin ? 'User' : 'Admin'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-900 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        className="flex gap-2 p-4 border-t border-gray-100 bg-white"
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={isAdmin ? 'Reply as admin...' : 'Type your message...'}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}
