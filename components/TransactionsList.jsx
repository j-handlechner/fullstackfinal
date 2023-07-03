"use client"

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

// import { cookies } from 'next/headers'
import {useState, useEffect} from "react"
export const revalidate = 0
import { useParams } from 'next/navigation'
import CreateNewExpense from "./CreateNewExpense"

export default function TransactionsList() {
    const [transactions, setTransactions] = useState(undefined)
    const [updateCounter, setUpdateCounter] = useState(0)

    const [groupId, setGroupId] = useState(undefined)
    const params = useParams()
    
    useEffect(() => {
        setGroupId(params.groupid)
    }, [])

    useEffect(() => {
       async function fetch() {
            const supabase = createClientComponentClient()
            const { data: transactions } = await supabase.from('transactions').select(`
            title, payedBy, total,
            users ( username )
        `).eq('groupId', groupId)
            setTransactions(transactions)
       }

        if(groupId !== undefined) {
            fetch()
            console.log("fetching transactions in transactionslist")
        }
      }, [groupId])

  if (!transactions) {
    return <p className="text-white">There are no transactions in this group.</p>
  }

  const updateList = () => {
    setUpdateCounter((prev) => prev + 1)
  }

  return (
    <>
        <ul>
            { transactions.map((t, idx) => {
                return <li className="text-white text-3xl" key={idx}>
                        <p>payed by {t.users.username}</p>
                        <p>total {t.total}</p>
                        <p>title {t.title}</p>
                    </li>
            })}
        </ul>

        <CreateNewExpense updateList={updateList} />
    </>
  )
}