"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Loader2, FileText, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const TONES = [
  { value: "professional", label: "Professional", emoji: "👔" },
  { value: "enthusiastic", label: "Enthusiastic", emoji: "🔥" },
  { value: "concise", label: "Concise", emoji: "⚡" },
];

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [tone, setTone] = useState("professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const generate = async () => {
    if (!resume.trim() || !jobDesc.trim()) {
      toast.error("Please fill in both your resume and job description!");
      return;
    }

    setLoading(true);
    setCoverLetter("");

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8002";
      const res = await fetch(`${BACKEND_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          job_description: jobDesc,
          tone,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setCoverLetter(data.cover_letter);
      setWordCount(data.word_count);
      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate. Is Ollama running?");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">CoverCraft AI</h1>
            <p className="text-slate-400 text-xs mt-0.5">Powered by Llama3</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/30">
              Free & Local
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">
            Generate Cover Letters{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              That Get Interviews
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Paste your resume and job description. Get a tailored, professional cover letter in seconds.
          </p>
        </div>

        {/* Tone Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                tone === t.value
                  ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Resume Input */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-violet-400" />
              <label className="text-slate-200 font-semibold text-sm">Your Resume</label>
              <span className="ml-auto text-xs text-slate-500">{resume.length} chars</span>
            </div>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here...&#10;&#10;Include: skills, experience, education, achievements"
              className="w-full h-72 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 resize-none transition-colors"
            />
          </div>

          {/* Job Description Input */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-pink-400" />
              <label className="text-slate-200 font-semibold text-sm">Job Description</label>
              <span className="ml-auto text-xs text-slate-500">{jobDesc.length} chars</span>
            </div>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here...&#10;&#10;Include: role, requirements, company info, responsibilities"
              className="w-full h-72 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:border-pink-500 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={generate}
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl shadow-xl shadow-violet-500/25 transition-all flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating with Llama3...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output */}
        {coverLetter && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-slate-200 font-semibold">Generated Cover Letter</span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {wordCount} words
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm rounded-xl transition-all"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-green-400" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy</>
                )}
              </button>
            </div>
            <div className="bg-slate-950/50 border border-slate-700 rounded-xl p-6">
              <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {coverLetter}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}