'use client'
import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface Props {
  value:       string[]
  onChange:    (tags: string[]) => void
  placeholder?: string
  accentColor?: string
  maxTags?:    number
}

export default function TagInput({ value, onChange, placeholder = 'Añadir...', accentColor = '#C026D3', maxTags = 20 }: Props) {
  const [input, setInput] = useState('')

  const add = () => {
    const tag = input.trim()
    if (!tag || value.includes(tag) || value.length >= maxTags) return
    onChange([...value, tag])
    setInput('')
  }

  const remove = (tag: string) => onChange(value.filter(t => t !== tag))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1])
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl min-h-[44px] cursor-text"
      style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }}
      onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      {value.map(tag => (
        <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono"
          style={{ background: accentColor + '18', color: accentColor, border: `1px solid ${accentColor}30` }}>
          {tag}
          <button type="button" onClick={() => remove(tag)} className="hover:opacity-70">
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent text-white text-xs focus:outline-none placeholder-white/20"
      />
    </div>
  )
}
