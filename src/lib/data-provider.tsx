'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Service {
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

export interface Project {
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

export interface PubCer {
  id: number;
  type: 'Publication' | 'Certification' | 'Patent' | 'Others';
  date: string;
  name: string;
  id_journal_issuer: string;
  url: string;
}

export interface General {
  status_note: string;
  about_name: string;
  about_title: string;
  about_description: string;
  contact_email: string;
  contact_linkedin: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'service' | 'project' | 'pub_cer';
  sort_order: number;
}

interface DataContextType {
  general: General | null;
  services: Service[];
  projects: Project[];
  pubCer: PubCer[];
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [general, setGeneral] = useState<General | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pubCer, setPubCer] = useState<PubCer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [g, s, p, pc, cat] = await Promise.all([
        fetch('/api/general').then((r) => r.json()),
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/pub-cer').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);

      setGeneral(g);
      setServices(Array.isArray(s) ? s : []);
      setProjects(Array.isArray(p) ? p : []);
      setPubCer(Array.isArray(pc) ? pc : []);
      setCategories(Array.isArray(cat) ? cat : []);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <DataContext.Provider value={{ general, services, projects, pubCer, categories, loading, refresh: fetchAll }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
