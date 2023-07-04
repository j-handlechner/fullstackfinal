"use client"

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '../../../components/LogoutButton'
import UserList from "../../../components/UserList" 
import Link from 'next/link'
import { useParams } from 'next/navigation'
import TransactionsList from "../../../components/TransactionsList"
import { redirect } from 'next/navigation'

export default function Group() {
  const supabase = createClientComponentClient()
  const params = useParams()

  const [fetchedUser, setFetchedUser] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const [groupId, setGroupId] = useState(undefined)
  const [groupname, setGroupname] = useState(undefined)
  const [userLoading, setUserLoading] = useState(undefined)
  const [userId, setUserId] = useState(undefined)
  const [needToRedirect, setNeedToRedirect] = useState(false)

  useEffect(() => {
    setGroupId(params.groupid)
  }, [params])

  useEffect(() => {
      if(fetchedUser == undefined) {
        const fetchSession = async () => {
          setUserLoading(true)
          const {
            data: { user },
          } = await supabase.auth.getUser()
    
          setFetchedUser(user)
          setUserLoading(false)
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
    if(fetchedUser !== undefined && fetchedUser !== null) {
      const fetchName = async () => {
      
          const supabase = createClientComponentClient()
          const { data: found } = await supabase.from('users').select(`
            username, userId
      `).eq('email', fetchedUser.email)

      setUsername(found[0]?.username)
      setUserId(found[0]?.userId)
    }

      fetchName()
      }

    }, [fetchedUser])


    // check if the given group id really belongs to the user
  useEffect(() => {
    console.log("now in the thingy")
    async function fetchUsersInGroup() {
      console.log("executing fetchUsersInGroup")
      if (!userLoading && userLoading !== undefined && fetchedUser !== undefined && groupId !== undefined && userId !== undefined) {
        console.log("in if")
        const { data: usersInGroup } = await supabase.from("userInGroup").select("userId").eq("groupId", groupId)

        console.log("searching for the current user in ", usersInGroup)
        if(!usersInGroup.some(obj => Object.values(obj).includes(userId))) {
          // redirect("/groups")
          setNeedToRedirect(true)
        }
      } 
    }
    fetchUsersInGroup()
  }, [userLoading, userId, fetchedUser, groupId, params])

  useEffect(() => {
    if(needToRedirect) {
      redirect("/login")
    }
  }, [needToRedirect])

  useEffect(() => {
    if (!userLoading && userLoading !== undefined && !fetchedUser) {
      redirect('/login')
    }
  }, [userLoading])

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
          >← Back to groups</Link>
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
