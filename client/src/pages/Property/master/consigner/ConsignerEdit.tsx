/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { editConsigner } from "../../../../services/Property/master/PmasterApis";
import { IoMdClose } from "react-icons/io";

interface props {
  show: boolean
  setShow: (show: boolean) => void
  fetchData: () => void
  selectedConsigner: any
}
const ConsignerEdit: FC<props> = ({ show, setShow, fetchData, selectedConsigner }) => {
  const [input, setInput] = useState({
    id: 0,
    name: "",
    status: ""
  })

  useEffect(() => {
    if (selectedConsigner) {
      setInput({
        id: selectedConsigner.id || 0,
        name: selectedConsigner.name || "",
        status: selectedConsigner.status || "",
      });
    }
  }, [selectedConsigner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      id: input.id,
      name: input.name,
      status: input.status
    }
    try {
      await editConsigner(body)
      setInput({
        id: 0,
        name: "",
        status: ""
      })
    } catch (error) {
      console.error("Error updating form:", error);
    } finally {
      setShow(false);
      fetchData();
    }

  }
  return (
    <div
      id="Consigner-edit-modal"
      className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 ${show ? "" : "hidden"}`}
      role="dialog"
      aria-labelledby="Consigner-edit-modal-label"
    >
      <div className="flex justify-center items-center min-h-screen m-2">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
            <h3 id="Consigner-edit-modal-label" className="font-bold text-slate-800 dark:text-white">
              Edit Consigner
            </h3>
            <button
              type="button"
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700"
              onClick={() => setShow(false)}
            >
              <IoMdClose color="black" />
            </button>
          </div>

          <form onSubmit={handleSubmit} >
            <div className="mx-3 my-2">
              <label htmlFor="ConsignerName">
                Consigner Name: <span className="text-red-600 text-xl">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="mt-2 py-3 px-4 block w-full border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase"
                placeholder="Enter Consigner..."
                value={input.name}
                onChange={handleChange}
              />
            </div>

            <div className="mx-3 my-2">
              <label htmlFor="status">
                Status: <span className="text-red-600 text-xl">*</span>
              </label>
              <select
                name="status"
                className="mt-2 py-3 px-4 pe-9 block w-full bg-slate-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-transparent dark:text-slate-400 dark:focus:ring-slate-600"
                value={input.status}
                onChange={handleChange}
              >
                <option value="">Select status</option>
                <option value="A" className="uppercase">Active</option>
                <option value="I" className="uppercase">In-active</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 items-center py-3 px-4 border-t dark:border-slate-700">
              <button
                type="submit"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Submit
              </button>
              <button
                type="button"
                className="py-3 px-4 inline-flex text-sm bg-slate-200 font-medium text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg"
                onClick={() => setShow(false)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConsignerEdit