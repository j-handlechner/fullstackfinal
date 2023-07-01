"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Dialog from "./Dialog"

export const revalidate = 0

export default function CreateGroup({ userId }) {
    const supabase = createClientComponentClient()

  return (
    <Dialog />
  )
}