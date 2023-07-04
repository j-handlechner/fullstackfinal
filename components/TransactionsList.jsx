"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

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
            transactionId, title, payedBy, total,
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
            <div style={{display: "flex", gap: "20px", justifyContent: "space-between", alignItems: "end", marginTop: "40px"}}>
                  <p className="text-white text-2xl pt-5 pb-2.5">Transactions in this group</p>
              <CreateNewExpense updateList={updateList} />
            </div>        

        <ul>
            { transactions.map((t, idx) => {
                return <>
                    <li className="text-white text-l" key={idx}>
                        <p>payed by {t.users.username}</p>
                        <p>total {t.total}</p>
                        <Link href={`/groups/${groupId}/transaction/${t.transactionId}`}><p className="underlined">title {t.title}</p></Link>
                    </li>
                    <div className="w-32 bg-white" style={{height: 1 + 'px'}}></div>
                    </>
            })}
        </ul>

    </>
  )
}