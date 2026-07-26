"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, CheckCircle, Clock, User } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    const data = await fetch("/api/messages").then((r) => r.json());
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (m: Message) => {
    await fetch(`/api/messages/${m.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !m.is_read }),
    });
    load();
    if (selected?.id === m.id) setSelected({ ...selected, is_read: !m.is_read ? 1 : 0 });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-slate-500 text-sm mt-1">Messages from the contact form</p>
      </div>

      {loading ? <div className="text-slate-500">Loading...</div> : messages.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl"><p className="text-slate-400">No messages yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); if (!m.is_read) toggleRead(m); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === m.id ? "bg-[#0a1729] border-brand-yellow/50" : "bg-[#0a1729]/50 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm flex items-center gap-2">
                    {!m.is_read && <span className="w-2 h-2 rounded-full bg-brand-yellow" />}
                    {m.name}
                  </span>
                  {m.is_read ? <CheckCircle className="w-3.5 h-3.5 text-slate-500" /> : <Clock className="w-3.5 h-3.5 text-brand-yellow" />}
                </div>
                <p className="text-xs text-slate-400 truncate">{m.subject || m.message}</p>
                <p className="text-[10px] text-slate-500 mt-1">{new Date(m.created_at).toLocaleString()}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-[#0a1729] border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><User className="w-5 h-5" /> {selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-brand-yellow hover:underline">{selected.email}</a>
                    {selected.phone && <p className="text-sm text-slate-400">{selected.phone}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRead(selected)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Toggle read">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(selected.id)} className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selected.subject && (
                  <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Subject</span>
                    <p className="text-white font-medium">{selected.subject}</p>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-4">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">Message</span>
                  <p className="text-slate-200 mt-2 whitespace-pre-line leading-relaxed">{selected.message}</p>
                </div>
                <p className="text-xs text-slate-500 mt-4">Received: {new Date(selected.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <div className="bg-[#0a1729]/30 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
