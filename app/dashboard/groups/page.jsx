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

export default function Group() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()

  const [fetchedUser, setFetchedUser] = useState(undefined)
  const [groupId, setGroupId] = useState(undefined)

  useEffect(() => {
    setGroupId(searchParams.get('id'))
  }, [])

  useEffect(() => {
      if(fetchedUser == undefined) {
        const fetchSession = async () => {
    
          // const {
          //   data: { session }
          // } = await supabase.auth.getSession()
        
          const {
            data: { user },
          } = await supabase.auth.getUser()
    
          setFetchedUser(user)
        }
        fetchSession()
      }
  }, [])

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
                Hey! You're currently logged in with {fetchedUser?.email}!
                <LogoutButton />
              </div>
          </div>
        </div>
      </nav>
        <div className="w-full max-w-4xl p-5">
        <Link
            href="/dashboard"
            className="text-white text-xl pt-5"
          >Dashboard</Link>

            <p className="text-white text-4xl pt-2.5">Gruppe XY id: {groupId}</p>
            <p className="text-white text-4xl pt-5 pb-2.5">Users in this group</p>
            <UserList groupId={groupId} />
        </div>
      </div>
  )
}
