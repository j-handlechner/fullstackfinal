"use client"

import {useState, useEffect} from "react"

import { createServerComponentClient, createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UserList({groupId}) {
    const supabase = createClientComponentClient()
    const [userData, setUserData] = useState(undefined)

    useEffect(() => {
      async function fetch() {
          const { data: joinedUserData } = await supabase.from('userInGroup').select(`
          groupId, 
          users ( userId, username )
      `).eq('groupId', groupId)

        setUserData(joinedUserData)
      }

      fetch()
    }, [groupId])

  if (!userData) {
    return <p className="text-white">No users found in userlist for groupid: {groupId}.</p>
  }

  return (
    <ul>
        { userData.map((u, idx) => {
            return <li className="text-white" key={idx}>groupidid:{u.groupId} users.name:{u.users.username} users.userId:{u.users.userId}</li>
        })}
    </ul>
  )
}