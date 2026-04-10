import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { response } from "express";
import { v2 as cloudinary } from 'cloudinary';
import axios from "axios";
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 100) {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt, }],
            temperature: 0.7,
            maxTokens: 1200,

        });
        const content = response.choices[0].message.content;

        await sql` INSERT INTO creation(user_id, prompt, content, type)VALUES(${userId},${prompt},${content},'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }
        res.json({ success: true, content });


    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 100) {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt, }],
            temperature: 0.7,
            maxTokens: 800,
        });


        const content = response.choices[0].message.content;

        await sql` INSERT INTO creation(user_id, prompt, content, type)
        VALUES(${userId},${prompt},${content},'bolg-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }
        res.json({ success: true, content });


    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }

        const formData = new FormData()
        formData.append('prompt', prompt)
        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer',
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image)

        await sql` INSERT INTO creation(user_id, prompt, content, type,publish)
            VALUES(${userId},${prompt},${secure_url},'image',${publish ?? false})`;


        res.json({ success: true, content: secure_url });



    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }



        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background',
                }
            ]
        });

        await sql` INSERT INTO creation(user_id, prompt, content, type)
            VALUES(${userId},'Remove background from image',${secure_url},'image')`;


        res.json({ success: true, content: secure_url });



    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }



        const { public_id, format } = await cloudinary.uploader.upload(image.path)
        const imageUrl = cloudinary.url(`${public_id}.${format}`, {
            transformation: [
                { effect: `gen_remove_object:${object}` },
            ],
            response_type: 'image',
        });



        await sql` INSERT INTO creation(user_id, prompt, content, type)
            VALUES(${userId},${`Removed ${object} from image`},${imageUrl},'image')`;


        res.json({ success: true, content: imageUrl });



    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const resumeReview = async (req, res) => {

    try {

        const { userId } = req.auth();

        const resume = req.file;

        const { jobDescription } = req.body;

        const dataBuffer = fs.readFileSync(resume.path);

        const pdfData = await pdf(dataBuffer);


        const prompt = `
You are an ATS (Applicant Tracking System).

Compare the RESUME with the JOB DESCRIPTION.

Give response in structured format:

1. Match Score (0-100%)
2. Matching Skills
3. Missing Skills
4. Strengths
5. Weaknesses
6. Suggestions to improve resume
7. Keywords to add
8. Final ATS verdict

JOB DESCRIPTION:
${jobDescription}


RESUME:
${pdfData.text.slice(0,12000)}

Give clear professional output.
`;


        const response = await AI.chat.completions.create({

            model: "gemini-2.5-flash",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.3,
            maxTokens: 1500,            

        });


        const content = response.choices[0].message.content;


        await sql`

        INSERT INTO creation(user_id,prompt,content,type)

        VALUES(

        ${userId},

        'resume review with jd',

        ${content},

        'resume-review'

        )

        `;


        res.json({

            success:true,

            content

        });


    }

    catch(error){

        res.json({

            success:false,

            message:error.message

        });

    }

};
export const pdfSummerizer = async (req, res) => {
    try {
        const { userId } = req.auth();
        const pdfSum = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 100) {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }

        if (pdfSum.size > 10 * 1024 * 1024) {
            return res.json({ success: false, message: 'File size exceeds the limit of 10MB.' });
        }

        const dataBuffer = fs.readFileSync(pdfSum.path);
        const pdfData = await pdf(dataBuffer)

        const prompt = `"Summarize the uploaded PDF in detail. 
        Include all major sections, important points, and technical terms if present." ${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [{ role: "user", content: prompt, }],
            temperature: 0.7,
            maxTokens: 1500,
        });

        const content = response.choices[0].message.content;



        const [result] = await sql` 
            INSERT INTO creation(user_id, prompt, content, type)
            VALUES(${userId},'Summary of the uploaded pdf',${content},'pdf-summerizer')
            RETURNING id
        `;

        // Update free usage counter if user is on free plan
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res.json({ success: true, content, pdfId: result.id });



    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

export const generateEmail = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, style } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        // Free Plan Limit Check
        if (plan !== 'premium' && free_usage >= 100) {
            return res.json({
                success: false,
                message: 'Free usage limit exceeded. Upgrade to premium for more requests.'
            });
        }

        // AI Prompt
        const formattedPrompt = `Write an email in a ${style || 'Professional'} tone. 
Here are the details:\n\n${prompt}\n\n
The email should sound natural, polite, and clear.`;


        // AI API Call (Gemini)
        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: formattedPrompt,
                },
            ],
            temperature: 0.7,
            maxTokens: 1200,
        });

        const content = response.choices[0].message.content;

        // Save to Database
        await sql`
            INSERT INTO creation(user_id, prompt, content, type)
            VALUES(${userId}, ${prompt}, ${content}, 'email')
        `;

        // Update Free Usage Counter if user is on Free Plan
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        // Send Response
        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const generateInterviewQuestions = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { jobRole } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 100) {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }

        const formattedPrompt = `
Generate a list of 10 smart, professional interview questions to ask a candidate for the role of "${jobRole}". 
Include both technical and behavioral questions if relevant. Format as a numbered list.
`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: formattedPrompt,
                },
            ],
            temperature: 0.5,
            maxTokens: 600,            
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creation(user_id, prompt, content, type)
            VALUES(${userId}, ${jobRole}, ${content}, 'interview-questions')
        `;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const chatWithRoleAI = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { message } = req.body;
        const plan = req.plan;

        if (!message) {
            return res.json({ success: false, message: 'Please provide a message.' });
        }

        const messages = [
            { role: "system", content: 
                `You are an advanced AI assistant similar to ChatGPT.Your goals:- Provide clear, detailed, and well-structured answers- Explain concepts step-by-step when needed- Give examples to improve understanding
- Use bullet points when helpful
- Keep answers easy to read but informative
- Provide practical insights, not just theory
- When coding is requested, give clean and correct code
- When explanations are requested, simplify complex topics
- When unsure, ask clarifying questions
- Maintain a helpful, professional, and friendly tone

Always try to give complete and meaningful responses rather than very short replies.` },
            { role: "user", content: message }
        ];

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages,
            temperature: 0.7,
            maxTokens: 1000,         

        });

        const reply = response.choices[0].message.content;
        res.json({ success: true, reply });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


export const pdfChatbot = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { message, pdfId, conversationHistory } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 100) {
            return res.json({ success: false, message: 'Free usage limit exceeded. Upgrade to premium for more requests.' });
        }

        if (!message) {
            return res.json({ success: false, message: 'Please provide a message.' });
        }

        if (!pdfId) {
            return res.json({ success: false, message: 'PDF ID is required for context.' });
        }

        // Get the original PDF summary from database
        const [pdfSummary] = await sql`
            SELECT content FROM creation 
            WHERE id = ${pdfId} AND user_id = ${userId} AND type = 'pdf-summerizer'
        `;

        if (!pdfSummary) {
            return res.json({ success: false, message: 'PDF summary not found or access denied.' });
        }

        // Build conversation context
        const systemPrompt = `You are a helpful AI assistant that has access to a summarized PDF document. 
        The user is asking questions about this document. Please answer based on the summary provided.
        If the question cannot be answered from the summary, politely say so.
        
        PDF Summary:
        ${pdfSummary.content}`;

        const messages = [
            { role: "system", content: systemPrompt }
        ];

        // Add conversation history if provided
        if (conversationHistory && Array.isArray(conversationHistory)) {
            conversationHistory.forEach(msg => {
                messages.push({ role: msg.role, content: msg.content });
            });
        }

        // Add current user message
        messages.push({ role: "user", content: message });

        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages,
            temperature: 0.7,
            maxTokens: 800,
        });

        const reply = response.choices[0].message.content;

        // Save the conversation to database
        await sql`
            INSERT INTO creation(user_id, prompt, content, type)
            VALUES(${userId}, ${`PDF Chat: ${message}`}, ${reply}, 'pdf-chat')
        `;

        // Update free usage counter if user is on free plan
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }

        res.json({
            success: true,
            reply,
            conversationId: Date.now() // Simple conversation ID for frontend tracking
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


