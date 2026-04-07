/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDoneOutline } from "react-icons/io5"
import { getSaleModalData } from "../../../../services/Property/transaction/pTranApis";
import { useDispatch } from "react-redux";
import { handleSaleProperty } from "../../../../feature/Preperties/ptransaction/PTransactionSlice";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
}
interface Data {
  doc_id: number,
  file_name: string,
  doc_date: string
}

const PropModal: FC<Props> = ({ show, setShow }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await getSaleModalData();
        if (response) {
          setData(response);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [show])

  const filteredData = data.filter((item: Data) =>
    item?.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.doc_date?.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())
  );

  const handleSelect = (item: any) => {
    dispatch(handleSaleProperty({ id: item.doc_id, name: item.file_name, date: item.doc_date }))
    setShow(false);
  }

  return (
    <div
      id="Property-modal"
      className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 transition-opacity duration-300 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      role="dialog"
      aria-labelledby="Property-modal-label"
    >
      <div className="flex justify-center items-center min-h-screen m-2">
        <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
            <h3 id="Property-modal-label" className="font-bold text-slate-800 dark:text-white">
              Select Property
            </h3>
            <button
              type="button"
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700"
              onClick={() => setShow(false)}
            >
              <IoMdClose color="black" />
            </button>
          </div>
          <div className="mx-3 my-1">
            <input
              type="text"
              className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <div className="px-4 max-h-[70vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-2 py-3 text-start text-xs font-medium text-slate-500 uppercase">Code</th>
                  <th className="px-2 py-3 text-start text-xs font-medium text-slate-500 uppercase">Property Name</th>
                  <th className="px-2 py-3 text-end text-xs font-medium text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item: Data, index: number) => (
                    <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                      <td className="px-2 py-3">{item.doc_id}</td>
                      <td className="px-2 py-3 uppercase">{item.file_name}</td>
                      <td className="px-2 py-3 text-end">
                        <button
                          type="button"
                          className="py-2 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-700 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20"
                          onClick={() => handleSelect(item)}
                        >
                          <IoCheckmarkDoneOutline size={20} />
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No property found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          <div className="flex justify-end gap-4 items-center py-3 px-4 border-t dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-slate-500 text-white hover:bg-slate-600 focus:outline-hidden focus:bg-slate-600 disabled:opacity-50 disabled:pointer-events-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default PropModal