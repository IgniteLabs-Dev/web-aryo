"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

export default function GeneralPage() {
  const [data, setData] = useState({ status_note: "", about_name: "", about_title: "", about_description: "", contact_email: "", contact_linkedin: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/general").then((r) => r.json()).then((d) => { setData(d); setLoading(false); });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const res = await fetch("/api/general", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setStatus({ type: "success", message: "Saved successfully!" });
    else setStatus({ type: "error", message: "Failed to save" });
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="p-8 lg:p-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-1">General Settings</h1>
      <p className="text-slate-500 text-sm mb-8">Manage status note, About Me, and contact links.</p>

      <form onSubmit={handleSave} className="space-y-6 bg-[#0a1729] border border-slate-800 rounded-2xl p-6">
        {status && (
          <div className={`flex items-center space-x-2 p-3 rounded-xl text-sm border ${status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
            {status.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{status.message}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
            Status Note (max 60 chars) <span className="text-slate-600">— {data.status_note.length}/60</span>
          </label>
          <input
            type="text" value={data.status_note} maxLength={60}
            onChange={(e) => setData({ ...data, status_note: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none"
            placeholder="Available for freelance work"
          />
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">About Me</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Name</label>
              <input type="text" value={data.about_name} onChange={(e) => setData({ ...data, about_name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Title / Role</label>
              <input type="text" value={data.about_title} onChange={(e) => setData({ ...data, about_title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Description (pisahkan paragraf dengan baris kosong)</label>
              <textarea rows={8} value={data.about_description} onChange={(e) => setData({ ...data, about_description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Email URL (mailto: atau link)</label>
              <input type="text" value={data.contact_email} onChange={(e) => setData({ ...data, contact_email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">LinkedIn URL</label>
              <input type="text" value={data.contact_linkedin} onChange={(e) => setData({ ...data, contact_linkedin: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-yellow hover:bg-brand-yellow-dark disabled:bg-slate-700 text-[#030c17] font-bold active:scale-95 transition-all">
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </form>
    </div>
  );
}
