"use client"

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { object, string, number } from 'yup';
import { useRouter, useParams } from 'next/navigation';

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

  useEffect(() => {
      console.log("params: ", params)
      setCurrentGroupId(params.groupid)
  }, [params])
  
  const router = useRouter();

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
/*
  for (const user of users) {
    const userId = user.users.userId.toString();
    initialValues[`check_${userId}`] = true;
    initialValues[`portion_${userId}`] = 0;
    initialValues[`equal_check_${userId}`] = false;
  }
*/
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
        const response = await fetch("../api/newExpense", {
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
    <main>
      <div className="overlay">
        <h2 className="text-white">New expense</h2>
        {error && <p className="text-white">{error}</p>}
        <form onSubmit={formik.handleSubmit}>
          <ul className="two-row-list flex-list-parent">
            <li>
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
            <li>
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
            <li>
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
                          <li key={user.users.userId}>
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
            <li>
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
          <button type="submit" className="button text-white">Add</button>
        </form>
      </div>
    </main>
  );
  }
}