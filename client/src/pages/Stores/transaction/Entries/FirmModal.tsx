/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { getActiveFirms } from "../../../../services/Stores/transaction/transactionApi";
import { useDispatch } from "react-redux";
import { handleFirm } from "../../../../feature/Stores/transaction/TransactionSlice";

interface props {
  show: boolean
  setShow: (show: boolean) => void
}

const FirmMidal: FC<props> = ({ show, setShow }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getActiveFirms()
      setData(response)
    } catch (error) {
      console.log("Error Fetching Data", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [show]);

  const currentItems = data?.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (item: any) => {
    dispatch(handleFirm({ id: item.id, name: item.name }))
    setShow(false)
  }

  return (
    <div
      id="firm-modal"
      className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 ${show ? "" : "hidden"}`}
      role="dialog"
      aria-labelledby="firm-modal-label"
    >
      <div className="flex justify-center items-center min-h-screen m-2">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
            <h3 id="firm-modal-label" className="font-bold text-slate-800 dark:text-white">
              Select Firm
            </h3>
            <button
              type="button"
              className="p-2 rounded-full border border-slate-400"
              onClick={() => setShow(false)}
            >
              <IoMdClose />
            </button>
          </div>
          <div className="mx-3 my-1">
            <input
              type="text"
              className="py-3 px-4 block w-full border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100"
              placeholder="Type to search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="px-4 max-h-[70vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-2 py-3 text-start text-xs font-medium text-slate-500 uppercase">firm Code</th>
                  <th className="px-2 py-3 text-start text-xs font-medium text-slate-500 uppercase">firm Name</th>
                  <th className="px-2 py-3 text-end text-xs font-medium text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ?
                  (<tr>
                    <td colSpan={13} className="text-center py-4">Loading...</td>
                  </tr>)
                  : (<>
                    {currentItems?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                        <td className="px-2 py-3">{item.id}</td>
                        <td className="px-2 py-3 uppercase">{item.name}</td>
                        <td className="px-2 py-3 text-end">
                          <button
                            type="button"
                            className="py-2 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-700 bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20"
                            onClick={() => handleSelect(item)}
                          >
                            <IoCheckmarkDoneOutline size={20} />
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={13} className="text-center py-4">{currentItems?.length === 0 ? "No items found" : null}</td>
                    </tr>
                  </>)}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center py-3 px-4 border-t dark:border-slate-700">
            <button
              type="button"
              className="py-3 px-4 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white rounded-lg"
              onClick={() => setShow(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirmMidal