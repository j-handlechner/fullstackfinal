import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const revalidate = 0

export async function GetUserName ({id})
{
    const supabase = createServerComponentClient({cookies})
    const { data: users } = await supabase.from('users').select().eq('userId', id)
    console.log(users)
    return (<p>{users[0].username}</p>)
}