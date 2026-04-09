"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  useGetPagesQuery, 
  useDeletePageMutation, 
  useUpdatePageMutation 
} from "@/features/page/pageApi";
import { 
  FileText, Plus, Trash2, ExternalLink, Edit3, 
  Search, X, Eye, Globe, Settings, Save, Type 
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Dynamic Import for Quill (Client-side only)
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-slate-50 animate-pulse rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">Loading Editor...</div>
});
import "react-quill-new/dist/quill.snow.css";

export default function PagesListing() {
  const { data, isLoading, refetch } = useGetPagesQuery();
  const [deletePage] = useDeletePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
  
  const pages = data?.data || [];

  // States for Modals
  const [selectedPage, setSelectedPage] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", status: "", seo: { metaTitle: "", metaDescription: "" }
  });

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePage(id).unwrap();
        toast.success("Page deleted successfully");
      } catch (err) {
        toast.error("Failed to delete page");
      }
    }
  };

  // Open Edit Modal
  const handleEditOpen = (page) => {
    setSelectedPage(page);
    setFormData({
      ...page,
      seo: page.seo || { metaTitle: "", metaDescription: "" }
    });
    setIsEditOpen(true);
  };

  // Open View Modal
  const handleViewOpen = (page) => {
    setSelectedPage(page);
    setIsViewOpen(true);
  };

  // Handle Update Submit
  const handleUpdate = async () => {
    try {
      await updatePage({ id: selectedPage._id, ...formData }).unwrap();
      toast.success("Page updated successfully!");
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              CMS Dashboard
            </h1>
            <p className="text-slate-500 font-medium">Manage your dynamic pages, content and SEO.</p>
          </div>
          <Link 
            href="/admin/pages/create" 
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> Create Page
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="p-6">Page Details</th>
                  <th className="p-6">Path</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {!isLoading && pages.map((page) => (
                  <tr key={page._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{page.title}</span>
                        <span className="text-slate-400 text-[10px] mt-0.5 uppercase font-black">ID: {page._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold font-mono">/{page.slug}</span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${page.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewOpen(page)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View Preview"><Eye size={18} /></button>
                        <button onClick={() => handleEditOpen(page)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Edit Content"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(page._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL: VIEW PREVIEW --- */}
      {isViewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsViewOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Eye size={20}/></div>
                <h2 className="font-black text-xl text-slate-900 tracking-tight">Live Preview</h2>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24}/></button>
            </div>
            <div className="p-10 overflow-y-auto">
                <h1 className="text-4xl font-black mb-4">{selectedPage?.title}</h1>
                <div className="flex gap-4 mb-8">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Slug: /{selectedPage?.slug}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status: {selectedPage?.status}</span>
                </div>
                <div 
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedPage?.content }}
                />
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT PAGE --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditOpen(false)}></div>
          <div className="relative bg-white w-full max-w-6xl max-h-[95vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Edit3 size={20}/></div>
                 <h2 className="font-black text-xl text-slate-900 tracking-tight">Quick Edit: {selectedPage?.title}</h2>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                 <button 
                   onClick={handleUpdate} 
                   disabled={isUpdating}
                   className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                 >
                   {isUpdating ? "Saving..." : <><Save size={18}/> Save Changes</>}
                 </button>
               </div>
            </div>

            <div className="overflow-y-auto p-8 bg-slate-50/50">
              <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                
                {/* Editor Section */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Page Heading</label>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full text-2xl font-bold border-none focus:ring-0 p-0 text-slate-900"
                    />
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-3 bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400 tracking-widest">Content Designer</div>
                    <ReactQuill 
                      theme="snow"
                      value={formData.content}
                      onChange={(val) => setFormData({...formData, content: val})}
                      modules={quillModules}
                    />
                  </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2"><Settings size={14}/> Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 block mb-1">URL SLUG</label>
                        <input 
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: e.target.value})}
                          className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 block mb-1">STATUS</label>
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold py-2.5"
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                    <h3 className="text-[10px] font-black uppercase mb-4 text-blue-400 flex items-center gap-2"><Globe size={14}/> SEO Meta</h3>
                    <div className="space-y-4">
                       <input 
                         placeholder="Meta Title"
                         value={formData.seo.metaTitle}
                         onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})}
                         className="w-full bg-white/10 border-white/10 rounded-xl text-xs p-3 text-white placeholder:text-slate-500"
                       />
                       <textarea 
                         placeholder="Meta Description"
                         value={formData.seo.metaDescription}
                         onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                         className="w-full bg-white/10 border-white/10 rounded-xl text-xs p-3 min-h-[100px] resize-none text-slate-300"
                       />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUILL CUSTOM CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .ql-container.ql-snow { border: none !important; min-height: 300px; font-size: 15px; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; padding: 12px !important; }
        .ql-editor { padding: 25px !important; line-height: 1.6; }
      `}} />
    </div>
  );
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};