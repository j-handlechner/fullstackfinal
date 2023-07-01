import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  // const supabase = createClientComponentClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()



  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect('/login')
  }

  return (
    <Link
        href={{
          pathname: '/dashboard/groups',
          query: {
            search: 'search'
          }
        }}
        className="text-white"
      >go to groups</Link>
  )
}
