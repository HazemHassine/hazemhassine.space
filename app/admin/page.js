"use client";

import { useState } from 'react';
import Link from 'next/link';
import AdminMarkdownEditor from '@/components/AdminMarkdownEditor';
import { 
  siteConfig as initialSiteConfig, 
  experience as initialExperience, 
  projects as initialProjects, 
  blogPosts as initialBlogPosts, 
  navigation as initialNavigation, 
  skills as initialSkills, 
  techStack as initialTechStack 
} from '@/lib/data';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('config');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const [projects, setProjects] = useState(initialProjects);
  const [experience, setExperience] = useState(initialExperience);

  const [mdPosts, setMdPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const tabs = [
    { id: 'config', label: 'Site Config' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'blog', label: 'Blog Posts' },
  ];

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteConfig,
          projects,
          experience,
          navigation: initialNavigation, // Keeping these static for now
          skills: initialSkills,
          techStack: initialTechStack
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Changes saved successfully! ' + (data.message || ''));
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err) {
      setMessage('Failed to save. Check console.');
      console.error(err);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const fetchMdPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setMdPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    }
    setLoadingPosts(false);
  };

  const handleSaveMdPost = async () => {
    if (!selectedPost) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedPost.slug,
          content: selectedPost.content
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Post saved successfully! ' + (data.message || ''));
        fetchMdPosts();
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err) {
      setMessage('Failed to save post. Check console.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-[family-name:var(--font-mono)] p-8">
      <div className="max-w-5xl mx-auto flex flex-col h-full">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-border-primary pb-6 mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[48px] font-bold text-outline leading-none uppercase tracking-[-0.04em]">
              ADMIN_PANEL
            </h1>
            <p className="text-text-muted text-[14px] mt-2">Manage portfolio content directly.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 border border-border-primary hover:bg-surface transition-colors text-[12px] uppercase">
              Back to Site
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors text-[12px] uppercase"
            >
              Logout
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-fixed text-background px-6 py-2 font-bold tracking-wider hover:bg-primary transition-colors text-[12px] uppercase disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-8 text-[14px] ${message.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-primary-fixed/20 text-primary-fixed'} border border-current`}>
            {message}
          </div>
        )}

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-12 flex-1">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'blog') {
                    fetchMdPosts();
                    setSelectedPost(null);
                  }
                }}
                className={`text-left px-4 py-3 border transition-colors text-[14px] uppercase tracking-wider ${
                  activeTab === tab.id 
                    ? 'border-primary-fixed text-primary-fixed bg-primary-fixed/10 font-bold' 
                    : 'border-border-primary text-text-muted hover:border-text-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-surface border border-border-primary p-8">
            
            {/* CONFIG TAB */}
            {activeTab === 'config' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-[20px] font-bold text-primary-fixed uppercase border-b border-border-muted pb-2 mb-4">Site Configuration</h2>
                
                {['name', 'title', 'role', 'location', 'email', 'github', 'linkedin', 'copyright'].map((field) => (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-wider text-text-muted">{field}</label>
                    <input 
                      type="text"
                      value={siteConfig[field]}
                      onChange={(e) => setSiteConfig({...siteConfig, [field]: e.target.value})}
                      className="bg-background border border-border-primary p-3 text-[14px] text-primary focus:border-primary-fixed focus:outline-none"
                    />
                  </div>
                ))}
                
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wider text-text-muted">Tagline</label>
                  <textarea 
                    value={siteConfig.tagline}
                    onChange={(e) => setSiteConfig({...siteConfig, tagline: e.target.value})}
                    rows={2}
                    className="bg-background border border-border-primary p-3 text-[14px] text-primary focus:border-primary-fixed focus:outline-none resize-y"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wider text-text-muted">Bio (Paragraphs separated by newlines)</label>
                  <textarea 
                    value={siteConfig.bio.join('\n\n')}
                    onChange={(e) => setSiteConfig({...siteConfig, bio: e.target.value.split('\n\n')})}
                    rows={6}
                    className="bg-background border border-border-primary p-3 text-[14px] text-primary focus:border-primary-fixed focus:outline-none resize-y"
                  />
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center border-b border-border-muted pb-2 mb-4">
                  <h2 className="text-[20px] font-bold text-primary-fixed uppercase">Projects</h2>
                  <button 
                    onClick={() => setProjects([{ id: Date.now().toString(), title: 'New Project', subtitle: '', description: '', tech: [], href: '' }, ...projects])}
                    className="text-[11px] uppercase border border-primary-fixed text-primary-fixed px-3 py-1 hover:bg-primary-fixed hover:text-background"
                  >
                    + Add Project
                  </button>
                </div>

                {projects.map((project, index) => (
                  <div key={project.id || index} className="border border-border-primary p-6 relative group">
                    <button 
                      onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase text-text-muted">Title</label>
                        <input 
                          type="text" value={project.title}
                          onChange={(e) => { const newP = [...projects]; newP[index].title = e.target.value; setProjects(newP); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase text-text-muted">Subtitle</label>
                        <input 
                          type="text" value={project.subtitle}
                          onChange={(e) => { const newP = [...projects]; newP[index].subtitle = e.target.value; setProjects(newP); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[11px] uppercase text-text-muted">Link (Href)</label>
                        <input 
                          type="text" value={project.href}
                          onChange={(e) => { const newP = [...projects]; newP[index].href = e.target.value; setProjects(newP); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[11px] uppercase text-text-muted">Description</label>
                        <textarea 
                          value={project.description} rows={3}
                          onChange={(e) => { const newP = [...projects]; newP[index].description = e.target.value; setProjects(newP); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[11px] uppercase text-text-muted">Tech Stack (comma separated)</label>
                        <input 
                          type="text" value={project.tech.join(', ')}
                          onChange={(e) => { const newP = [...projects]; newP[index].tech = e.target.value.split(',').map(s=>s.trim()); setProjects(newP); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center border-b border-border-muted pb-2 mb-4">
                  <h2 className="text-[20px] font-bold text-primary-fixed uppercase">Experience</h2>
                  <button 
                    onClick={() => setExperience([{ year: new Date().getFullYear().toString(), company: 'New Company', role: '', location: '', description: '' }, ...experience])}
                    className="text-[11px] uppercase border border-primary-fixed text-primary-fixed px-3 py-1 hover:bg-primary-fixed hover:text-background"
                  >
                    + Add Experience
                  </button>
                </div>

                {experience.map((exp, index) => (
                  <div key={index} className="border border-border-primary p-6 relative group">
                    <button 
                      onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase text-text-muted">Company</label>
                        <input 
                          type="text" value={exp.company}
                          onChange={(e) => { const newE = [...experience]; newE[index].company = e.target.value; setExperience(newE); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase text-text-muted">Role</label>
                        <input 
                          type="text" value={exp.role}
                          onChange={(e) => { const newE = [...experience]; newE[index].role = e.target.value; setExperience(newE); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase text-text-muted">Year</label>
                        <input 
                          type="text" value={exp.year}
                          onChange={(e) => { const newE = [...experience]; newE[index].year = e.target.value; setExperience(newE); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] uppercase text-text-muted">Location</label>
                        <input 
                          type="text" value={exp.location}
                          onChange={(e) => { const newE = [...experience]; newE[index].location = e.target.value; setExperience(newE); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[11px] uppercase text-text-muted">Description</label>
                        <textarea 
                          value={exp.description} rows={2}
                          onChange={(e) => { const newE = [...experience]; newE[index].description = e.target.value; setExperience(newE); }}
                          className="bg-background border border-border-primary p-2 text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BLOG TAB */}
            {activeTab === 'blog' && (
              <div className="flex flex-col gap-8 h-full">
                {selectedPost ? (
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center border-b border-border-muted pb-2 mb-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedPost(null)} className="text-text-muted hover:text-primary-fixed transition-colors">
                          ← Back
                        </button>
                        <h2 className="text-[20px] font-bold text-primary-fixed uppercase">Editing Post</h2>
                      </div>
                      <button 
                        onClick={handleSaveMdPost}
                        disabled={saving}
                        className="bg-primary-fixed text-background px-6 py-2 font-bold tracking-wider hover:bg-primary transition-colors text-[12px] uppercase disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Post'}
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] uppercase text-text-muted">Slug (URL)</label>
                      <input 
                        type="text" 
                        value={selectedPost.slug}
                        onChange={(e) => setSelectedPost({...selectedPost, slug: e.target.value})}
                        className="bg-background border border-border-primary p-2 text-[14px]"
                      />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-[11px] uppercase text-text-muted flex justify-between">
                        <span>Markdown Content (includes Frontmatter)</span>
                      </label>
                      <AdminMarkdownEditor 
                        value={selectedPost.content}
                        onChange={(val) => setSelectedPost({...selectedPost, content: val})}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center border-b border-border-muted pb-2 mb-4">
                      <h2 className="text-[20px] font-bold text-primary-fixed uppercase">Markdown Blog Posts</h2>
                      <button 
                        onClick={() => setSelectedPost({ 
                          slug: 'new-post', 
                          content: '---\nid: "002"\ntitle: "New Blog Post"\ndate: "OCTOBER 15, 2026"\nreadTime: "5 MIN READ"\nexcerpt: "Short summary..."\n---\n\n# New Post\n\nWrite your content here...' 
                        })}
                        className="text-[11px] uppercase border border-primary-fixed text-primary-fixed px-3 py-1 hover:bg-primary-fixed hover:text-background"
                      >
                        + Create Post
                      </button>
                    </div>

                    {loadingPosts ? (
                      <div className="text-text-muted">Loading posts...</div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {mdPosts.map((post) => (
                          <div key={post.slug} className="flex justify-between items-center border border-border-primary p-4 hover:bg-surface-hover transition-colors">
                            <span className="font-mono text-[14px]">{post.slug}.md</span>
                            <button 
                              onClick={() => setSelectedPost(post)}
                              className="text-[11px] uppercase text-primary-fixed hover:text-primary transition-colors"
                            >
                              [ Edit ]
                            </button>
                          </div>
                        ))}
                        {mdPosts.length === 0 && (
                          <div className="text-text-muted">No blog posts found. Create one to get started!</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
