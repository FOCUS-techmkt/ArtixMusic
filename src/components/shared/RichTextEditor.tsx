'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Link2, List, ListOrdered, Quote, Undo2, Redo2 } from 'lucide-react'

interface Props {
  value:       string
  onChange:    (html: string) => void
  placeholder?: string
  accentColor?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Escribe aquí...', accentColor = '#C026D3' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content:   value,
    onUpdate:  ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[120px] px-4 py-3 focus:outline-none text-white/80 leading-relaxed',
      },
    },
  })

  if (!editor) return null

  const btn = (active: boolean, onClick: () => void, children: React.ReactNode) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className="p-1.5 rounded-lg transition-all"
      style={{ background: active ? accentColor + '20' : 'transparent', color: active ? accentColor : 'rgba(255,255,255,0.4)' }}>
      {children}
    </button>
  )

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0A0A0E' }}>
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.05]">
        {btn(editor.isActive('bold'),           () => editor.chain().focus().toggleBold().run(),           <Bold className="w-3.5 h-3.5" />)}
        {btn(editor.isActive('italic'),         () => editor.chain().focus().toggleItalic().run(),         <Italic className="w-3.5 h-3.5" />)}
        {btn(editor.isActive('bulletList'),     () => editor.chain().focus().toggleBulletList().run(),     <List className="w-3.5 h-3.5" />)}
        {btn(editor.isActive('orderedList'),    () => editor.chain().focus().toggleOrderedList().run(),    <ListOrdered className="w-3.5 h-3.5" />)}
        {btn(editor.isActive('blockquote'),     () => editor.chain().focus().toggleBlockquote().run(),     <Quote className="w-3.5 h-3.5" />)}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {btn(false, () => editor.chain().focus().undo().run(), <Undo2 className="w-3.5 h-3.5" />)}
        {btn(false, () => editor.chain().focus().redo().run(), <Redo2 className="w-3.5 h-3.5" />)}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
