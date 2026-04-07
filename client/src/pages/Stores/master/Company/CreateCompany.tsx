/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { newFirm } from "../../../../services/Stores/master/MasterApis";
import toast from "react-hot-toast";

interface props {
  show: boolean
  setShow: (show: boolean) => void
  fetchData: () => void
}

const CreateCompany: FC<props> = ({ show, setShow, fetchData }) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!name) {
      toast.error('Please enter company name');
      return;
    }
    const body = { name };
    try {
      const response = await newFirm(body);
      if (response) {
        setShow(false);
        fetchData();
      }
      setName("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div
      id="company-create-modal"
      className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 ${show ? "" : "hidden"}`}
      role="dialog"
      aria-labelledby="company-create-modal-label"
    >
      <div className="flex justify-center items-center min-h-screen m-2">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
            <h3 id="company-create-modal-label" className="font-bold text-slate-800 dark:text-white">
              Add new firm
            </h3>
            <button
              type="button"
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700"
              onClick={() => setShow(false)}
            >
              <IoMdClose color="black" />
            </button>
          </div>
          <div className="mx-3 my-2">
            <label htmlFor="firmname">Firm Name: <span className="text-red-600 text-xl">*</span></label>
            <input
              value={name}
              type="text"
              className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="Enter firm..."
              onChange={(e: any) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-4 items-center py-3 px-4 border-t dark:border-slate-700">
            <button
              type="submit"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleSubmit}>
              Submit</button>
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-slate-500 text-white hover:bg-slate-600 focus:outline-hidden focus:bg-slate-600 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => setShow(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CreateCompany