"use client"

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'

export const revalidate = 0

export default async function GroupsList({ userId }) {
    // const supabase = createServerComponentClient({cookies})
    const supabase = createClientComponentClient()
    const { data: userGroups } = await supabase.from('userInGroup').select(`
    groupId, 
    groups ( groupname )
`).eq('userId', userId)

  if (!userGroups) {
    return <p className="text-white">You are not part of any group.</p>
  }

  return (
    <>
        <ul>
            { userGroups.map((ug, idx) => {
                return <li className="text-white" key={idx}>groupid:{ug.groupId} name: {ug.groups.groupname}</li>
            })}
        </ul>
    </>
  )
}