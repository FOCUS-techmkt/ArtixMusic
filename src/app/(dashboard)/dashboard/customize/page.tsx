import { redirect } from 'next/navigation'

// The real editor lives at /panel (EditorTab → "Mi sitio").
// This route is kept for backward compatibility with old bookmarks.
export default function CustomizeRedirect() {
  redirect('/panel')
}
