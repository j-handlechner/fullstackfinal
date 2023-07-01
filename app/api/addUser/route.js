import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request) {
    const supabase = createServerComponentClient({ cookies })

    const { username } = await request.json();

    if (typeof username !== 'string' || username.length === 0) {
      return NextResponse.json({
        message: 'Invalid Username'
        }, {
        status: 400,
        })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select()
      .eq('username', username);

    if (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({
        message: 'Internal Server Error'
        }, {
        status: 500,
        })
    }

    if (!user || user.length === 0) {
      return NextResponse.json({
        message: "User does not exist"
        }, {
        status: 404,
        })
    }

    const userId = user[0].userId;
    const groupId = 9;

    const { data: userAlreadyAdded, alreadyAddedError } = await supabase
      .from('userInGroup')
      .select()
      .eq('userId', userId)
      .eq('groupId', groupId);

    if (alreadyAddedError) {
      console.error('Error fetching user:', alreadyAddedError);
      return NextResponse.json({
        message: 'Internal Server Error'
        }, {
        status: 500,
        })
    }
    else{
      if (userAlreadyAdded && userAlreadyAdded.length > 0) {
      return NextResponse.json({
        message: "User is already added!"
        }, {
        status: 404,
        })
      }
      else{
            await supabase
            .from('userInGroup')
            .insert([{ userId: userId, groupId: groupId }]);

            return NextResponse.json({
            message: "User added to group successfully"
            }, {
            status: 200,
            })
        }
    }
}