"use client"

import React, { useState, useEffect } from 'react';
import { createClientComponentClient, setSession } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '../../../components/LogoutButton'
import UserList from "../../../components/UserList" 
import GroupsList from "../../../components/GroupsList" 
import CreateGroup from "../../../components/CreateGroup"
import { useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import TransactionsList from "../../../components/TransactionsList"

export default function Group() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const params = useParams()

  const [fetchedUser, setFetchedUser] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [groupId, setGroupId] = useState(undefined)
  const [groupname, setGroupname] = useState(undefined)

  useEffect(() => {
    setGroupId(params.groupid)
  }, [params])

  useEffect(() => {
      if(fetchedUser == undefined) {
        const fetchSession = async () => {
        
          const {
            data: { user },
          } = await supabase.auth.getUser()
    
          setFetchedUser(user)
        }
        fetchSession()
      }
  }, [])

  useEffect(() => {
    if(groupId !== undefined) {
      const fetchName = async () => {
          const supabase = createClientComponentClient()
          const { data: found } = await supabase.from('groups').select(`
            groupname
      `).eq('groupId', groupId)

      setGroupname(found[0]?.groupname)
    }

      fetchName()
      }

    }, [groupId])

  useEffect(() => {
    if(fetchedUser !== undefined) {
      const fetchName = async () => {
      
          const supabase = createClientComponentClient()
          const { data: found } = await supabase.from('users').select(`
            username
      `).eq('email', fetchedUser.email)

      console.log("trying to find user with email: ", fetchedUser.email)
      console.log("found: ", found)
      setUsername(found[0]?.username)
    }

      fetchName()
      }

    }, [fetchedUser])


  // useEffect(() => {
  //   if (!userLoading && userLoading !== undefined && !user) {
  //     // This route can only be accessed by authenticated users.
  //     // Unauthenticated users will be redirected to the `/login` route.
  //     // redirect('/login')
  //   }
  // }, [userLoading])

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
        <p className="text-white p-3">fullstack challenge</p>
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
              <div className="flex items-center gap-4">
                Hey {username}!
                <LogoutButton />
              </div>
          </div>
        </div>
      </nav>
        <div className="w-full max-w-4xl p-5">
        <Link
            href="/groups"
            className="text-white text-xl pt-5"
          >Groups</Link>
              <p className="text-white text-4xl pt-2.5">{groupname}</p>

            <div style={{display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "end", marginTop: "10px"}}>
              <p className="text-white text-2xl pt-5 pb-2.5">Users in this group</p>
              <Link className="py-2 px-4 rounded-md w-3/12 self-center text-m bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500" href={`/groups/${groupId}/addUser`}>Add user</Link>
            </div>


            <UserList groupId={groupId} />
            <TransactionsList groupId={groupId}/>
        </div>
      </div>
  )
}
