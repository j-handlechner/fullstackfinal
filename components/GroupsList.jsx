"use client"

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import CreateGroup from "../components/CreateGroup"

// import { cookies } from 'next/headers'
import {useState, useEffect} from "react"
export const revalidate = 0

export default function GroupsList({ userId }) {
    const [userGroups, setUserGroups] = useState(undefined)
    const [updateCounter, setUpdateCounter] = useState(0)
    useEffect(() => {
       // const supabase = createServerComponentClient({cookies})
       async function fetch() {
            const supabase = createClientComponentClient()
            const { data: userGroups } = await supabase.from('userInGroup').select(`
            groupId, 
            groups ( groupname )
        `).eq('userId', userId)
  
          setUserGroups(userGroups)

          console.log("all user groups: ", userGroups)
       }

        if(userId !== undefined) {
            fetch()
        }
      }, [userId, updateCounter])

  if (!userGroups) {
    return <p className="text-white">You are not part of any group.</p>
  }

  const updateList = () => {
    setUpdateCounter((prev) => prev + 1)
  }

  return (
    <>
        <ul>
            { userGroups.map((ug, idx) => {
                return <li className="text-white text-3xl" key={idx}>
                <Link href={`/groups/${ug.groupId}`}
                    className="text-white">{ug.groups.groupname} -&gt;</Link></li>
            })}
        </ul>

        <CreateGroup updateList={updateList}/>
    </>
  )
}