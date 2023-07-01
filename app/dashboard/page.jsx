import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LogoutButton from '../../components/LogoutButton'
import { redirect } from 'next/navigation'
import UserList from "../../components/UserList" 
import GroupsList from "../../components/GroupsList" 
import CreateGroup from "../../components/CreateGroup"

const currentGroupId = 9
const currentUserId = 1

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect('/login')
  }

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
        <p className="text-white p-3">fullstack challenge</p>
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
              <div className="flex items-center gap-4">
                Hey! You're currently logged in with {user.email}!
                <LogoutButton />
              </div>
          </div>
        </div>
      </nav>
        <div className="w-full max-w-4xl p-5">
          <p className="text-white text-4xl pt-5 pb-2.5">Dashboard</p>
          <p className="text-white">You can manage (almost) everything here!</p>
          <p className="text-white text-4xl pt-5 pb-2.5">Your Groups</p>
          <GroupsList userId={currentUserId} />
          <CreateGroup />

          <p className="text-white text-4xl pt-5 pb-2.5">Users in group id = 9</p>
          <UserList groupId={currentGroupId} />
        </div>
      </div>
  )
}
