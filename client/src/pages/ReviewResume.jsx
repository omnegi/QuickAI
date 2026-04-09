import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();


  const onSubmitHandler = async (e) => {

    e.preventDefault();

    if (!input) {
      toast.error("Please upload resume");
      return;
    }

    if (!jobDescription) {
      toast.error("Please paste Job Description");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("resume", input);

      formData.append("jobDescription", jobDescription);

      const token = await getToken();

      const { data } = await axios.post(

        "/api/ai/resume-review",

        formData,

        {

          headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "multipart/form-data"

          }

        }

      );

      console.log("ATS RESPONSE:", data);

      if (data?.success) {

        setContent(data?.content || "No analysis generated");

      }

      else {

        toast.error(data?.message || "Something went wrong");

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Error analyzing resume");

    }

    finally {

      setLoading(false);

    }

  };



  return (

    <div className="p-6 h-full overflow-y-auto flex items-start flex-wrap gap-4 text-slate-700">


      {/* FORM */}

      <form

        onSubmit={onSubmitHandler}

        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"

      >

        <div className="flex items-center gap-3">

          <Sparkles className="w-6 text-[#00DA83]" />

          <h1 className="text-xl font-semibold">

            Resume Review (ATS)

          </h1>

        </div>



        {/* Resume Upload */}

        <p className="mt-6 text-sm font-medium">

          Upload Resume

        </p>

        <input

          onChange={(e) => setInput(e.target.files[0])}

          type="file"

          accept="application/pdf"

          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"

          required

        />

        <p className="text-sm text-gray-500 font-light mt-1">

          Supports PDF resume only

        </p>



        {/* JD Input */}

        <p className="mt-6 text-sm font-medium">

          Paste Job Description

        </p>

        <textarea

          value={jobDescription}

          onChange={(e) => setJobDescription(e.target.value)}

          rows={7}

          placeholder="Paste Job Description here..."

          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 resize-none"

          required

        />



        {/* Submit Button */}

        <button

          disabled={loading}

          className="w-full flex justify-center items-center gap-2

          bg-gradient-to-r from-[#00DA83] to-[#009BB3]

          text-white px-4 py-2 mt-6

          text-sm rounded-lg cursor-pointer"

        >

          {

            loading

              ?

              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>

              :

              <FileText className="w-5" />

          }

          Review Resume

        </button>

      </form>




      {/* RESULT PANEL */}

      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-[400px] max-h-[650px]">


        <div className="flex items-center gap-3">

          <FileText className="w-5 h-5 text-[#00DA83]" />

          <h1 className="text-xl font-semibold">

            ATS Analysis

          </h1>

        </div>



        {


          loading ? (

            <div className="flex-1 flex justify-center items-center">

              <p className="text-gray-400 text-sm">

                Analyzing resume with ATS...

              </p>

            </div>

          )


          : !content ? (

            <div className="flex-1 flex justify-center items-center">

              <div className="text-sm text-gray-400 gap-5 flex flex-col items-center">

                <FileText className="w-9 h-9" />

                <p>

                  Upload resume + paste JD to see ATS score

                </p>

              </div>

            </div>

          )


          : (

            <div className="mt-3 h-full overflow-y-auto whitespace-pre-wrap text-sm text-slate-700 pr-2">

              <Markdown remarkPlugins={[remarkGfm]}>

                {content}

              </Markdown>

            </div>

          )

        }


      </div>



    </div>

  );

};


export default ReviewResume;
