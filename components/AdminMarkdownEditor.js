'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the editor to prevent SSR hydration errors
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="p-4 border border-border-primary text-text-muted">Loading editor...</div> }
);

export default function AdminMarkdownEditor({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  // Custom image upload handler
  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      return data.url; // Returns the public path: /images/blog/filename.jpg
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const url = await handleImageUpload(file);
        if (url) {
          onChange(value + `\n![image](${url})\n`);
        }
      }
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col h-[calc(100vh-250px)]" 
      data-color-mode="dark"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <MDEditor
        value={value}
        onChange={onChange}
        height="100%"
        className="flex-1"
        visibleDragbar={false}
      />
      {uploading && (
        <div className="mt-2 text-[11px] text-primary-fixed uppercase tracking-wider">
          Uploading image...
        </div>
      )}
    </div>
  );
}
