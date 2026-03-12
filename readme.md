# CoverCraft AI 🚀

> Generate tailored, professional cover letters instantly using AI — runs 100% locally.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![Ollama](https://img.shields.io/badge/Ollama-llama3-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

## ✨ Features
- 📄 Paste resume + job description → get tailored cover letter
- 🎭 Three tone modes: Professional, Enthusiastic, Concise
- ⚡ Runs 100% locally — no API keys, no cost
- 📋 One-click copy to clipboard
- 🌙 Beautiful dark UI

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| AI | Ollama + Llama3 (local) |
| Deployment | Vercel + Railway |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.11+, Ollama installed

### 1. Start Ollama
```bash
ollama serve &
ollama pull llama3
```

### 2. Backend
```bash
cd backend
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

### 3. Frontend
```bash
cd frontend
npm install && npm run dev
```

Open http://localhost:3000 🎉

## 📸 Screenshots
_Add screenshots here after running_

## 🤝 Contributing
PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License
MIT © Pagadala Teja Prakash
