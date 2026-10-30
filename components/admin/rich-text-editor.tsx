"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { uploadEditorImage } from "@/lib/actions/admin";

/** Tiptap editor that writes its HTML into a hidden input named `name`. */
export function RichTextEditor({ name, initialHtml, compact }: { name: string; initialHtml: string; compact?: boolean }) {
  const [html, setHtml] = useState(initialHtml);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true } }),
      Image,
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: { attributes: { class: `md-content max-w-none ${compact ? "min-h-32" : "min-h-72"} px-5 py-4 focus:outline-none` } },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e && {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        h2: e.isActive("heading", { level: 2 }),
        h3: e.isActive("heading", { level: 3 }),
        bullet: e.isActive("bulletList"),
        ordered: e.isActive("orderedList"),
        quote: e.isActive("blockquote"),
        link: e.isActive("link"),
      },
  });

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Холбоос (https://…)", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const onPickImage = async (file: File | undefined) => {
    if (!file || !editor) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadEditorImage(fd);
    setUploading(false);
    if (res.url) editor.chain().focus().setImage({ src: res.url, alt: "" }).run();
    else alert(res.error ?? "Зураг оруулахад алдаа гарлаа");
  };

  const btn = (active: boolean | undefined) =>
    `h-8 min-w-8 rounded-lg px-2 text-sm font-semibold transition-colors ${active ? "bg-brand-soft text-brand" : "text-fg-muted hover:bg-surface hover:text-fg"}`;

  return (
    <div className="mt-1.5 overflow-hidden rounded-2xl border border-line bg-card focus-within:border-brand">
      <input name={name} type="hidden" value={html} />
      <div className="flex flex-wrap gap-0.5 border-b border-line bg-surface/60 p-1.5">
        <button className={btn(s?.h2)} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} type="button">
          H2
        </button>
        <button className={btn(s?.h3)} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} type="button">
          H3
        </button>
        <button className={btn(s?.bold)} onClick={() => editor?.chain().focus().toggleBold().run()} type="button">
          B
        </button>
        <button className={`${btn(s?.italic)} italic`} onClick={() => editor?.chain().focus().toggleItalic().run()} type="button">
          I
        </button>
        <button className={`${btn(s?.underline)} underline`} onClick={() => editor?.chain().focus().toggleUnderline().run()} type="button">
          U
        </button>
        <button className={btn(s?.bullet)} onClick={() => editor?.chain().focus().toggleBulletList().run()} type="button">
          • Жагсаалт
        </button>
        <button className={btn(s?.ordered)} onClick={() => editor?.chain().focus().toggleOrderedList().run()} type="button">
          1. Жагсаалт
        </button>
        <button className={btn(s?.quote)} onClick={() => editor?.chain().focus().toggleBlockquote().run()} type="button">
          “ ”
        </button>
        <button className={btn(s?.link)} onClick={setLink} type="button">
          Холбоос
        </button>
        <button className={btn(false)} disabled={uploading} onClick={() => fileInput.current?.click()} type="button">
          {uploading ? "…" : "Зураг"}
        </button>
        <input accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => void onPickImage(e.target.files?.[0])} ref={fileInput} type="file" />
        <span className="flex-1" />
        <button className={btn(false)} onClick={() => editor?.chain().focus().undo().run()} title="Буцаах" type="button">
          ↶
        </button>
        <button className={btn(false)} onClick={() => editor?.chain().focus().redo().run()} title="Дахих" type="button">
          ↷
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
