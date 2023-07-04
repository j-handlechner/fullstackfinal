'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function AddUser() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactionDetails, setTransactionDetails] = useState()
    const params = useParams()
    const[transactionId, setTransactionId] = useState(undefined)
    useEffect(() => {
        setTransactionId(params.transactionId)
    })

    useEffect(() => {
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
        } else {
          throw new Error("Failed to fetch transaction details");
        }
      } catch (error) {
        setError("An error occurred while fetching transaction details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, []);

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
    );
  }
}