"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export const revalidate = 0;

export default function AddUser() {
  const [error, setError] = useState('');
  const router = useRouter()
  const[currentGroupId, setCurrentGroupId] = useState(undefined)
  const params = useParams()
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

  return (
    <main>
      <div className="overlay">
        <h2 className="text-white">Add user</h2>
        {error && <p className="text-white">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="text-white">Username:</label>
          <input type="text" name="username" id="username" />
          <input type="hidden" name="groupId" id="groupId" value={currentGroupId}/>
          <button type="submit" className="button text-white">Add</button>
        </form>
        <Link className="button text-white" href="/">Back</Link>
      </div>
    </main>
  );
}