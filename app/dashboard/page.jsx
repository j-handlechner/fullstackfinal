import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LogoutButton from '../../components/LogoutButton'
import { redirect } from 'next/navigation'
import UserList from "../../components/UserList" 
import GroupsList from "../../components/GroupsList" 
import Link from 'next/link'

const currentGroupId = 9
const currentUserId = 1

export default async function Groups() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

    const fetchUserId = async () => {
    
        const { data: found } = await supabase.from('users').select(`
          username, email, userId
    `).eq('email', user.email)

    return found[0]?.userId
  }

    const currentUserId = await fetchUserId()


  const { data: users } = await supabase.from('users').select().eq('email', user.email)

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
        <p className="text-white p-3">fullstack challenge</p>
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
              <div className="flex items-center gap-4">
                Hey {users[0].username}!
                <LogoutButton />
              </div>
          </div>
        </div>
      </nav>
        <div className="w-full max-w-4xl p-5">
          <Link
            href={{
              pathname: '/dashboard',
            }}
            className="text-white text-xl pt-5"
          >Dashboard</Link>


          <p className="text-white text-4xl pt-2.5">Deine Gruppen</p>
          <p className="text-white text-l pb-2.5">Du bist in diesen Gruppen Mitglied</p>
          <GroupsList userId={currentUserId} />
        </div>
      </div>
  )
}
