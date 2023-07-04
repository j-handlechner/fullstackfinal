"use client"

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { object, string, number } from 'yup';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from "../../../../components/LogoutButton"
import Link from 'next/link'
import { redirect } from 'next/navigation'

const validationSchema = object({
  title: string().required('Title is required'),
  payer: string().required('Payer is required'),
  total: number().required('Total is required'),
});

export default function NewExpense() {
  const [error, setError] = useState('');
  const [users, setFetchedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const[currentGroupId, setCurrentGroupId] = useState(undefined)
  const params = useParams()
  const [fetchedUser, setFetchedUser] = useState(undefined)
  const [username, setUsername] = useState(undefined)
  const supabase = createClientComponentClient()
  const [userLoading, setUserLoading] = useState(undefined)
  const [userId, setUserId] = useState(undefined)
  const [needToRedirect, setNeedToRedirect] = useState(false)

  useEffect(() => {
      console.log("params: ", params)
      setCurrentGroupId(params.groupid)
  }, [params])

  const router = useRouter();

  useEffect(() => {
    console.log("now in the thingy")
    async function fetchUsersInGroup() {
      console.log("executing fetchUsersInGroup")
      if (!userLoading && userLoading !== undefined && fetchedUser !== undefined && currentGroupId !== undefined && userId !== undefined) {
        console.log("in if")
        const { data: usersInGroup } = await supabase.from("userInGroup").select("userId").eq("groupId", currentGroupId)

        console.log("searching for the current user in ", usersInGroup)
        if(!usersInGroup.some(obj => Object.values(obj).includes(userId))) {
          // redirect("/groups")
          setNeedToRedirect(true)
        }
      } 
    }
    fetchUsersInGroup()
  }, [userLoading, userId, fetchedUser, currentGroupId, params])

  useEffect(() => {
    if(needToRedirect) {
      redirect("/login")
    }
  }, [needToRedirect])


  useEffect(() => {
    if(currentGroupId !== undefined) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`/api/getUsers/${currentGroupId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (response.ok) {
            const json = await response.json();
            setFetchedUsers(json);
            for (const user of json) {
              const userId = user.users.userId.toString();
              formik.setFieldValue(`check_${userId}`, true);
              formik.setFieldValue(`portion_${userId}`, 0);
              formik.setFieldValue(`equal_check_${userId}`, false);
            }
          } else {
            throw new Error("Failed to fetch users");
          }
        } catch (error) {
          setError("An error occurred while fetching users.");
        } finally {
          setIsLoading(false);
        }
      }

      fetchUsers();
    };
  }, [currentGroupId]);

  const initialValues = {
    title: "",
    payer: "",
    total: 0,
    comment: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      // Calculate the sum of checked portions
      let totalSum = 0;
      let equalChecks = 0;
      let equalCheckSum = 0;

      // Iterate over each user
      for (const user of users) {
        const userId = user.users.userId.toString();
        const isChecked = values[`check_${userId}`];
        const isPortionEqualCheck = values[`equal_check_${userId}`];

        // If the user's checkbox is checked
        if (isChecked) {
          // If the user has an equal check, increment the equal check counter
          if (isPortionEqualCheck) {
            equalChecks++;
          } else {
            // Otherwise, add the portion to the total sum
            totalSum += parseFloat(values[`portion_${userId}`]) || 0;
          }
        }
      }

      // Calculate the sum for equal checks
      if (equalChecks > 0) {
        // Calculate the remaining total value
        const remainingTotal = parseFloat(values.total) - totalSum;

        // Calculate the equal check sum
        equalCheckSum = remainingTotal / equalChecks;
      }

      // Prepare the data to be sent to the API
      const data = {
        title: values.title,
        payer: parseInt(values.payer),
        total: parseFloat(values.total),
        expenses: [],
        comment: values.comment,
        groupId: currentGroupId,
        createdAt: new Date().toISOString()
      };

      // Iterate over each user again to populate the expenses array
      for (const user of users) {
        const userId = user.users.userId.toString();
        const isChecked = values[`check_${userId}`];
        const isPortionEqualCheck = values[`equal_check_${userId}`];
        const portion = parseFloat(values[`portion_${userId}`]) || 0;

        if (isChecked) {
          let expensePortion = 0;

          // If the user has an equal check, assign the equal check sum
          if (isPortionEqualCheck) {
            expensePortion = equalCheckSum;
          } else {
            expensePortion = portion;
          }

          // Add the expense to the expenses array
          data.expenses.push({
            user: parseInt(userId),
            portion: expensePortion,
          });
        } else {
          // Set the portion to 0 for unchecked users
          data.expenses.push({
            user: parseInt(userId),
            portion: 0,
          });
        }
      }
      
      // Calculate the sum of portions in the expenses array
      const portionsSum = data.expenses.reduce(
        (sum, expense) => sum + expense.portion,
        0
      );

      // Check if the sum of portions is equal to the total
      const tolerance = 0.001;
      if (Math.abs(portionsSum - data.total) > tolerance) {
        // Display an error and return if not equal
        //console.log("Sum of portions does not match the total sum");
        setError("Sum of portions does not match the total sum");
        return;
      }
        
        // Send the data to the API
        const response = await fetch("/api/newExpense", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle the response
        if (response.ok) {
          // Handle successful submission
          console.log("Expense added successfully!");
          router.push("/")
        } else {
          // Handle error response
          setError("An error occurred while adding the expense.");
        }
    },
  });

  const toggleField = (user) => {
    formik.setFieldValue(`portion_${user}`, 0);
    formik.setFieldValue(`equal_check_${user}`, !formik.values[`equal_check_${user}`]);
  };

  const toggleUser = (user) => {
    formik.setFieldValue(`check_${user}`, !formik.values[`check_${user}`]);
    //toggleField(user);
  };

  useEffect(() => {
    if(fetchedUser == undefined) {
      setUserLoading(true)
      const fetchSession = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
  
        setFetchedUser(user)
        setUserLoading(false)
      }
      fetchSession()
    }
}, [])


  useEffect(() => {
    if(fetchedUser !== undefined && fetchedUser !== null) {
      const fetchName = async () => {

          const supabase = createClientComponentClient()
          const { data: found } = await supabase.from('users').select(`
            username, userId
      `).eq('email', fetchedUser.email)

      setUsername(found[0]?.username)
      setUserId(found[0]?.userId)
    }

      fetchName()
      }

    }, [fetchedUser])


    useEffect(() => {
      if (!userLoading && userLoading !== undefined && !fetchedUser) {
        // This route can only be accessed by authenticated users.
        // Unauthenticated users will be redirected to the `/login` route.
        redirect('/login')
      }
    }, [userLoading])

  if (isLoading || users.length === 0) {
    return (
      <main>
        <div className="overlay">
          <p className="text-white">Loading...</p>
        </div>
      </main>
    ) // Show a loading indicator while fetching data
  }
  else{

  return (
    <div className="w-full flex flex-col items-center">
    <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
      <p className="text-white p-3">fullstack challenge</p>
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
        <div />
        <div>
            <div className="flex items-center gap-4">
              Hey {username}!
              <LogoutButton />
            </div>
        </div>
      </div>
    </nav>
      <div className="w-full max-w-4xl p-5">
      <Link
          href="/groups"
          className="text-white text-xl pt-5"
        >← Back to groups</Link>

    <main>
              <p className="text-white text-4xl pt-2.5" style={{paddingBottom: "20px"}}>New Expense</p>

      <div className="overlay">
        {error && <p className="text-white">{error}</p>}
        <form onSubmit={formik.handleSubmit}>
          <ul className="two-row-list flex-list-parent">
            <li style={{paddingBottom: "20px"}}>
              <label htmlFor="title" className="text-white">Title*</label>
              <span className="flex-right">
                <input
                  type="text"
                  name="title"
                  id="title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
              </span>
            </li>
            <li style={{paddingBottom: "20px"}}>
              <p className="text-white">Who paid?*</p>
              <span className="flex-right">
                <select
                  name="payer"
                  onChange={formik.handleChange}
                  value={formik.values.payer}
                >
                  <option value="" disabled>
                    - Select User -
                  </option>
                  {users.map((user) => (
                    <option key={user.users.userId} value={user.users.userId}>
                      {user.users.username}
                    </option>
                  ))}
                </select>
              </span>
            </li>
            <li style={{paddingBottom: "20px"}}>
              <label htmlFor="total" className="text-white">Total*</label>
              <span className="flex-right">
                <input
                  type="number"
                  step=".01"
                  name="total"
                  className="number-field"
                  onChange={formik.handleChange}
                  value={formik.values.total}
                />
                €
              </span>
            </li>
            {users.map((user) => {
                        return (
                          <li key={user.users.userId} style={{paddingBottom: "20px"}}>
                            <span>
                              <label htmlFor={`check_${user.users.userId}`} className="text-white">
                                <input
                                  type="checkbox"
                                  name={`check_${user.users.userId}`}
                                  id={`check_${user.users.userId}`}
                                  checked={formik.values[`check_${user.users.userId}`]}
                                  onChange={() => toggleUser(user.users.userId)}
                                />
                                {user.users.username}:
                              </label>
                            </span>
                            <span></span>
                            <span>
                              <input
                                type="number"
                                step=".01"
                                name={`portion_${user.users.userId}`}
                                id={`portion_${user.users.userId}`}
                                className="number-field"
                                onChange={formik.handleChange}
                                value={formik.values[`portion_${user.users.userId}`]}
                                disabled={!formik.values[`check_${user.users.userId}`] || formik.values[`equal_check_${user.users.userId}`]}
                              />
                              <span className="text-white">€</span>
                            </span>
                            <span className="flex-right">
                              <span className="text-white"> or </span>
                              <input
                                type="checkbox"
                                name={`equal_check_${user.users.userId}`}
                                id={`equal_check_${user.users.userId}`}
                                checked={formik.values[`equal_check_${user.users.userId}`]}
                                onChange={() => toggleField(user.users.userId)}
                                disabled={!formik.values[`check_${user.users.userId}`]}
                              />
                              <label htmlFor={`equal_check_${user.users.userId}`} className="text-white">
                                split the rest
                              </label>
                            </span>
                          </li>
                        )
                    })}
            <li style={{paddingBottom: "20px"}}>
              <label htmlFor="comment" className="text-white">Comment</label>
              <span className="flex-right">
                <textarea
                  name="comment"
                  id="comment"
                  onChange={formik.handleChange}
                  value={formik.values.comment}
                ></textarea>
              </span>
            </li>
          </ul>
          <button type="submit" className="py-2 px-4 rounded-md w-3/12 self-center text-m bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500">Add</button>
        </form>
      </div>
    </main>
    </div>
    </div>
  );
  }
}