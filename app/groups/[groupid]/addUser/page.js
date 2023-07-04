"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from "../../../../components/LogoutButton"
import { redirect } from 'next/navigation'

export const revalidate = 0;

export default function AddUser() {
  const [error, setError] = useState('');
  const router = useRouter()
  const[currentGroupId, setCurrentGroupId] = useState(undefined)
  const params = useParams()
  const [fetchedUser, setFetchedUser] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const supabase = createClientComponentClient()
  const [userLoading, setUserLoading] = useState(undefined)

  useEffect(() => {
      setCurrentGroupId(params.groupid)
  }, [params])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const groupId = event.target.groupId.value;

    const response = await fetch('/api/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, groupId }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/")
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    if(fetchedUser == undefined) {
      setUserLoading(true)
      const fetchSession = async () => {
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
    if(fetchedUser !== undefined && fetchedUser !== null) {
      const fetchName = async () => {

          const supabase = createClientComponentClient()
          const { data: found } = await supabase.from('users').select(`
            username
      `).eq('email', fetchedUser.email)

      setUsername(found[0]?.username)
    }

      fetchName()
      }

    }, [fetchedUser])


    useEffect(() => {
      if (!userLoading && userLoading !== undefined && !fetchedUser) {
        // This route can only be accessed by authenticated users.
        // Unauthenticated users will be redirected to the `/login` route.
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

    <main>
      <div className="overlay">
      <p className="text-white text-4xl pt-2.5" style={{paddingBottom: "20px"}}>Add user</p>
        {error && <p className="text-white">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="text-white">Username:</label>
          <div style={{display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "20px"}}>
            <input type="text" style={{maxWidth: "300px", height: "2rem"}}name="username" id="username" />
            <input type="hidden" name="groupId" id="groupId" value={currentGroupId}/>
            <button type="submit" className="py-2 px-4 rounded-md w-3/12 text-m bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500">Add</button>
          </div>
        </form>
        <Link className="py-2 px-4 rounded-md w-3/12 self-center text-m bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500" href="/">Back</Link>
      </div>
    </main>

    </div>
    </div>
  );
}