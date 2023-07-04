import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request, { params }) {
  const supabase = createServerComponentClient({ cookies });

  const transactionId = params.transactionId;

  const { data: transactionDetails, error: fetchDetailsError } = await supabase.from('userTransaction').select(`
    amount, 
    users ( userId, username ),
    transactions ( createdAt, title )
`).eq('transactionId', transactionId)

  

  if (fetchDetailsError) {
    console.error(fetchDetailsError);
    return NextResponse.json(
      {
        message: "Error occurred while fetching transaction details"
      },
      {
        status: 500
      }
    );
  }

  return NextResponse.json(transactionDetails);
}