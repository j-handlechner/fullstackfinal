"use client"

import { useState } from "react";
import { useFormik } from "formik";

export default function NewExpense() {
  const initialValues = {
    title: "",
    payer: "",
    total: "",
    check_18: true,
    check_20: true,
    check_19: true,
    check_1: true,
    portion_18: 0,
    portion_20: 0,
    portion_19: 0,
    portion_1: 0,
    equal_check_18: false,
    equal_check_20: false,
    equal_check_19: false,
    equal_check_1: false,
    comment: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
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

  return (
    <main>
      <div className="overlay">
        <h2>New expense</h2>
        <form onSubmit={formik.handleSubmit}>
          <ul className="two-row-list flex-list-parent">
            <li>
              <label htmlFor="title">Title</label>
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
              Who paid?
              <span className="flex-right">
                <select
                  name="payer"
                  onChange={formik.handleChange}
                  value={formik.values.payer}
                >
                  <option value="" disabled>
                    - Select User -
                  </option>
                  <option value="18">Kalin</option>
                  <option value="20">Mary</option>
                  <option value="19">Tom</option>
                  <option value="1">Vinz</option>
                </select>
              </span>
            </li>
            <li>
              <label htmlFor="total">Total</label>
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
            <li>
              <span>
                <label htmlFor="check_18">
                  <input
                    type="checkbox"
                    name="check_18"
                    id="check_18"
                    checked={formik.values.check_18}
                    onChange={() => toggleUser(18)}
                  />
                  Kalin:
                </label>
              </span>
              <span></span>
              <span>
                <input
                  type="number"
                  step=".01"
                  name="portion_18"
                  id="portion_18"
                  className="number-field"
                  onChange={formik.handleChange}
                  value={formik.values.portion_18}
                  disabled={!formik.values.check_18 || formik.values[`equal_check_18`]}
                />
                €
              </span>
              <span className="flex-right">
                or
                <input
                  type="checkbox"
                  name="equal_check_18"
                  id="equal_check_18"
                  checked={formik.values.equal_check_18}
                  onChange={() => toggleField(18)}
                  disabled={!formik.values.check_18}
                />
                <label htmlFor="equal_check_18">split the rest</label>
              </span>
            </li>
            <li>
              <span>
                <label htmlFor="check_20">
                  <input
                    type="checkbox"
                    name="check_20"
                    id="check_20"
                    checked={formik.values.check_20}
                    onChange={() => toggleUser(20)}
                  />
                  Mary:
                </label>
              </span>
              <span></span>
              <span>
                <input
                  type="number"
                  step=".01"
                  name="portion_20"
                  id="portion_20"
                  className="number-field"
                  onChange={formik.handleChange}
                  value={formik.values.portion_20}
                  disabled={!formik.values.check_20 || formik.values[`equal_check_20`]}
                />
                €
              </span>
              <span className="flex-right">
                or
                <input
                  type="checkbox"
                  name="equal_check_20"
                  id="equal_check_20"
                  checked={formik.values.equal_check_20}
                  onChange={() => toggleField(20)}
                  disabled={!formik.values.check_20}
                />
                <label htmlFor="equal_check_20">split the rest</label>
              </span>
            </li>
            <li>
              <span>
                <label htmlFor="check_19">
                  <input
                    type="checkbox"
                    name="check_19"
                    id="check_19"
                    checked={formik.values.check_19}
                    onChange={() => toggleUser(19)}
                  />
                  Tom:
                </label>
              </span>
              <span></span>
              <span>
                <input
                  type="number"
                  step=".01"
                  name="portion_19"
                  id="portion_19"
                  className="number-field"
                  onChange={formik.handleChange}
                  value={formik.values.portion_19}
                  disabled={!formik.values.check_19 || formik.values[`equal_check_19`]}
                />
                €
              </span>
              <span className="flex-right">
                or
                <input
                  type="checkbox"
                  name="equal_check_19"
                  id="equal_check_19"
                  checked={formik.values.equal_check_19}
                  onChange={() => toggleField(19)}
                  disabled={!formik.values.check_19}
                />
                <label htmlFor="equal_check_19">split the rest</label>
              </span>
            </li>
            <li>
              <span>
                <label htmlFor="check_1">
                  <input
                    type="checkbox"
                    name="check_1"
                    id="check_1"
                    checked={formik.values.check_1}
                    onChange={() => toggleUser(1)}
                  />
                  Vinz:
                </label>
              </span>
              <span></span>
              <span>
                <input
                  type="number"
                  step=".01"
                  name="portion_1"
                  id="portion_1"
                  className="number-field"
                  onChange={formik.handleChange}
                  value={formik.values.portion_1}
                  disabled={!formik.values.check_1 || formik.values[`equal_check_1`]}
                />
                €
              </span>
              <span className="flex-right">
                or
                <input
                  type="checkbox"
                  name="equal_check_1"
                  id="equal_check_1"
                  checked={formik.values.equal_check_1}
                  onChange={() => toggleField(1)}
                  disabled={!formik.values.check_1}
                />
                <label htmlFor="equal_check_1">split the rest</label>
              </span>
            </li>
            <li>
              <label htmlFor="comment">Comment</label>
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
           <p className="center-ui"><input type="submit" value="Add"
                        name="create" className="button"/></p>
        </form>
      </div>
    </main>
  );
}










/*
import { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewExpense ()
{
    function toggleField(user) {
        // Get the checkbox
        let checkBox = document.getElementById("equal_check_" + user);
        // Get the output text
        let textField = document.getElementById("portion_" + user);

        // If the checkbox is checked, display the output text
        if (checkBox.checked) {
            textField.setAttribute("disabled", "disabled");
        } else {
            textField.removeAttribute("disabled");
            }
        }

    function toggleUser(user) {
        // Get the checkbox
        let checkBox = document.getElementById("check_" + user);

        // If the checkbox is checked, display the output text
        if (checkBox.checked) {
            document.getElementById("equal_check_" + user).removeAttribute("disabled", "disabled");
            toggleField(user);
        } else {
                document.getElementById("equal_check_" + user).setAttribute("disabled", "disabled");
                document.getElementById("portion_" + user).setAttribute("disabled", "disabled");
            }
        }
    return (
        <main>
            <div className="overlay">
                <h2>New expense</h2>
                <form action="addExpense.php" method="post">
                <ul className="two-row-list flex-list-parent">
                    <li>
                        <label htmlFor="title">Title </label>
                        <span className="flex-right">
                            <input type="text" name="title"
                                id="title"/>
                        </span>
                    </li>
                    <li> Who paid? <span className="flex-right">
                            <select name="payer">
                                <option selected="selected" hidden="">
                                    - Select User -</option>
                                <option value="18">Kalin</option>
                                <option value="20">Mary</option>
                                <option value="19">Tom</option>
                                <option value="1">Vinz</option>
                            </select>
                        </span>
                    </li>
                    <li>
                        <label htmlFor="total">Total </label>
                        <span className="flex-right">
                            <input type="number" step=".01"
                                name="total" className="number-field"/>€
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" name="check_18"
                                id="check_18" checked="checked"
                                onClick={() => toggleUser(18)}
                                />
                            <label htmlFor="check_18">Kalin: </label>
                        </span>
                        <span></span>
                        <span>
                            <input type="number" step=".01"
                                name="portion_18" id="portion_18"
                                value="0" className="number-field"/>€
                        </span>
                        <span className="flex-right"> or <input
                                type="checkbox" name="equal_check_18"
                                id="equal_check_18"
                                onClick={() => toggleField(18)}/>
                            <label htmlFor="equal_check_18"> split the
                                rest</label>
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" name="check_20"
                                id="check_20" checked="checked"
                                onClick={() => toggleUser(20)}/>
                            <label htmlFor="check_20">Mary: </label>
                        </span>
                        <span></span>
                        <span>
                            <input type="number" step=".01"
                                name="portion_20" id="portion_20"
                                value="0" className="number-field"/>€
                        </span>
                        <span className="flex-right"> or <input
                                type="checkbox" name="equal_check_20"
                                id="equal_check_20"
                                onClick={() => toggleField(20)}/>
                            <label htmlFor="equal_check_20"> split the
                                rest</label>
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" name="check_19"
                                id="check_19" checked="checked"
                                onClick={() => toggleUser(19)}/>
                            <label htmlFor="check_19">Tom: </label>
                        </span>
                        <span></span>
                        <span>
                            <input type="number" step=".01"
                                name="portion_19" id="portion_19"
                                value="0" className="number-field"/>€
                        </span>
                        <span className="flex-right"> or <input
                                type="checkbox" name="equal_check_19"
                                id="equal_check_19"
                                onClick={() => toggleField(19)}/>
                            <label htmlFor="equal_check_19"> split the
                                rest</label>
                        </span>
                    </li>
                    <li>
                        <span>
                            <input type="checkbox" name="check_1"
                                id="check_1" checked="checked"
                                onClick={() => toggleUser(1)}/>
                            <label htmlFor="check_1">Vinz: </label>
                        </span>
                        <span></span>
                        <span>
                            <input type="number" step=".01"
                                name="portion_1" id="portion_1"
                                value="0" className="number-field"/>€
                        </span>
                        <span className="flex-right"> or <input
                                type="checkbox" name="equal_check_1"
                                id="equal_check_1"
                                onClick={() => toggleField(1)}/>
                            <label htmlFor="equal_check_1"> split the
                                rest</label>
                        </span>
                    </li>
                    <li>
                        <label htmlFor="comment">Comment: </label>
                        <textarea name="comment"></textarea>
                    </li>
                </ul>
                <input type="hidden" name="groupId" value="9"/>
                <p className="center-ui"><input type="submit" value="Add"
                        name="create" className="button"/></p>
            </form>
            </div>
        </main>
    )
}*/