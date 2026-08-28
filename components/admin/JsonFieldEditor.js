"use client";

import { useState } from "react";

const LONG_TEXT_KEY = /(description|summary|content|bio|headline|introduction|problem|solution|takeaway|caption|diagram|message|excerpt)/i;

function humanize(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function emptyFromSample(sample) {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample).map(([key, value]) => [key, emptyFromSample(value)]));
  }
  if (typeof sample === "boolean") return false;
  if (typeof sample === "number") return 0;
  return "";
}

function PrimitiveField({ label, value, onChange, fieldKey }) {
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center justify-between gap-4 border border-border-muted bg-background px-3 py-2.5">
        <span className="text-[11px] uppercase tracking-wider text-text-muted">{humanize(label)}</span>
        <button
          type="button"
          aria-pressed={value}
          onClick={() => onChange(!value)}
          className={`min-w-14 border px-2 py-1 text-[10px] font-bold uppercase ${value ? "border-primary-fixed bg-primary-fixed text-background" : "border-border-primary text-text-muted"}`}
        >
          {value ? "On" : "Off"}
        </button>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-wider text-text-dim">{humanize(label)}</span>
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(Number(event.target.value))}
          className="border border-border-primary bg-background px-3 py-2.5 text-[13px] text-primary outline-none focus:border-primary-fixed"
        />
      </label>
    );
  }

  const stringValue = value === null || value === undefined ? "" : String(value);
  const isColor = /^#[0-9a-f]{6}$/i.test(stringValue);
  const isLong = stringValue.length > 90 || stringValue.includes("\n") || LONG_TEXT_KEY.test(fieldKey || label);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-text-dim">{humanize(label)}</span>
      <div className="flex gap-2">
        {isColor && (
          <input
            type="color"
            value={stringValue}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-12 shrink-0 border border-border-primary bg-background p-1"
          />
        )}
        {isLong ? (
          <textarea
            value={stringValue}
            rows={Math.min(12, Math.max(3, stringValue.split("\n").length + 1))}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 resize-y border border-border-primary bg-background px-3 py-2.5 text-[13px] leading-relaxed text-primary outline-none focus:border-primary-fixed"
          />
        ) : (
          <input
            type="text"
            value={stringValue}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 border border-border-primary bg-background px-3 py-2.5 text-[13px] text-primary outline-none focus:border-primary-fixed"
          />
        )}
      </div>
    </label>
  );
}

function ObjectEditor({ value, onChange, depth }) {
  const addField = () => {
    const key = window.prompt("New field name");
    if (!key || Object.hasOwn(value, key)) return;
    onChange({ ...value, [key]: "" });
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(value).map(([key, childValue]) => (
        <JsonFieldEditor
          key={key}
          label={key}
          fieldKey={key}
          value={childValue}
          depth={depth + 1}
          onChange={(nextValue) => onChange({ ...value, [key]: nextValue })}
          onRemove={() => {
            const next = { ...value };
            delete next[key];
            onChange(next);
          }}
        />
      ))}
      <button type="button" onClick={addField} className="self-start border border-dashed border-border-primary px-3 py-2 text-[10px] uppercase text-text-muted hover:border-primary-fixed hover:text-primary-fixed">
        + Add field
      </button>
    </div>
  );
}

function ArrayEditor({ value, onChange, label, depth }) {
  const [collapsed, setCollapsed] = useState(() => new Set(value.map((_, index) => index).filter((index) => index > 0)));

  const addItem = () => {
    const sample = value[0];
    onChange([...value, sample === undefined ? "" : emptyFromSample(sample)]);
    setCollapsed((current) => {
      const next = new Set(current);
      next.delete(value.length);
      return next;
    });
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-wider text-text-dim">{value.length} items</span>
        <button type="button" onClick={addItem} className="border border-primary-fixed px-3 py-1.5 text-[10px] font-bold uppercase text-primary-fixed hover:bg-primary-fixed hover:text-background">
          + Add item
        </button>
      </div>
      {value.map((item, index) => {
        const title = item && typeof item === "object"
          ? item.title || item.name || item.label || item.company || item.institution || item.slug || `Item ${index + 1}`
          : `${humanize(label)} ${index + 1}`;
        const isCollapsed = collapsed.has(index);

        return (
          <div key={`${title}-${index}`} className="border border-border-primary bg-surface-container-low">
            <div className="flex items-center gap-2 border-b border-border-muted px-3 py-2">
              <button
                type="button"
                onClick={() => setCollapsed((current) => {
                  const next = new Set(current);
                  if (next.has(index)) next.delete(index); else next.add(index);
                  return next;
                })}
                className="min-w-0 flex-1 truncate text-left text-[11px] font-semibold uppercase text-primary"
              >
                <span className="mr-2 text-primary-fixed">{isCollapsed ? "+" : "−"}</span>
                {String(index + 1).padStart(2, "0")} / {title}
              </button>
              <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="text-[12px] text-text-muted disabled:opacity-20">↑</button>
              <button type="button" onClick={() => move(index, index + 1)} disabled={index === value.length - 1} className="text-[12px] text-text-muted disabled:opacity-20">↓</button>
              <button type="button" onClick={() => onChange([...value.slice(0, index + 1), structuredClone(item), ...value.slice(index + 1)])} className="text-[10px] uppercase text-text-muted hover:text-primary-fixed">Copy</button>
              <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="text-[10px] uppercase text-red-400 hover:text-red-300">Delete</button>
            </div>
            {!isCollapsed && (
              <div className="p-4">
                <JsonFieldEditor
                  label={title}
                  value={item}
                  depth={depth + 1}
                  onChange={(nextItem) => onChange(value.map((current, itemIndex) => itemIndex === index ? nextItem : current))}
                />
              </div>
            )}
          </div>
        );
      })}
      {value.length === 0 && (
        <div className="border border-dashed border-border-primary p-6 text-center text-[11px] text-text-muted">This collection is empty.</div>
      )}
    </div>
  );
}

export default function JsonFieldEditor({ label, fieldKey, value, onChange, onRemove, depth = 0 }) {
  const isObject = value && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);

  if (!isObject && !isArray) {
    return (
      <div className="group relative">
        <PrimitiveField label={label} value={value} onChange={onChange} fieldKey={fieldKey} />
        {onRemove && depth > 1 && (
          <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="absolute right-2 top-0 text-[9px] uppercase text-text-dim opacity-0 hover:text-red-400 group-hover:opacity-100">Remove</button>
        )}
      </div>
    );
  }

  if (isArray) return <ArrayEditor value={value} onChange={onChange} label={label} depth={depth} />;

  if (depth === 0) return <ObjectEditor value={value} onChange={onChange} depth={depth} />;

  return (
    <details open={depth < 2} className="border border-border-muted bg-background/40">
      <summary className="cursor-pointer border-b border-border-muted px-3 py-2 text-[11px] font-semibold uppercase text-text-muted">
        {humanize(label)} <span className="ml-2 text-[9px] font-normal text-text-dim">{Object.keys(value).length} fields</span>
      </summary>
      <div className="p-4">
        <ObjectEditor value={value} onChange={onChange} depth={depth} />
      </div>
    </details>
  );
}

