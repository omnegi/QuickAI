import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { SendHorizonal } from 'lucide-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

const ChatWithAI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { getToken } = useAuth();
    const chatRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        try {
            const { data } = await axios.post('/api/ai/generate-chatbot', { message: input }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                const aiMessage = { role: 'assistant', content: data.reply };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col justify-between h-screen bg-[#121212] text-white">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <h1 className="text-3xl font-semibold">What's on the agenda today?</h1>
                    <div className="flex gap-2 w-full max-w-md">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything"
                            className="flex-1 bg-[#2E2E2E] text-white p-3 rounded-full outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="p-3 bg-gray-700 text-white rounded-full"
                        >
                            <SendHorizonal />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-between h-screen">
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={` max-w-[60%] p-3 rounded-lg ${
                                    msg.role === 'user'
                                        ? 'ml-auto bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-800 text-gray-200 rounded-bl-none reset-tw'
                                }`}
                            ><Markdown  >
                                {msg.content}
                                </Markdown>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 flex gap-2 border-t border-gray-700">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything"
                            className="flex-1 bg-[#2E2E2E] text-white p-3 rounded-full outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="p-3 bg-gray-700 text-white rounded-full"
                        >
                            <SendHorizonal />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWithAI;
