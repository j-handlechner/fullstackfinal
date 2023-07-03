
"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import * as React from 'react';
import {useState, useEffect} from 'react';
import "./Dialog.css"
import { useParams } from 'next/navigation'
import { useFormik } from "formik"
import Link from 'next/link'

export const revalidate = 0

export default function CreateGroup({ updateList }) {
    const supabase = createClientComponentClient()

    const params = useParams()

    const [groupId, setGroupId] = useState(undefined)
    useEffect(() => {
      setGroupId(params.groupid)
    }, [])

    const [fetchedUser, setFetchedUser] = useState(undefined)
    const [currentUserId, setCurrentUserId] = useState(undefined)

    useEffect(() => {
      if(fetchedUser == undefined) {
        const fetchSession = async () => {
        
          const {
            data: { user },
          } = await supabase.auth.getUser()
    
          setFetchedUser(user)
        }
        fetchSession()
      }
  }, [])

  useEffect(() => {
    if(fetchedUser !== undefined) {
      const fetchName = async () => {
      
          const supabase = createClientComponentClient()
          const { data: found } = await supabase.from('users').select(`
            username, email, userId
      `).eq('email', fetchedUser.email)

      console.log("trying to find user with email: ", fetchedUser.email)
      console.log("found: ", found)

      setCurrentUserId(found[0]?.userId)
    }

      fetchName()
      }

    }, [fetchedUser])

    const formik = useFormik({
      initialValues: { groupname: '' },
      onSubmit: async (values) => { 
        console.log({
          id: values.groupname
        })


        if(values.groupname.length > 0) {
          const {data: insertedGroupsData} = await supabase.from("groups").insert({groupname: values.groupname}).select()
          console.log("insertedGroupsData: ", insertedGroupsData)

          // get userid of currently logged in user
          console.log("currently logged in user: ", currentUserId)

          // write new groupid and current user id in relationtable "userInGroup"
          const {errors} = await supabase.from("userInGroup").insert({userId: currentUserId, groupId: insertedGroupsData[0].groupId})

          updateList()
        }
        else {
          // groupname can't be empty
        }
      }
    })

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = ({msg, title, onClick}) => {
      setOpen(true);
      dialog.current.classList.remove("hide")
    };
  
    const handleClose = () => {
      setOpen(false);
      dialog.current.classList.add("hide")
    };
  
    const dialogbtn = React.useRef()
    const dialog = React.useRef()

  return (
    <>
        {/* <button ref={dialogbtn} className="py-2 px-4 rounded-md w-3/12 self-center text-m bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500" onClick={handleClickOpen}>
          Add new Expense
        </button>

        <div ref={dialog} className="bg-white dialogwrapper hide" >
          <form className="dialog" onSubmit={formik.handleSubmit}>
            <button onClick={handleClose}>close</button>
            
            <p>enter the new expense:</p>
            <input value={formik.values.groupname} name="groupname" onChange={formik.handleChange} />
            <button type="submit">submit</button>
            <button>cancel</button>
          </form>
        </div> */}

        <Link href={`/groups/${groupId}/newExpense`}>Add new expense</Link>
    </>
  )
}