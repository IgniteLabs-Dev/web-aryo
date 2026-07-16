"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    // Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields (Name, Email, Message)."
      });
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address."
      });
      setLoading(false);
      return;
    }

    // Simulate API Submission
    setTimeout(() => {
      setStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully."
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <section id="contact" className="relative w-full bg-black py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden">


      <div className="max-w-6xl mx-auto w-full z-20">
        
        {/* Header Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-12">
          <span className="text-sm font-semibold tracking-widest text-brand-yellow uppercase">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
            Lets Connect
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="col-span-1 lg:col-span-7 bg-[#050b14] border border-slate-900 rounded-3xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Form Status Messages */}
              {status.type && (
                <div 
                  className={`flex items-center space-x-2.5 p-4 rounded-xl text-sm border ${
                    status.type === "success" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  } animate-fade-in`}
                >
                  {status.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span>{status.message}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Full Name <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 placeholder-slate-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Email Address <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 placeholder-slate-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+6281234567890"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 placeholder-slate-500 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 placeholder-slate-500 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Message <span className="text-brand-yellow">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-brand-yellow hover:bg-brand-yellow-dark disabled:bg-slate-700 text-[#030c17] font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
                {!loading && <Send className="w-4 h-4" />}
              </button>

            </form>
          </div>

          {/* Right Column: Direct Connections */}
          <div className="col-span-1 lg:col-span-5 flex flex-col space-y-6">
            <p className="text-slate-300 font-light leading-relaxed text-base sm:text-lg text-center lg:text-left">
              Have a project in mind or want to discuss opportunities? Or is it just venting? Reach out through the form or connect directly. You are matter!
            </p>

            {/* WhatsApp Connect Card */}
            <a
              href="https://wa.me/6281391024566"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-900/40 hover:border-emerald-600 transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-emerald-950/10 group"
            >
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" stroke="none">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.666.988 3.311 1.485 5.352 1.486 5.517 0 10.005-4.487 10.008-10.006.002-2.673-1.042-5.186-2.942-7.088-1.9-1.9-4.417-2.945-7.089-2.946-5.522 0-10.014 4.488-10.017 10.008-.001 2.052.502 3.687 1.493 5.352l-.995 3.633 3.73-.979zm11.167-7.22c-.302-.15-1.787-.88-2.063-.98-.276-.1-.478-.15-.678.15-.2.3-.778.98-.95 1.177-.172.196-.343.22-.644.07-1.129-.566-1.897-1.008-2.671-2.333-.205-.353-.205-.606-.054-.756.136-.135.302-.35.453-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.526-.075-.15-.678-1.632-.93-2.24-.244-.587-.492-.507-.678-.517-.172-.01-.37-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.787-.73 2.039-1.436.252-.706.252-1.312.176-1.436-.076-.124-.276-.2-.578-.35z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">WhatsApp</span>
                <span className="text-base sm:text-lg font-bold text-white mt-0.5">+6281391024566</span>
              </div>
            </a>

            {/* LinkedIn Connect Card */}
            <a
              href="https://www.linkedin.com/in/aryo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-5 rounded-2xl bg-blue-950/40 hover:bg-blue-950/70 border border-blue-900/40 hover:border-blue-600 transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-blue-950/10 group"
            >
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" stroke="none">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">LinkedIn</span>
                <span className="text-base sm:text-lg font-bold text-white mt-0.5">Connect with me</span>
              </div>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
