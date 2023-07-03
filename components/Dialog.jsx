"use client"

import * as React from 'react';
import "./Dialog.css"

export default function FormDialog({title, msg, onSubmit}) {
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
    <div>
      <button ref={dialogbtn} className="py-2 px-4 rounded-md w-3/12 self-center text-m bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500" onClick={handleClickOpen}>
        Add new Group
      </button>

        <div ref={dialog} className="bg-white dialogwrapper hide" >
          <div className="dialog">
            <button onClick={handleClose}>close</button>
            <p>Title here</p>
            <p>some text some text some text some text v v some text some text some text</p>
            <button>submit</button>
            <button>cancel</button>
          </div>
        </div>
    </div>
    )
}