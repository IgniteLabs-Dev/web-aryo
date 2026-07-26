"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload, Save, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { useData } from "@/lib/data-provider";

interface Project {
  id: number;
  name: string;
  category: string;
  it_sub_category: string;
  description: string;
  tags: string[];
  sky_grad: string;
  hill_colors: string[];
  gallery: { id: number; image_url: string }[];
}

export default function ProjectsAdmin() {
  const { categories, refresh } = useData();
  const projectCategories = categories.filter((c) => c.type === 'project');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);

  const load = async () => {
    const data = await fetch("/api/projects").then((r) => r.json());
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name || !editing.category || !editing.description) {
      alert("Please fill all required fields");
      return;
    }
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/projects/${editing.id}` : "/api/projects";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { 
      setEditing(null); 
      load();
      await refresh();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const getDefaultEditing = (): Partial<Project> => ({
    name: "",
    category: projectCategories[0]?.name || "",
    it_sub_category: "",
    description: "",
    tags: [],
    sky_grad: "from-sky-200 to-sky-400",
    hill_colors: ["#a3e635", "#65a30d"],
  });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setEditing(getDefaultEditing())}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {projectCategories.length === 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-semibold text-sm">No project categories yet</p>
            <p className="text-amber-300/80 text-xs mt-1">
              Please add categories first at{" "}
              <a href="/secret-admin/categories" className="underline">Categories menu</a>
            </p>
          </div>
        </div>
      )}

      {loading ? <div className="text-slate-500">Loading...</div> : projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl"><p className="text-slate-400">No projects yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-[#0a1729] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{t}</span>)}
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-brand-yellow uppercase">{p.category}</span>
                <h3 className="text-white font-bold mt-1">{p.name}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> {p.gallery?.length || 0} images</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setGalleryProject(p)} className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs">Gallery</button>
                <button onClick={() => setEditing(p)} className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-xs"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-2 rounded-lg bg-red-600/20 text-red-400 text-xs"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2 className="text-xl font-bold text-white mb-6">{editing.id ? "Edit Project" : "Add Project"}</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <Field label="Project Name *" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} />
            
            <div className="grid grid-cols-2 gap-3">
              {/* Category - DINAMIS dari DB */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Category *</label>
                <select
                  value={editing.category || ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-100 outline-none"
                >
                  <option value="">-- Select --</option>
                  {projectCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Field label="IT Sub Category" value={editing.it_sub_category || ""} onChange={(v) => setEditing({ ...editing, it_sub_category: v })} placeholder="Optional" />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Description *</label>
              <textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none resize-none" />
            </div>
            <Field label="Tags (comma separated)" value={editing.tags?.join(",") || ""} onChange={(v) => setEditing({ ...editing, tags: v.split(",").map(t => t.trim()).filter(Boolean) })} placeholder="IT, WebDev" />
            <Field label="Sky Gradient" value={editing.sky_grad || ""} onChange={(v) => setEditing({ ...editing, sky_grad: v })} placeholder="from-sky-200 to-sky-400" />
            <Field label="Hill Colors (hex, comma separated)" value={editing.hill_colors?.join(",") || ""} onChange={(v) => setEditing({ ...editing, hill_colors: v.split(",").map(c => c.trim()).filter(Boolean) })} placeholder="#a3e635, #65a30d" />
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
        </Modal>
      )}

      {galleryProject && <ProjectGalleryModal project={galleryProject} onClose={() => setGalleryProject(null)} onUpdate={load} />}
    </div>
  );
}

function Modal({ children, onClose }: any) {
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

function Field({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none" />
    </div>
  );
}

function ProjectGalleryModal({ project, onClose, onUpdate }: { project: Project; onClose: () => void; onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [localGallery, setLocalGallery] = useState(project.gallery || []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/upload", { method: "POST", body: fd });
    const upData = await upRes.json();
    if (upRes.ok && upData.url) {
      const res = await fetch(`/api/projects/${project.id}/gallery`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: upData.url }),
      });
      if (res.ok) {
        const refresh = await fetch(`/api/projects/${project.id}`).then((r) => r.json());
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
    if (!confirm("Delete image?")) return;
    const res = await fetch(`/api/projects/${project.id}/gallery?imageId=${imageId}`, { method: "DELETE" });
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
        <h2 className="text-xl font-bold text-white mb-2">Gallery — {project.name}</h2>
        <p className="text-sm text-slate-500 mb-4">{localGallery.length} images</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {localGallery.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-video">
              <img src={img.image_url} className="w-full h-full object-cover" />
              <button onClick={() => handleDelete(img.id)} className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          <label className="aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-brand-yellow flex flex-col items-center justify-center text-slate-500 hover:text-brand-yellow cursor-pointer">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">{uploading ? "Uploading..." : "Upload"}</span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300">Done</button>
      </div>
    </div>
  );
}
