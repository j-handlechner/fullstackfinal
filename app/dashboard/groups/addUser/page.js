"use client"

import { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const revalidate = 0;

export default function AddUser() {
  const [error, setError] = useState('');
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;

    const response = await fetch('/api/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
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
        <h2>Add user</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
          <button type="submit" className="button">Add</button>
        </form>
        <Link className="button" href="/">Back</Link>
      </div>
    </main>
  );
}