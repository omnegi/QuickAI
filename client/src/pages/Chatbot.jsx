import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { SendHorizonal, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";



const suggestions = [

  "Explain quantum computing",

  "Write a Python script to sort a list",

  "What's the weather like today?",

  "Summarize a PDF document"

];



const ChatWithAI = () => {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const chatRef = useRef(null);



  const sendMessage = async (text) => {

    if (!text.trim()) return;

    const userMessage = {

      role: "user",

      content: text

    };

    setMessages(prev => [...prev, userMessage]);

    setInput("");

    setLoading(true);



    try {

      const { data } = await axios.post(

        "/api/ai/generate-chatbot",

        { message: text },

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

      toast.error("Error generating response");

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


      {/* CHAT AREA */}

      <div

        ref={chatRef}

        className="flex-1 overflow-y-auto px-4 py-6"

      >



        {

          messages.length === 0 && (

            <div className="flex flex-col items-center justify-center mt-32 gap-6 text-center">


              <div className="p-3 rounded-full

              bg-white/5

              border border-white/10

              backdrop-blur-lg">

                <Sparkles size={22} />

              </div>



              <h1 className="text-2xl font-semibold text-white/90">

                How can I help you today?

              </h1>



              {/* Suggestion Buttons */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full max-w-xl">


                {

                  suggestions.map((item, i) => (

                    <button

                      key={i}

                      onClick={() => sendMessage(item)}

                      className="text-left px-4 py-3 rounded-xl

                      bg-white/5

                      border border-white/10

                      hover:bg-white/10

                      transition

                      text-sm"

                    >

                      {item}

                    </button>

                  ))

                }


              </div>



            </div>

          )

        }



        {/* Messages */}



        <div className="space-y-6 mt-6">


          {

            messages.map((msg, index) => (

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

            ))

          }



          {

            loading && (

              <p className="text-white/40 text-sm">

                AI is typing...

              </p>

            )

          }


        </div>


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

            placeholder="Message ChatBot..."

            className="flex-1 bg-transparent outline-none

            text-sm text-white placeholder:text-white/40"

            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}

          />



          <button

            onClick={() => sendMessage(input)}

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


        <p className="text-xs text-center text-white/30 mt-2">

          ChatBot can make mistakes. Verify important information.

        </p>


      </div>


    </div>

  );

};


export default ChatWithAI;
