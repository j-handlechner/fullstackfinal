'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { useParams } from 'next/navigation'
import LogoutButton from "../../../../../components/LogoutButton"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AddUser() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactionDetails, setTransactionDetails] = useState()
    const params = useParams()
    const[transactionId, setTransactionId] = useState(undefined)
    const [fetchedUser, setFetchedUser] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    const supabase = createClientComponentClient()
    const [userLoading, setUserLoading] = useState(undefined)

    useEffect(() => {
      console.log("params: ", params)
        setTransactionId(params.transactionid)
    }, [params])

    useEffect(() => {
      console.log("doing fetchuseffect")
      if(transactionId !== undefined) {
        const fetchDetails = async () => {
          try {
            const response = await fetch(`/api/getTransactionDetails/${transactionId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
    
            if (response.ok) {
              const json = await response.json();
              setTransactionDetails(json)
              console.log("transactiondetails: ", transactionDetails)
            } else {
              throw new Error("Failed to fetch transaction details");
            }
          } catch (error) {
            // setError("An error occurred while fetching transaction details.");
          } finally {
            setIsLoading(false);
          }
        };
        fetchDetails();
      }
  }, [transactionId]);

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

    if (isLoading || transactionDetails.length === 0) {
    return (
      <main>
        <div className="overlay">
          <p className="text-white">Loading...</p>
        </div>
      </main>
    )
  }
  else{
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
        <h2 className="text-white mb-8 text-4xl">{transactionDetails[0].transactions.title}</h2>
        <p className="text-white mb-6">{new Date(transactionDetails[0].transactions.createdAt).toLocaleString()}</p>
        <ul className="list-none p-0 mb-8">
          {transactionDetails.slice(1).map((transaction) => (
            <span>
              <li key={transaction.users.userId} className="flex justify-between items-center py-2 text-white">
                <span className="flex-grow">{transaction.users.username}</span>
                <span className="text-right"><span className="text-red-500">{Math.abs(transaction.amount)}</span></span>
              </li>
              <hr className="my-2" />
            </span>
          ))}
          <li key={transactionDetails[0].users.userId} className="flex justify-between items-center py-2 text-white">
            <span className="flex-grow">{transactionDetails[0].users.username}</span>
            <span className="text-right">
            <span className="text-green-500">{transactionDetails[0].amount}</span>
          </span>
          </li>
        </ul>
        <Link className="text-white" href="/">Back</Link>
      </div>
    </main>

    </div>
    </div>
    );
  }
}