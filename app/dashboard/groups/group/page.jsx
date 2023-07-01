"use client"

import React, { useState, useEffect } from 'react';
import { createClientComponentClient, setSession } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '../../../../components/LogoutButton'
import UserList from "../../../../components/UserList" 
import GroupsList from "../../../../components/GroupsList" 
import CreateGroup from "../../../../components/CreateGroup"
import { useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const currentGroupId = 9
const currentUserId = 1

export default function Group({params}) {
  // const supabase = createServerComponentClient({ cookies })
  const supabase = createClientComponentClient()

  // const currentView = useState("default") // can be "default", "inGroup", "addUser", "addExpense"
  const searchParams = useSearchParams()

  const [user, setUser] = useState(undefined)

  const test = 1
  useEffect(() => {

    const fetchSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
    
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    fetchSession()
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setSession(session)
    //   setUser(session?.user ?? null);
    //   setLoading(false);
    // })

    // supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session)
    //   setUser(session?.user ?? null);
    //   setLoading(false);
    // })
    console.log("hello!")
  }, [])

  // if (!user) {
  //   // This route can only be accessed by authenticated users.
  //   // Unauthenticated users will be redirected to the `/login` route.
  //   redirect('/login')
  // }

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
        <p className="text-white p-3">fullstack challenge</p>
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
              <div className="flex items-center gap-4">
                Hey! You're currently logged in with {user?.email}!
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

          <Link
            href={{
              pathname: '/dashboard/groups',
            }}
            className="text-white text-xl pt-5"
          >Groups</Link>
          <p className="text-white text-4xl pt-2.5">Gruppe XY id: {searchParams.get('groupid')}</p>
        </div>
      </div>
  )
}
