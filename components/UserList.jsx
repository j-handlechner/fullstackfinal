import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const revalidate = 0

export default async function UserList({groupId}) {
    const supabase = createServerComponentClient({cookies})
    const { data: joinedUserData } = await supabase.from('userInGroup').select(`
    groupId, 
    users ( userId, username )
`).eq('groupId', groupId)

  if (!joinedUserData) {
    return <p className="text-white">No users found.</p>
  }

  return (
    <ul>
        { joinedUserData.map((u, idx) => {
            return <li className="text-white" key={idx}>groupidid:{u.groupId} users.name:{u.users.username} users.userId:{u.users.userId}</li>
        })}
    </ul>
  )
}