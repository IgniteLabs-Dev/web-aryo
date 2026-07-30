"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload, Save, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { useData } from "@/lib/data-provider";

interface Service {
  id: number;
  subject: string;
  name: string;
  category: string;
  description: string;
  detail_description: string;
  icon: string;
  hill_color: string;
  sky_grad: string;
  sheep_x: number;
  sheep_y: number;
  gallery: { id: number; image_url: string }[];
}

const ICONS = ["BarChart3", "Building2", "Code2"];

export default function ServicesAdmin() {
  const { categories, refresh } = useData();
  const serviceCategories = categories.filter((c) => c.type === 'service');

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [galleryService, setGalleryService] = useState<Service | null>(null);

  const load = async () => {
    const data = await fetch("/api/services").then((r) => r.json());
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name || !editing.subject || !editing.category || !editing.description) {
      alert("Please fill all required fields");
      return;
    }
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/services/${editing.id}` : "/api/services";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { 
      setEditing(null); 
      load();
      await refresh(); // refresh global data
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const getDefaultEditing = (): Partial<Service> => ({
    subject: "",
    name: "",
    category: serviceCategories[0]?.name || "",
    description: "",
    detail_description: "",
    icon: "Code2",
    hill_color: "#65a30d",
    sky_grad: "from-sky-100 to-sky-300",
    sheep_x: 50,
    sheep_y: 130,
  });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setEditing(getDefaultEditing())}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold hover:bg-brand-yellow-dark active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Warning kalau belum ada category */}
      {serviceCategories.length === 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-semibold text-sm">No service categories yet</p>
            <p className="text-amber-300/80 text-xs mt-1">
              Please add categories first at{" "}
              <a href="/secret-admin/categories" className="underline">Categories menu</a>
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-[#0a1729]/30">
          <p className="text-slate-400">No services yet. Click "Add Service" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl bg-[#0a1729] border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="text-[10px] font-semibold tracking-wider text-brand-yellow uppercase">{s.category}</span>
                  <span className="text-[10px] text-slate-500">·</span>
                  <span className="text-[10px] text-slate-500">{s.subject}</span>
                </div>
                <h3 className="text-white font-bold">{s.name}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> {s.gallery?.length || 0}/3 images</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2">
                <button onClick={() => setGalleryService(s)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium">Gallery</button>
                <button onClick={() => setEditing(s)} className="px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium flex items-center gap-1 justify-center"><Edit2 className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(s.id)} className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium flex items-center gap-1 justify-center"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-xl font-bold text-white mb-6">{editing.id ? "Edit Service" : "Add Service"}</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <Field label="Subject *" value={editing.subject || ""} onChange={(v) => setEditing({ ...editing, subject: v })} placeholder="e.g. Web Development" />
            <Field label="Name *" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} />
            
            {/* Category - DINAMIS dari DB */}
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Category *</label>
              <select
                value={editing.category || ""}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none"
              >
                <option value="">-- Select category --</option>
                {serviceCategories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {serviceCategories.length === 0 && (
                <p className="text-xs text-amber-400 mt-1">⚠ Add categories in Categories menu first.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Description *</label>
              <textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Detail Description (longer text)</label>
              <textarea rows={5} value={editing.detail_description || ""} onChange={(e) => setEditing({ ...editing, detail_description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Icon</label>
                <select value={editing.icon || "Code2"} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-100 outline-none">
                  {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <Field label="Hill Color" value={editing.hill_color || ""} onChange={(v) => setEditing({ ...editing, hill_color: v })} placeholder="#65a30d" />
            </div>
            <Field label="Sky Gradient (Tailwind)" value={editing.sky_grad || ""} onChange={(v) => setEditing({ ...editing, sky_grad: v })} placeholder="from-sky-100 to-sky-300" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sheep X" value={String(editing.sheep_x ?? 50)} onChange={(v) => setEditing({ ...editing, sheep_x: Number(v) })} />
              <Field label="Sheep Y" value={String(editing.sheep_y ?? 130)} onChange={(v) => setEditing({ ...editing, sheep_y: Number(v) })} />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
        </Modal>
      )}

      {/* Gallery Manager Modal */}
      {galleryService && <GalleryModal service={galleryService} onClose={() => setGalleryService(null)} onUpdate={load} />}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a1729] border border-slate-800 rounded-2xl p-6 overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none" />
    </div>
  );
}

function GalleryModal({ service, onClose, onUpdate }: { service: Service; onClose: () => void; onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [localGallery, setLocalGallery] = useState(service.gallery || []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localGallery.length >= 3) {
      alert("Maximum 3 images per service");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/upload", { method: "POST", body: fd });
    const upData = await upRes.json();
    if (upRes.ok && upData.url) {
      const res = await fetch(`/api/services/${service.id}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: upData.url }),
      });
      if (res.ok) {
        const refresh = await fetch(`/api/services/${service.id}`).then((r) => r.json());
        setLocalGallery(refresh.gallery);
        onUpdate();
      }
    } else {
      alert(upData.error || "Upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("Delete this image?")) return;
    const res = await fetch(`/api/services/${service.id}/gallery?imageId=${imageId}`, { method: "DELETE" });
    if (res.ok) {
      setLocalGallery((prev) => prev.filter((g) => g.id !== imageId));
      onUpdate();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0a1729] border border-slate-800 rounded-2xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
        <h2 className="text-xl font-bold text-white mb-2">Gallery — {service.name}</h2>
        <p className="text-sm text-slate-500 mb-4">Max 3 images · {localGallery.length}/3</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {localGallery.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-video">
              <img src={img.image_url} className="w-full h-full object-cover" />
              <button onClick={() => handleDelete(img.id)} className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {localGallery.length < 3 && (
            <label className="aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-brand-yellow flex flex-col items-center justify-center text-slate-500 hover:text-brand-yellow cursor-pointer transition-colors">
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs">{uploading ? "Uploading..." : "Upload"}</span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium">Done</button>
      </div>
    </div>
  );
}
