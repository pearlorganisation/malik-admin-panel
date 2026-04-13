"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  useCreatePageMutation, 
  useUpdatePageMutation, 
  useGetPageBySlugQuery 
} from "@/features/page/pageApi";
import { Save, Globe, Settings, Search, ArrowLeft, Eye, FileText, Type, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-50 animate-pulse rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">Loading Editor...</div>
});

import "react-quill-new/dist/quill.snow.css";

export default function ManagePage() {
  const router = useRouter();
  const { slug: editSlug } = useParams(); // URL se slug uthayega agar edit mode hai to
  
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  const { data: existingPageData, isLoading: isFetching } = useGetPageBySlugQuery(editSlug, { skip: !editSlug });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "Published",
    seo: { metaTitle: "", metaDescription: "" }
  });

  // Populate data when editing
  useEffect(() => {
    if (existingPageData?.data) {
      setFormData(existingPageData.data);
    }
  }, [existingPageData]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      // Sirf create mode mein slug auto-generate karein, edit mein SEO bigad sakta hai
      slug: editSlug ? prev.slug : val.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, ""),
      seo: { ...prev.seo, metaTitle: val }
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.slug) {
        return toast.error("Please fill all mandatory fields");
    }

    try {
      if (editSlug) {
        await updatePage({ id: formData._id, ...formData }).unwrap();
        toast.success("Page updated successfully!");
      } else {
        await createPage(formData).unwrap();
        toast.success("Page published successfully!");
      }
      router.push("/admin/pages");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  if (isFetching) return <div className="p-20 text-center font-bold text-slate-400">Loading Page Data...</div>;

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/50 p-4 rounded-3xl backdrop-blur-sm sticky top-4 z-50 border border-white shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                {editSlug ? "Edit Dynamic Page" : "Create Dynamic Page"}
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                 <Sparkles size={12} className="text-blue-500" /> Web Builder Engine
              </p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[2px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {isCreating || isUpdating ? <span className="animate-pulse">Processing...</span> : <><Save size={16} /> {editSlug ? "Update Changes" : "Publish Page"}</>}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          
          {/* LEFT: CONTENT AREA */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200/60">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[2px]">
                <Type size={14} /> Page Title
              </label>
              <input 
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter a catchy title..."
                className="w-full text-4xl font-black border-none focus:ring-0 placeholder:text-slate-100 p-0"
              />
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[2px] flex items-center gap-2">
                    <FileText size={14} /> Content Designer
                </span>
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter text-nowrap">Auto-save Ready</span>
                </div>
              </div>
              <div className="quill-container">
                <ReactQuill 
                  theme="snow"
                  value={formData.content}
                  onChange={(val) => setFormData({...formData, content: val})}
                  modules={quillModules}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: SETTINGS & SEO */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200/60">
               <h3 className="text-[11px] font-black uppercase text-slate-900 mb-6 flex items-center gap-2 tracking-widest">
                 <Settings size={16} className="text-blue-500" /> Configuration
               </h3>
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Permalink / Slug</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl focus-within:border-blue-500 transition-colors">
                       <Globe size={14} className="text-slate-300" />
                       <span className="text-slate-400 text-xs">/</span>
                       <input 
                         type="text" 
                         value={formData.slug}
                         onChange={(e) => setFormData({...formData, slug: e.target.value})}
                         className="bg-transparent border-none p-0 text-xs font-bold text-slate-700 focus:ring-0 w-full"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Visibility Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-slate-50 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 py-3.5 px-4 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                      <option value="Published">Published (Public)</option>
                      <option value="Draft">Draft (Private)</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Google Preview Card */}
            <div className="bg-[#1a1c1e] p-8 rounded-[32px] shadow-2xl shadow-slate-300 text-white relative overflow-hidden">
               <div className="absolute -right-4 -top-4 opacity-5 rotate-12"><Search size={120} /></div>
               <h3 className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 mb-6 relative">
                 <Eye size={16} /> Google Search Preview
               </h3>
               <div className="space-y-3 relative">
                  <div className="text-blue-400 text-xl font-medium hover:underline cursor-pointer leading-tight line-clamp-2">
                    {formData.seo.metaTitle || "Enter Page Title"}
                  </div>
                  <div className="text-emerald-500 text-[11px] font-medium flex items-center gap-1">
                    yourdomain.com › pages › <span className="text-slate-400">{formData.slug || "path"}</span>
                  </div>
                  <textarea 
                    placeholder="Describe this page for search engines..."
                    value={formData.seo.metaDescription}
                    onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-400 placeholder:text-slate-600 focus:ring-blue-500 p-4 min-h-[100px] resize-none leading-relaxed"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .quill-container .ql-container.ql-snow {
          border: none !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 16px !important;
          min-height: 450px;
        }
        .quill-container .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          background: #ffffff !important;
          padding: 15px 25px !important;
        }
        .quill-container .ql-editor {
          padding: 40px !important;
          line-height: 1.8 !important;
          color: #334155;
        }
        .quill-container .ql-editor.ql-blank::before {
          left: 40px !important;
          color: #cbd5e1 !important;
          font-style: normal !important;
        }
      `}} />
    </div>
  );
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};