import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request, { params }) {
  const supabase = createServerComponentClient({ cookies });

  const groupId = params.groupId;

  const { data: users, error: fetchUserError } = await supabase
    .from('userInGroup')
    .select(`users ( userId, username )`)
    .eq('groupId', groupId);

  if (fetchUserError) {
    console.error(fetchUserError);
    return NextResponse.json(
      {
        message: "Error occurred while fetching users"
      },
      {
        status: 500
      }
    );
  }

  return NextResponse.json(users);
}