"use client"

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

// import { cookies } from 'next/headers'
import {useState, useEffect} from "react"
export const revalidate = 0

export default function GroupsList({ userId }) {
    const [userGroups, setUserGroups] = useState(undefined)

    useEffect(() => {
       // const supabase = createServerComponentClient({cookies})
       async function fetch() {
            const supabase = createClientComponentClient()
            const { data: userGroups } = await supabase.from('userInGroup').select(`
            groupId, 
            groups ( groupname )
        `).eq('userId', userId)
  
            setUserGroups(userGroups)
       }

        if(userId !== undefined) {
            fetch()
        }
      }, [userId])

  if (!userGroups) {
    return <p className="text-white">You are not part of any group.</p>
  }

  return (
    <>
        <ul>
            { userGroups.map((ug, idx) => {
                return <li className="text-white text-3xl" key={idx}>
                <Link href={`/dashboard/groups?id=${ug.groupId}`}
                    className="text-white">{ug.groups.groupname} -&gt;</Link></li>
            })}
        </ul>
    </>
  )
}