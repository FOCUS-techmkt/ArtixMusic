import { redirect } from 'next/navigation'

// Editor completo en /panel — redirige preservando auth
export default function CustomizePage() {
  redirect('/panel')
}
