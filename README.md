# 🚀 Quick.ai – AI-Powered SaaS Productivity Platform

Quick.ai is a powerful AI SaaS platform that integrates multiple generative tools into one seamless experience — from AI article writing to PDF summarization, image generation, resume review, and real-time AI chat using **Gemini LLM**.

> 🔒 Powered by Clerk for authentication and Stripe for billing.  
> 🎨 Built with React, Node.js, TailwindCSS, and deployed on Vercel + Render.

---

## ✨ Features

- 📄 **PDF Summarizer** – Upload a PDF, get concise summaries powered by Gemini LLM
- 💬 **AI Chatbot** – Talk to AI using real-time responses (LLM: Gemini)
- 📝 **Blog Title & Article Generator** – Instantly generate SEO-optimized blog content
- 📧 **AI Email Writer** – Smart email generation for various use cases
- 🧠 **Resume Reviewer & Interview Questions** – HR-ready resume analysis and question generation
- 🎨 **AI Image Generator** – Uses **ClipDrop API** to generate high-quality images from prompts
- 🧼 **Background Remover** – Uses **Cloudinary API** to clean image backgrounds
- 🔐 **Auth & Subscription** – Clerk-based login system and Stripe premium billing
- 📊 **Modern UI** – Responsive, dark/light mode enabled, built with TailwindCSS + Framer Motion

---

## 🧪 Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | React.js, TailwindCSS, Framer Motion, Lucide |
| Backend     | Node.js (Express)                            |
| AI Model    | Gemini (Google Generative AI)                |
| Image API   | ClipDrop (Image Generation)                  |
| Media API   | Cloudinary (Background Removal)              |
| Auth & Billing | Clerk, Stripe                            |
| Database    | PostgreSQL (via Neon)                        |
| Testing     | Postman                                      |
| Deployment  | Vercel (frontend), Render (backend)          |

---

Try Now : **https://quick-ai-client.vercel.app/**

---

## 📦 Local Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL DB (e.g., Neon)
- Cloudinary & ClipDrop API keys
- Gemini API key from Google AI Studio

### Clone & Install

```bash
git clone https://github.com/your-username/quick-ai.git
cd quick-ai
npm install
