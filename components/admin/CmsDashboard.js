"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminMarkdownEditor from "@/components/AdminMarkdownEditor";
import JsonFieldEditor from "@/components/admin/JsonFieldEditor";

const NAVIGATION = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "global", label: "Site & theme", icon: "tune" },
  { id: "pages", label: "Pages & SEO", icon: "web" },
  { id: "portfolio", label: "Projects", icon: "deployed_code" },
  { id: "career", label: "Career", icon: "work_history" },
  { id: "skills", label: "Skills", icon: "neurology" },
  { id: "blog", label: "Blog", icon: "edit_note" },
  { id: "media", label: "Media", icon: "perm_media" },
  { id: "inbox", label: "Inbox", icon: "inbox" },
];

const inputClass = "w-full border border-border-primary bg-background px-3 py-2.5 text-[13px] text-primary outline-none focus:border-primary-fixed";
const subtleButton = "border border-border-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted transition-colors hover:border-primary-fixed hover:text-primary-fixed disabled:opacity-40";
const primaryButton = "border border-primary-fixed bg-primary-fixed px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-background transition-colors hover:bg-primary disabled:opacity-40";

function formatDate(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function safeJson(value) {
  return JSON.stringify(value, null, 2);
}

async function jsonRequest(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function StatusPill({ status }) {
  const styles = status === "published"
    ? "border-primary-fixed/50 bg-primary-fixed/10 text-primary-fixed"
    : status === "local"
      ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
      : "border-sky-400/50 bg-sky-400/10 text-sky-300";
  return <span className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${styles}`}>{status}</span>;
}

function PreviewModal({ path, version, onClose }) {
  const [device, setDevice] = useState("desktop");
  const widths = { desktop: "100%", tablet: "820px", mobile: "390px" };
  const previewPath = path === "/" ? "" : path;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#050505]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-primary bg-surface px-4 py-3">
        <div>
          <div className="text-[11px] font-bold uppercase text-primary">Draft preview</div>
          <div className="text-[10px] text-text-dim">Protected preview · {path}</div>
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(widths).map((name) => (
            <button key={name} type="button" onClick={() => setDevice(name)} className={`${subtleButton} ${device === name ? "border-primary-fixed text-primary-fixed" : ""}`}>
              {name}
            </button>
          ))}
          <button type="button" onClick={onClose} className={primaryButton}>Close preview</button>
        </div>
      </div>
      <div className="flex flex-1 justify-center overflow-hidden bg-[#111] p-3">
        <iframe
          key={`${path}-${version}`}
          title={`Draft preview of ${path}`}
          src={`/admin/preview${previewPath}?v=${version}`}
          style={{ width: widths[device] }}
          className="h-full border border-border-primary bg-background transition-[width] duration-300"
        />
      </div>
    </div>
  );
}

function Overview({ entries, setupRequired, onPublishAll, busy, onNavigate }) {
  const published = entries.filter((entry) => entry.status === "published").length;
  const drafts = entries.length - published;
  const lastUpdate = entries.map((entry) => entry.updatedAt).filter(Boolean).sort().at(-1);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-5 md:p-8 lg:p-12">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border-primary pb-6">
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-primary-fixed">Content operations</div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase md:text-5xl">CMS overview</h1>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-text-muted">Edit the site as structured content, save private drafts, preview real pages, and publish without a redeploy.</p>
        </div>
        <button type="button" disabled={busy || setupRequired} onClick={onPublishAll} className={primaryButton}>
          {busy ? "Publishing…" : "Publish everything"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-px border border-border-primary bg-border-primary sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Documents", entries.length, "Structured content areas"],
          ["Published", published, "Live on the public site"],
          ["Draft / local", drafts, "Waiting to be published"],
          ["Last update", lastUpdate ? formatDate(lastUpdate) : "Repository", "Latest saved change"],
        ].map(([label, value, detail]) => (
          <div key={label} className="bg-surface p-5">
            <div className="text-[9px] uppercase tracking-wider text-text-dim">{label}</div>
            <div className="mt-2 break-words font-[family-name:var(--font-display)] text-2xl font-bold text-primary">{value}</div>
            <div className="mt-1 text-[10px] text-text-muted">{detail}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-[12px] font-bold uppercase text-primary">Content areas</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {NAVIGATION.filter((item) => !["overview", "blog", "media", "inbox"].includes(item.id)).map((item) => {
            const count = entries.filter((entry) => entry.section === item.id).length;
            return (
              <button key={item.id} type="button" onClick={() => onNavigate(item.id)} className="group flex items-center gap-4 border border-border-primary bg-surface p-5 text-left hover:border-primary-fixed">
                <span className="material-symbols-outlined text-[24px] text-primary-fixed">{item.icon}</span>
                <span className="flex-1">
                  <span className="block text-[12px] font-bold uppercase text-primary">{item.label}</span>
                  <span className="mt-1 block text-[10px] text-text-dim">{count} editable documents</span>
                </span>
                <span className="text-primary-fixed opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DocumentEditor({ entry, onChange, onSave, onPublish, onPreview, onRestore, busy }) {
  const [mode, setMode] = useState("fields");
  const [raw, setRaw] = useState(() => safeJson(entry.draftContent));
  const [rawError, setRawError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const previousKey = useRef(entry.key);

  useEffect(() => {
    if (previousKey.current !== entry.key || !entry.dirty) {
      setRaw(safeJson(entry.draftContent));
      setRawError("");
      previousKey.current = entry.key;
    }
  }, [entry.key, entry.draftContent, entry.dirty]);

  const changeMode = (nextMode) => {
    if (mode === "json" && nextMode === "fields") {
      try {
        onChange(JSON.parse(raw));
        setRawError("");
      } catch (error) {
        setRawError(error.message);
        return;
      }
    }
    if (nextMode === "json") setRaw(safeJson(entry.draftContent));
    setMode(nextMode);
  };

  const loadHistory = async () => {
    setShowHistory((current) => !current);
    if (history.length > 0) return;
    try {
      const data = await jsonRequest(`/api/admin/cms?history=${encodeURIComponent(entry.key)}`);
      setHistory(data.revisions || []);
    } catch {
      setHistory([]);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="sticky top-0 z-20 border-b border-border-primary bg-surface/95 px-5 py-4 backdrop-blur md:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <StatusPill status={entry.status} />
              {entry.dirty && <span className="text-[9px] font-bold uppercase text-amber-300">Unsaved changes</span>}
            </div>
            <h1 className="truncate text-[18px] font-bold uppercase text-primary">{entry.label}</h1>
            <p className="mt-1 max-w-2xl text-[11px] text-text-muted">{entry.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={loadHistory} className={subtleButton}>History</button>
            <button type="button" disabled={busy} onClick={onPreview} className={subtleButton}>Save & preview</button>
            <button type="button" disabled={busy || !entry.dirty} onClick={onSave} className={subtleButton}>Save draft</button>
            <button type="button" disabled={busy} onClick={onPublish} className={primaryButton}>Publish</button>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="border-b border-border-primary bg-background px-5 py-4 md:px-7">
          <div className="mb-3 text-[10px] font-bold uppercase text-primary">Revision history</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {history.map((revision) => (
              <button key={revision.id} type="button" onClick={() => onRestore(revision.id)} className="shrink-0 border border-border-primary bg-surface px-3 py-2 text-left hover:border-primary-fixed">
                <span className="block text-[10px] font-bold text-primary">v{revision.version} · {revision.change_type}</span>
                <span className="block text-[9px] text-text-dim">{formatDate(revision.created_at)}</span>
              </button>
            ))}
            {history.length === 0 && <span className="text-[10px] text-text-dim">No saved revisions yet.</span>}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-border-muted px-5 py-3 md:px-7">
        <div className="text-[9px] uppercase text-text-dim">Key: {entry.key} · Version {entry.version}</div>
        <div className="flex border border-border-primary">
          {["fields", "json"].map((item) => (
            <button key={item} type="button" onClick={() => changeMode(item)} className={`px-3 py-1.5 text-[9px] font-bold uppercase ${mode === item ? "bg-primary-fixed text-background" : "text-text-muted"}`}>{item}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-5 md:p-7">
        {mode === "fields" ? (
          <JsonFieldEditor label={entry.label} value={entry.draftContent} onChange={onChange} />
        ) : (
          <div>
            <textarea
              value={raw}
              spellCheck={false}
              onChange={(event) => {
                const next = event.target.value;
                setRaw(next);
                try {
                  onChange(JSON.parse(next));
                  setRawError("");
                } catch (error) {
                  setRawError(error.message);
                }
              }}
              className="min-h-[65vh] w-full resize-y border border-border-primary bg-[#060606] p-4 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-primary outline-none focus:border-primary-fixed"
            />
            {rawError && <p className="mt-2 text-[10px] text-red-400">JSON error: {rawError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogManager({ notify }) {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const data = await jsonRequest("/api/admin/blogs");
      setPosts(data.posts || []);
    } catch (error) {
      notify(error.message, "error");
    }
  }, [notify]);

  useEffect(() => {
    const timeout = window.setTimeout(loadPosts, 0);
    return () => window.clearTimeout(timeout);
  }, [loadPosts]);

  const save = async (status) => {
    if (!selected?.slug || !selected?.title) return notify("A title and slug are required", "error");
    setBusy(true);
    try {
      const data = await jsonRequest("/api/admin/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selected,
          content: selected.body || "",
          status,
          originalSlug: selected.originalSlug || selected.slug,
        }),
      });
      notify(data.message || "Post saved");
      await loadPosts();
      setSelected((current) => ({ ...current, status, originalSlug: current.slug }));
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!selected || !window.confirm(`Delete “${selected.title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await jsonRequest("/api/admin/delete-post", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selected.slug }),
      });
      setSelected(null);
      await loadPosts();
      notify("Post deleted");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  if (!selected) {
    return (
      <div className="mx-auto w-full max-w-6xl p-5 md:p-8 lg:p-12">
        <div className="mb-8 flex items-end justify-between border-b border-border-primary pb-5">
          <div><h1 className="text-3xl font-bold uppercase">Blog</h1><p className="mt-2 text-[12px] text-text-muted">Draft, write, preview, and publish Markdown articles.</p></div>
          <button type="button" className={primaryButton} onClick={() => setSelected({ slug: "new-article", originalSlug: null, title: "New article", date: new Date().toISOString().slice(0, 10), readTime: "5 MIN READ", excerpt: "", body: "# New article\n\nStart writing…", status: "draft" })}>New post</button>
        </div>
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <button key={post.slug} type="button" onClick={() => setSelected({ ...post, originalSlug: post.slug, body: post.body || post.content || "" })} className="flex items-center gap-4 border border-border-primary bg-surface p-4 text-left hover:border-primary-fixed">
              <StatusPill status={post.status} />
              <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-bold text-primary">{post.title}</span><span className="block truncate text-[10px] text-text-dim">/blog/{post.slug}</span></span>
              <span className="hidden text-[10px] text-text-muted sm:block">{post.date}</span>
              <span className="text-primary-fixed">→</span>
            </button>
          ))}
          {posts.length === 0 && <div className="border border-dashed border-border-primary p-10 text-center text-[12px] text-text-muted">No posts yet.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col p-5 md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border-primary pb-4">
        <button type="button" onClick={() => setSelected(null)} className={subtleButton}>← All posts</button>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={remove} className={`${subtleButton} hover:border-red-400 hover:text-red-400`}>Delete</button>
          <button type="button" disabled={busy} onClick={() => save("draft")} className={subtleButton}>Save draft</button>
          <button type="button" disabled={busy} onClick={() => save("published")} className={primaryButton}>Publish</button>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {["title", "slug", "date", "readTime"].map((field) => (
          <label key={field} className="flex flex-col gap-1.5"><span className="text-[10px] uppercase text-text-dim">{field}</span><input className={inputClass} value={selected[field] || ""} onChange={(event) => setSelected({ ...selected, [field]: event.target.value })} /></label>
        ))}
        <label className="flex flex-col gap-1.5 md:col-span-2"><span className="text-[10px] uppercase text-text-dim">Excerpt</span><textarea rows={2} className={inputClass} value={selected.excerpt || ""} onChange={(event) => setSelected({ ...selected, excerpt: event.target.value })} /></label>
      </div>
      <AdminMarkdownEditor value={selected.body || ""} onChange={(body) => setSelected({ ...selected, body: body || "" })} />
    </div>
  );
}

function MediaManager({ notify }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setAssets((await jsonRequest("/api/admin/media")).assets || []); }
    catch (error) { notify(error.message, "error"); }
    finally { setLoading(false); }
  }, [notify]);

  useEffect(() => {
    const timeout = window.setTimeout(load, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const upload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "cms-media");
    try {
      const response = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      await navigator.clipboard?.writeText(data.url);
      notify("Uploaded. Public URL copied to clipboard.");
      load();
    } catch (error) { notify(error.message, "error"); }
  };

  const remove = async (asset) => {
    if (!window.confirm(`Delete ${asset.name}?`)) return;
    try {
      await jsonRequest("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: asset.name }) });
      load();
      notify("Asset deleted");
    } catch (error) { notify(error.message, "error"); }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-5 md:p-8 lg:p-12">
      <div className="mb-8 flex items-end justify-between border-b border-border-primary pb-5">
        <div><h1 className="text-3xl font-bold uppercase">Media library</h1><p className="mt-2 text-[12px] text-text-muted">Public images and PDFs stored in Supabase.</p></div>
        <button type="button" className={primaryButton} onClick={() => fileRef.current?.click()}>Upload asset</button>
        <input ref={fileRef} type="file" accept="image/*,.pdf" hidden onChange={(event) => upload(event.target.files?.[0])} />
      </div>
      {loading ? <p className="text-text-muted">Loading assets…</p> : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <div key={asset.id} className="group border border-border-primary bg-surface p-3">
              <div className="mb-3 aspect-video overflow-hidden border border-border-muted bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
              </div>
              <div className="truncate text-[11px] font-bold text-primary">{asset.name}</div>
              <div className="mt-3 flex gap-2"><button type="button" className={subtleButton} onClick={() => { navigator.clipboard?.writeText(asset.url); notify("URL copied"); }}>Copy URL</button><button type="button" className={`${subtleButton} hover:text-red-400`} onClick={() => remove(asset)}>Delete</button></div>
            </div>
          ))}
          {assets.length === 0 && <div className="col-span-full border border-dashed border-border-primary p-10 text-center text-[12px] text-text-muted">No uploaded assets.</div>}
        </div>
      )}
    </div>
  );
}

function InboxManager({ notify }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setMessages((await jsonRequest("/api/admin/messages")).messages || []); }
    catch (error) { notify(error.message, "error"); }
    finally { setLoading(false); }
  }, [notify]);

  useEffect(() => {
    const timeout = window.setTimeout(load, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const mark = async (id, status) => {
    try {
      await jsonRequest("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
    } catch (error) { notify(error.message, "error"); }
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-5 md:p-8 lg:p-12">
      <div className="mb-8 border-b border-border-primary pb-5"><h1 className="text-3xl font-bold uppercase">Contact inbox</h1><p className="mt-2 text-[12px] text-text-muted">A durable copy of messages submitted through the site.</p></div>
      {loading ? <p className="text-text-muted">Loading messages…</p> : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <article key={message.id} className={`border bg-surface p-5 ${message.status === "new" ? "border-primary-fixed" : "border-border-primary"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-[13px] font-bold text-primary">{message.name}</h2><a href={`mailto:${message.email}`} className="text-[11px] text-primary-fixed">{message.email}</a></div><div className="text-right"><StatusPill status={message.status} /><div className="mt-2 text-[9px] text-text-dim">{formatDate(message.created_at)}</div></div></div>
              <p className="mt-4 whitespace-pre-wrap text-[12px] leading-relaxed text-text-muted">{message.message}</p>
              <div className="mt-4 flex gap-2">{message.status !== "read" && <button type="button" className={subtleButton} onClick={() => mark(message.id, "read")}>Mark read</button>}<button type="button" className={subtleButton} onClick={() => mark(message.id, "archived")}>Archive</button></div>
            </article>
          ))}
          {messages.length === 0 && <div className="border border-dashed border-border-primary p-10 text-center text-[12px] text-text-muted">No messages yet.</div>}
        </div>
      )}
    </div>
  );
}

export default function CmsDashboard() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);
  const [notice, setNotice] = useState(null);
  const [preview, setPreview] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 5000);
  }, []);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/cms", { cache: "no-store" });
      const data = await response.json();
      setEntries(data.entries || []);
      setSetupRequired(Boolean(data.setupRequired));
      if (data.error && !data.setupRequired) notify(data.error, "error");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    const timeout = window.setTimeout(loadEntries, 0);
    return () => window.clearTimeout(timeout);
  }, [loadEntries]);

  const sectionEntries = useMemo(() => entries.filter((entry) => entry.section === activeSection), [entries, activeSection]);
  const selected = entries.find((entry) => entry.key === selectedKey) || sectionEntries[0] || null;

  const navigate = (section) => {
    setActiveSection(section);
    const first = entries.find((entry) => entry.section === section);
    setSelectedKey(first?.key || null);
  };

  const updateSelected = (content) => {
    if (!selected) return;
    setEntries((current) => current.map((entry) => entry.key === selected.key ? { ...entry, draftContent: content, dirty: true, status: entry.status === "local" ? "local" : "draft" } : entry));
  };

  const saveEntry = async (entry = selected, quiet = false) => {
    if (!entry) return false;
    setBusy(true);
    try {
      const data = await jsonRequest("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: entry.key, content: entry.draftContent, label: entry.label, section: entry.section, description: entry.description, contentType: entry.contentType, sortOrder: entry.sortOrder }),
      });
      setEntries((current) => current.map((item) => item.key === entry.key ? { ...item, dirty: false, status: item.publishedContent === null ? "draft" : item.status, version: data.entry?.version ?? item.version, updatedAt: data.entry?.updated_at ?? item.updatedAt } : item));
      if (!quiet) notify("Draft saved");
      return true;
    } catch (error) {
      notify(error.message, "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const publishEntries = async (documents) => {
    setBusy(true);
    try {
      await jsonRequest("/api/admin/cms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entries: documents.map((entry) => ({ key: entry.key, content: entry.draftContent, label: entry.label, section: entry.section, description: entry.description, contentType: entry.contentType, sortOrder: entry.sortOrder })) }) });
      notify(documents.length === 1 ? `${documents[0].label} published` : "All CMS content published");
      await loadEntries();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const restoreRevision = async (revisionId) => {
    if (!selected || !window.confirm(`Restore revision ${revisionId} as the current draft?`)) return;
    setBusy(true);
    try {
      await jsonRequest("/api/admin/cms", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: selected.key, revisionId }) });
      await loadEntries();
      notify("Revision restored as a draft");
    } catch (error) { notify(error.message, "error"); }
    finally { setBusy(false); }
  };

  const openPreview = async () => {
    if (!selected) return;
    const saved = await saveEntry(selected, true);
    if (saved) setPreview({ path: selected.previewPath || "/", version: Date.now() });
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="admin-interface min-h-screen bg-background font-[family-name:var(--font-mono)] text-primary">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-border-primary bg-[#080808] lg:flex">
        <div className="border-b border-border-primary p-5"><div className="text-[10px] uppercase tracking-[0.24em] text-primary-fixed">Hazem OS</div><div className="mt-1 text-lg font-bold uppercase">Content studio</div></div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAVIGATION.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`flex items-center gap-3 border px-3 py-2.5 text-left text-[11px] font-semibold uppercase transition-colors ${activeSection === item.id ? "border-primary-fixed bg-primary-fixed/10 text-primary-fixed" : "border-transparent text-text-muted hover:border-border-primary hover:text-primary"}`}>
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>{item.label}
              {item.id === "inbox" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-fixed" />}
            </button>
          ))}
        </nav>
        <div className="border-t border-border-primary p-3"><Link href="/" target="_blank" className={`${subtleButton} mb-2 block text-center`}>Open live site ↗</Link><button type="button" onClick={logout} className={`${subtleButton} w-full`}>Log out</button></div>
      </aside>

      <div className="flex min-h-screen flex-col lg:ml-56">
        <div className="flex gap-1 overflow-x-auto border-b border-border-primary bg-[#080808] p-2 lg:hidden">{NAVIGATION.map((item) => <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`shrink-0 px-3 py-2 text-[10px] uppercase ${activeSection === item.id ? "bg-primary-fixed text-background" : "text-text-muted"}`}>{item.label}</button>)}</div>

        {notice && <div className={`fixed right-4 top-4 z-[120] max-w-sm border p-4 text-[11px] shadow-2xl ${notice.type === "error" ? "border-red-500 bg-red-950 text-red-100" : "border-primary-fixed bg-[#111] text-primary-fixed"}`}>{notice.message}</div>}

        {loading ? (
          <div className="flex flex-1 items-center justify-center text-[11px] uppercase tracking-wider text-text-muted">Loading content studio…</div>
        ) : activeSection === "overview" ? (
          <Overview entries={entries} setupRequired={setupRequired} onPublishAll={() => publishEntries(entries)} busy={busy} onNavigate={navigate} />
        ) : activeSection === "blog" ? (
          <BlogManager notify={notify} />
        ) : activeSection === "media" ? (
          <MediaManager notify={notify} />
        ) : activeSection === "inbox" ? (
          <InboxManager notify={notify} />
        ) : (
          <div className="flex min-h-screen min-w-0 flex-1">
            <div className="hidden w-56 shrink-0 border-r border-border-primary bg-surface p-3 md:block">
              <div className="mb-3 px-2 text-[9px] font-bold uppercase tracking-wider text-text-dim">Documents</div>
              {sectionEntries.map((entry) => (
                <button key={entry.key} type="button" onClick={() => setSelectedKey(entry.key)} className={`mb-1 w-full border px-3 py-3 text-left ${selected?.key === entry.key ? "border-primary-fixed bg-primary-fixed/10" : "border-transparent hover:border-border-primary"}`}>
                  <span className="block truncate text-[11px] font-semibold text-primary">{entry.label}</span><span className="mt-1 block text-[9px] uppercase text-text-dim">{entry.dirty ? "Unsaved" : entry.status}</span>
                </button>
              ))}
            </div>
            {selected ? <DocumentEditor entry={selected} onChange={updateSelected} onSave={() => saveEntry()} onPublish={() => publishEntries([selected])} onPreview={openPreview} onRestore={restoreRevision} busy={busy || setupRequired} /> : <div className="p-10 text-text-muted">No documents in this section.</div>}
          </div>
        )}
      </div>

      {preview && <PreviewModal {...preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
