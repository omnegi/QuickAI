import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { SendHorizonal } from "lucide-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ChatWithAI = () => {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const chatRef = useRef(null);



  const handleSend = async () => {

    if (!input.trim()) return;

    const userMessage = {

      role: "user",

      content: input

    };

    setMessages(prev => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {

      const { data } = await axios.post(

        "/api/ai/generate-chatbot",

        { message: input },

        {

          headers: {

            Authorization: `Bearer ${await getToken()}`

          }

        }

      );


      if (data.success) {

        const aiMessage = {

          role: "assistant",

          content: data.reply

        };

        setMessages(prev => [...prev, aiMessage]);

      }

      else {

        toast.error(data.message);

      }

    }

    catch (error) {

      toast.error("AI error");

    }

    finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    chatRef.current?.scrollTo({

      top: chatRef.current.scrollHeight,

      behavior: "smooth"

    });

  }, [messages]);



  return (

    <div className="flex flex-col h-screen text-white


    bg-gradient-to-br

    from-[#0f172a]

    via-[#020617]

    to-[#020617]">



      {/* HEADER */}

      <div className="px-6 py-4 border-b border-white/10 backdrop-blur-lg">

        <h1 className="text-lg font-semibold">

          AI Assistant

        </h1>

      </div>



      {/* CHAT AREA */}

      <div

        ref={chatRef}

        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"

      >


        {messages.length === 0 && (

          <div className="flex flex-col items-center justify-center mt-20 gap-3 text-center">

            <h2 className="text-2xl font-semibold text-white/80">

              How can I help today?

            </h2>

            <p className="text-white/40 text-sm">

              Ask anything about coding, AI, career, projects...

            </p>

          </div>

        )}



        {messages.map((msg, index) => (

          <div

            key={index}

            className={`flex

            ${msg.role === "user"

                ? "justify-end"

                : "justify-start"

              }`}

          >

            <div

              className={`

              max-w-[75%]

              px-4 py-3

              rounded-2xl

              text-sm

              backdrop-blur-lg

              shadow-md

              ${msg.role === "user"

                  ?

                  "bg-gradient-to-r

                  from-blue-500

                  to-indigo-600

                  text-white

                  rounded-br-md"

                  :

                  "bg-white/5

                  border

                  border-white/10

                  text-white/90

                  rounded-bl-md"

                }

              `}

            >

              <Markdown remarkPlugins={[remarkGfm]}>

                {msg.content}

              </Markdown>

            </div>

          </div>

        ))}



        {loading && (

          <div className="text-white/40 text-sm">

            AI is typing...

          </div>

        )}



      </div>



      {/* INPUT BAR */}

      <div className="p-4 border-t border-white/10 backdrop-blur-lg">


        <div className="flex items-center gap-3


        bg-white/5

        border

        border-white/10

        rounded-full

        px-4 py-2

        shadow-lg">

          <input

            value={input}

            onChange={(e) => setInput(e.target.value)}

            placeholder="Message AI..."

            className="flex-1 bg-transparent outline-none

            text-sm text-white placeholder:text-white/40"

            onKeyDown={(e) => e.key === "Enter" && handleSend()}

          />



          <button

            onClick={handleSend}

            disabled={loading}

            className="

            p-2

            rounded-full

            bg-gradient-to-r

            from-blue-500

            to-indigo-600

            hover:opacity-90

            transition

            "

          >

            <SendHorizonal size={18} />

          </button>


        </div>


      </div>


    </div>

  );

};


export default ChatWithAI;
