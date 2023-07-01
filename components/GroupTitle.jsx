import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const revalidate = 0

export default async function GroupTitle({groupId}) {
  const supabase = createServerComponentClient({cookies})
  const { data: group } = await supabase.from('groups').select().eq('groupId', groupId)

  if (!group) {
    return <p>No groups.</p>
  }

  return (
    <h2>
        { group.map((g) => (
            g.groupname
        ))}
    </h2>
  )
}