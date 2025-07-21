import { Mail, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateGmail = () => {

  const emailStyles = ['Professional', 'Formal', 'Casual', 'Friendly', 'Cold Outreach'];

  const [selectedStyle, setSelectedStyle] = useState('Professional');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an email in a ${selectedStyle} tone. Details:\n\n${input}\n\nThe email should sound natural and polite.`;

      const { data } = await axios.post('/api/ai/generate-email', { prompt }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Failed to generate email');
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className='p-6 h-full overflow-y-scroll flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200' action="">
        <div className='flex items-center gap-3 '>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Email Configuration</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Email Details</p>
        <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={5} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='E.g., Follow-up email for a job interview' required />

        <p className='mt-4 text-sm font-medium'>Tone / Style</p>
        <div className='mt-3 flex items-center gap-3 flex-wrap sm:max-w-9/11'>
          {emailStyles.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 border-gray-300'
                }`}
              key={item}
            >{item}</span>
          ))}
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2
bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6
text-sm rounded-lg cursor-pointer'>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Mail className='w-5' />}
          Generate Email
        </button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3 '>
          <Mail className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Email</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm text-gray-400 gap-5 flex flex-col items-center'>
              <Mail className='w-9 h-9 ' />
              <p>Enter your details and click "Generate Email" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
            <div className='reset-tw'>
              <Markdown>
                {content}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateGmail;
