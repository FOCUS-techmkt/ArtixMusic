import { redirect } from 'next/navigation'

export default function LinksRedirect() {
  redirect('/dashboard?tab=content')
}
