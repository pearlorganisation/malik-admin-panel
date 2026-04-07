"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useCreatePageMutation } from "@/features/page/pageApi";
import { 
  Save, 
  Globe, 
  Settings, 
  Search, 
  ArrowLeft, 
  Eye, 
  FileText,
  Type
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Dynamic Import for React Quill New (SSR safe for Next.js)
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-50 animate-pulse rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium">
      Loading Editor Content Builder...
    </div>
  )
});

// Import styles for the editor
import "react-quill-new/dist/quill.snow.css";

export default function CreateDynamicPage() {
  const router = useRouter();
  const [createPage, { isLoading }] = useCreatePageMutation();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "Published",
    seo: {
      metaTitle: "",
      metaDescription: ""
    }
  });

  // Slug auto-generation logic
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces with -
      .replace(/^-+|-+$/g, ""); // Trim dashes

    setFormData({
      ...formData,
      title: val,
      slug: generatedSlug,
      seo: { ...formData.seo, metaTitle: val }
    });
  };

  const handleSave = async () => {
    // Validations
    if (!formData.title) return toast.error("Page Title is required");
    if (!formData.content || formData.content === "<p><br></p>") return toast.error("Page content cannot be empty");
    if (!formData.slug) return toast.error("URL Slug is required");

    try {
      const response = await createPage(formData).unwrap();
      if (response.success) {
        toast.success("Page published successfully!");
        router.push("/admin/pages");
      }
    } catch (err) {
      console.error("Save Error:", err);
      toast.error(err?.data?.message || "Failed to publish page");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Create Dynamic Page</h1>
              <p className="text-slate-500 text-sm font-medium">Design professional web pages for your platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={handleSave}
               disabled={isLoading}
               className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-[14px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
             >
               {isLoading ? <span className="animate-pulse">Publishing...</span> : <><Save size={16} /> Publish Page</>}
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* MAIN EDITOR COLUMN */}
          <div className="space-y-6">
            
            {/* Title Input Card */}
            <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-200">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
                <Type size={14} /> Page Heading
              </label>
              <input 
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Terms of Service or About Us"
                className="w-full text-2xl font-bold border-none focus:ring-0 placeholder:text-slate-200 p-0"
              />
            </div>

            {/* Content Builder Card */}
            <div className="bg-white rounded-[28px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Content Designer</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-[9px] font-black text-blue-600 uppercase">Live Editor</span>
                </div>
              </div>
              
              <div className="quill-container">
                <ReactQuill 
                  theme="snow"
                  value={formData.content}
                  onChange={(val) => setFormData({...formData, content: val})}
                  modules={quillModules}
                  placeholder="Start typing your page content here..."
                />
              </div>
            </div>
          </div>

          {/* SIDEBAR SETTINGS COLUMN */}
          <div className="space-y-6 lg:sticky lg:top-8">
            
            {/* Page Configuration */}
            <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-200">
               <h3 className="flex items-center gap-2 text-xs font-black uppercase text-slate-900 mb-5 border-b border-slate-50 pb-4">
                 <Settings size={16} className="text-slate-400" /> Configuration
               </h3>
               
               <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">URL Slug</label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                       <Globe size={14} className="text-slate-300" />
                       <span className="text-slate-400 text-xs font-medium">/</span>
                       <input 
                         type="text" 
                         value={formData.slug}
                         onChange={(e) => setFormData({...formData, slug: e.target.value})}
                         className="bg-transparent border-none p-0 text-xs font-bold text-blue-600 focus:ring-0 w-full"
                       />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Visibility</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-700 py-3 px-4 focus:ring-slate-200"
                    >
                      <option value="Published">Published (Public)</option>
                      <option value="Draft">Draft (Private)</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* SEO Preview Card */}
            <div className="bg-slate-900 p-7 rounded-[28px] shadow-2xl text-white overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Search size={80} />
               </div>
               
               <h3 className="flex items-center gap-2 text-xs font-black uppercase text-blue-400 mb-5 relative z-10">
                 <Eye size={16} /> Search Preview
               </h3>
               
               <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                    <div className="text-[#8ab4f8] text-lg font-medium hover:underline cursor-pointer leading-tight line-clamp-1">
                      {formData.seo.metaTitle || "Enter Page Title"}
                    </div>
                    <div className="text-[#34a853] text-xs font-medium flex items-center gap-1">
                      fun-tours.com › pages › <span className="text-[#bdc1c6]">{formData.slug || "url"}</span>
                    </div>
                  </div>
                  
                  <textarea 
                    placeholder="Brief description for Google Search results..."
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 placeholder:text-slate-600 focus:ring-blue-500 focus:border-blue-500 p-3 min-h-[90px] resize-none"
                  />
                  <p className="text-[10px] text-slate-500 font-medium italic">* This is how your page appears on Google.</p>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* CUSTOM STYLES FOR QUILL */}
      <style dangerouslySetInnerHTML={{__html: `
        .quill-container .ql-container.ql-snow {
          border: none !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 15px !important;
          min-height: 380px;
        }
        .quill-container .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          background: #f8fafc !important;
          padding: 12px !important;
        }
        .quill-container .ql-editor {
          padding: 30px !important;
          line-height: 1.6 !important;
        }
        .quill-container .ql-editor.ql-blank::before {
          color: #cbd5e1 !important;
          font-style: normal !important;
        }
      `}} />
    </div>
  );
}

// Toolset Configuration for the Editor
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};