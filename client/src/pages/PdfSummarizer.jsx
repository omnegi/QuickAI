
import { FileSymlink, FileText, Sparkles, Send, MessageCircle, Bot, User, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const PdfSummarizer = () => {
      const [input, setInput] = useState('');
        const [loading, setLoading] = useState(false);
        const [content, setContent] = useState('');
        const [pdfId, setPdfId] = useState(null);
        const [chatMessage, setChatMessage] = useState('');
        const [chatLoading, setChatLoading] = useState(false);
        const [conversation, setConversation] = useState([]);
        const [showChat, setShowChat] = useState(false);
        const chatEndRef = useRef(null);
        const [isTyping, setIsTyping] = useState(false);
         
           const { getToken } = useAuth();

           // Auto-scroll to bottom of chat
           const scrollToBottom = () => {
             chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
           };

           useEffect(() => {
             scrollToBottom();
           }, [conversation]);
          
            const onSubmitHandler = async(e) => {
              e.preventDefault();
              try {
                setLoading(true);
                const formData = new FormData();
                formData.append('pdf', input);
                const { data } = await axios.post('/api/ai/pdf-summarizer', formData, {
                  headers: {
                    Authorization: `Bearer ${await getToken()}`
                  }
                });
                if (data.success) {
                  console.log('PDF summarized successfully:', { content: data.content, pdfId: data.pdfId });
                  setContent(data.content);
                  setPdfId(data.pdfId);
                  setShowChat(true);
                  setConversation([]);
                  toast.success('PDF summarized successfully! You can now chat about it.');
                } else {
                  console.error('PDF summarization failed:', data.message);
                  toast.error(data.message );
                }
              } catch (error) {
                toast.error(error.message );
              }
              setLoading(false);
            }

            const handleChatSubmit = async (e) => {
              e.preventDefault();
              
              if (!chatMessage.trim() || !pdfId) {
                return;
              }

              try {
                setChatLoading(true);
                setIsTyping(true);
                
                const userMessage = { 
                  role: 'user', 
                  content: chatMessage, 
                  timestamp: new Date(),
                  id: Date.now()
                };
                setConversation(prev => [...prev, userMessage]);
                setChatMessage('');
                
                const requestData = {
                  message: userMessage.content,
                  pdfId: pdfId,
                  conversationHistory: []
                };
                
                const { data } = await axios.post('/api/ai/pdf-chatbot', requestData, {
                  headers: {
                    Authorization: `Bearer ${await getToken()}`
                  }
                });

                if (data.success) {
                  const aiMessage = { 
                    role: 'assistant', 
                    content: data.reply, 
                    timestamp: new Date(),
                    id: Date.now() + 1
                  };
                  setConversation(prev => [...prev, aiMessage]);
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                console.error('Chat error:', error);
                toast.error(error.response?.data?.message || error.message || 'Failed to send message');
              }
              setChatLoading(false);
              setIsTyping(false);
            };

            const clearChat = () => {
              setConversation([]);
              toast.success('Chat history cleared');
            };

            const formatTime = (timestamp) => {
              return new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
            };



            return (
     <div className='p-6 h-full overflow-y-scroll text-slate-700'>
          <div className='flex items-start flex-wrap gap-4'>
            {/* Left Column: Upload Form + Chat */}
            <div className='flex flex-col gap-4'>
              <form onSubmit={onSubmitHandler}  className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm' action="">
                <div className='flex items-center gap-3 '>
                  <Sparkles className='w-6  text-[#00DA83]' />
                  <h1 className='text-xl font-semibold'>Pdf Summarize</h1>
                </div>
                <p className='mt-6 text-sm font-medium'>Upload PDF</p>
        
                <input  onChange={(e)=>setInput(e.target.files[0])} type="file" accept='application/pdf' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 hover:border-[#00DA83] transition-colors' required />
                
                <p className='text-sm text-gray-500 font-light mt-1'>Supports PDF file only.</p>
              
                
                <button disabled={loading} className='w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6
        text-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50'>
                  {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FileSymlink className='w-5' />}
                  Summarize PDF
                </button>
        
              </form>

              {/* PDF Assistant Chat - Below upload form */}
              {showChat && (
                <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96 max-h-[500px] shadow-sm'>
                  {/* Chat Header */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gradient-to-r from-[#00DA83] to-[#009BB3] rounded-full flex items-center justify-center'>
                        <Bot className='w-4 h-4 text-white' />
                      </div>
                      <div>
                        <h1 className='text-lg font-semibold'>PDF Assistant</h1>
                        <p className='text-xs text-gray-500'>Ask questions about your PDF</p>
                      </div>
                    </div>
                    <button
                      onClick={clearChat}
                      className='p-1 text-gray-400 hover:text-gray-600 transition-colors'
                      title="Clear chat"
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className='flex-1 overflow-y-auto space-y-4 max-h-80 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                    {conversation.length === 0 ? (
                      <div className='text-center py-8'>
                        <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                          <MessageCircle className='w-6 h-6 text-gray-400'/>
                        </div>
                        <p className='text-sm text-gray-500 mb-2'>Start a conversation about your PDF</p>
                        <p className='text-xs text-gray-400'>Try asking: "What are the main points?" or "Can you explain the key concepts?"</p>
                      </div>
                    ) : (
                      conversation.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl text-sm shadow-sm ${
                            msg.role === 'user' 
                              ? 'bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white rounded-br-md' 
                              : 'bg-gray-100 text-gray-700 rounded-bl-md'
                          }`}>
                            <div className='flex items-start gap-2'>
                              {msg.role === 'assistant' && (
                                <Bot className='w-4 h-4 text-[#00DA83] mt-0.5 flex-shrink-0' />
                              )}
                              <div className='flex-1'>
                               
                                  {msg.content}
                               
                              </div>
                              {msg.role === 'user' && (
                                <User className='w-4 h-4 text-white mt-0.5 flex-shrink-0' />
                              )}
                            </div>
                            <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-gray-200' : 'text-gray-500'}`}>
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className='flex justify-start'>
                        <div className='bg-gray-100 p-3 rounded-2xl rounded-bl-md shadow-sm'>
                          <div className='flex items-center gap-2'>
                            <Bot className='w-4 h-4 text-[#00DA83]' />
                            <div className='flex space-x-1'>
                              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className='mt-4 flex gap-2'>
                    <div className='flex-1 relative'>
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask a question about the PDF..."
                        className='w-full p-3 pr-10 outline-none text-sm rounded-full border border-gray-300 focus:border-[#00DA83] focus:ring-1 focus:ring-[#00DA83] transition-all'
                        disabled={chatLoading}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleChatSubmit(e);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={chatLoading || !chatMessage.trim()}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-[#00DA83] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00C073] transition-colors'
                      >
                        <Send className='w-3 h-3' />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: PDF Summary Result */}
            <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96 max-h-[600px] shadow-sm'>
              <div className='flex items-center gap-3 '>
                <FileSymlink className='w-5 h-5 text-[#00DA83]'/>
                <h1 className='text-xl font-semibold'>Summarized Result</h1>
              </div>
              {
                !content ? (
                  <div className='flex-1 flex justify-center items-center'>
                    <div className='text-sm text-gray-400 gap-5 flex flex-col items-center'>
                      <FileSymlink className='w-9 h-9 '/> 
                      <p>Upload a pdf and click "Summarize PDF" to get started</p>           
                    </div>
                  </div>
                ) : (
                   <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
                                <div className='reset-tw'>
                                  <Markdown>{content}</Markdown>
                                </div>
                              </div>
                            )
              }
            </div>
          </div>
    
        </div>
      );
  }

export default PdfSummarizer