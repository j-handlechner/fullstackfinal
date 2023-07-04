import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });

  const { title, payer, total, expenses, comment, groupId, createdAt } = await request.json();

  // Insert transaction into the 'transactions' table
  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert([
      {
        groupId: groupId,
        total: parseFloat(total),
        payedBy: payer,
        comment: comment,
        createdAt: createdAt,
        title: title
      }
    ])
    .select('*');

  if (transactionError) {
    // Handle error if transaction insertion fails
    console.error(transactionError);
    return NextResponse.json(
      {
        message: "Error occurred while adding transaction"
      },
      {
        status: 500
      }
    );
  }

  const transactionId = transactionData[transactionData.length-1].transactionId; // Get the inserted transaction id

  const { error: payerTransactionError } = await supabase.from('userTransaction').insert([
    {
      userId: payer,
      transactionId: transactionId,
      amount: parseFloat(total)
    }
  ]);

  if (payerTransactionError) {
    // Handle error if insertion into 'userTransaction' for payer fails
    console.error(payerTransactionError);
    return NextResponse.json(
      {
        message: "Error occurred while adding payer's userTransaction"
      },
      {
        status: 500
      }
    );
  }

  // Insert expenses into the 'userTransaction' table
  const expensesInsertPromises = expenses.map(async (expense) => {
    const userId = parseInt(expense.user);
    const amount = parseFloat(expense.portion);

    const { error: expenseInsertError } = await supabase.from('userTransaction').insert([
      {
        userId: userId,
        transactionId: transactionId,
        amount: amount === 0 ? amount : -1 * amount
      }
    ]);

    if (expenseInsertError) {
      // Handle error if insertion into 'userTransaction' for an expense fails
      console.error(expenseInsertError);
      return NextResponse.json(
        {
          message: "Error occurred while adding the expense userTransactions"
        },
        {
          status: 500
        }
      );
    }
  });

  await Promise.all(expensesInsertPromises); // Wait for all expense insertions to complete

  return NextResponse.json(
    {
      message: "Transaction and userTransactions added successfully"
    },
    {
      status: 200
    }
  );
}