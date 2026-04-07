/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { formatDate } from "../../../../helper/DateFormate";
import { updateSaledProp } from "../../../../services/Property/transaction/pTranApis";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  fetchData: () => void;
  data: any;
}
const EditSaleProp: FC<Props> = ({ show, setShow, fetchData, data }) => {
  const [inputs, setInputs] = useState({
    sale_id: 0,
    docNo: 0,
    docDate: "",
    fileName: "",
    buyerName: "",
    saleArea: "",
    surveyNo: "",
    saleValue: "",
    saleDate: "",
    remark: "",
  });

  useEffect(() => {
    setInputs({
      sale_id: data.sale_id,
      docNo: data.doc_id || 0,
      docDate: formatDate(data.doc_date) || "",
      fileName: data.file_name || "",
      buyerName: data.buyer_name || "",
      saleArea: data.sale_area || "",
      saleValue: data.sale_value || "",
      surveyNo: data.sur_no || "",
      saleDate: formatDate(data.sale_date) || "",
      remark: data.remark || "",
    })
  }, [data])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value, });
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      sale_id: inputs.sale_id,
      date: inputs.docDate,
      doc_no: inputs.docNo,
      sale_date: inputs.saleDate,
      buyer_name: inputs.buyerName,
      sale_value: inputs.saleArea,
      sale_area: inputs.saleArea,
      sur_no: inputs.surveyNo,
      remark: inputs.remark,

    }
    try {
      const response = await updateSaledProp(body);
      if (response) {
        fetchData();
        setInputs({
          sale_id: 0,
          docNo: 0,
          docDate: "",
          fileName: "",
          buyerName: "",
          saleArea: "",
          surveyNo: "",
          saleValue: "",
          saleDate: "",
          remark: "",
        });
        setShow(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    fetchData();
    setInputs({
      sale_id: 0,
      docNo: 0,
      docDate: "",
      fileName: "",
      buyerName: "",
      saleArea: "",
      surveyNo: "",
      saleValue: "",
      saleDate: "",
      remark: "",
    });
    setShow(false);
  }

  return (
    <div
      id="edit-saleProp-modal"
      className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-400 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      role="dialog" aria-labelledby="edit-saleProp-modal-label">

      <div className="flex justify-center items-center min-h-screen m-2">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">

          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Edit Saled Property
            </h3>
            <button
              onClick={() => setShow(false)}
              className="text-slate-600 hover:text-slate-800 dark:text-slate-100 dark:hover:text-white p-2 rounded-full bg-slate-100 dark:bg-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            <form onSubmit={handleSubmit} >
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-6">
                <div className="sm:col-span-6">
                  <label htmlFor="docNo" className="block mb-2 dark:text-white">
                    Doc No./Doc Name
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="docNo"
                        name="docNo"
                        value={inputs.docNo && `${inputs.docNo} - ${inputs.fileName} `}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500
                        cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="docDate" className="block mb-2 dark:text-white">
                    Doc Date
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="date"
                        id="docDate"
                        name="docDate"
                        value={inputs.docDate}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-6">
                <div className="sm:col-span-6">
                  <label htmlFor="saleDate" className="block mb-2 dark:text-white">
                    Sale Date
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="date"
                        id="saleDate"
                        name="saleDate"
                        value={inputs.saleDate}
                        onChange={(e) => handleInputChange(e)}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="buyerName" className="block mb-2 dark:text-white">
                    Buyer Name
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="buyerName"
                        name="buyerName"
                        value={inputs.buyerName}
                        onChange={(e) => handleInputChange(e)}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-6">
                <div className="sm:col-span-6">
                  <label htmlFor="saleValue" className="block mb-2 dark:text-white">
                    Sale Value
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="saleValue"
                        name="saleValue"
                        value={inputs.saleValue}
                        onChange={(e) => handleInputChange(e)}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="saleArea" className="block mb-2 dark:text-white">
                    Sale Area
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="saleArea"
                        name="saleArea"
                        value={inputs.saleArea}
                        onChange={(e) => handleInputChange(e)}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500
                        cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-6">
                <div className="sm:col-span-6">
                  <label htmlFor="surveyNo" className="block mb-2 dark:text-white">
                    Survey No.
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="surveyNo"
                        name="surveyNo"
                        value={inputs.surveyNo}
                        onChange={(e) => handleInputChange(e)}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-600 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="remark" className="block mb-2 dark:text-white">
                    Remark
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <textarea
                        id="remark"
                        name="remark"
                        value={inputs.remark}
                        onChange={(e) => handleInputChange(e)}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 ">
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-slate-300 bg-slate-200 text-slate-800 shadow-2xs hover:bg-slate-300 focus:outline-hidden focus:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-700 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700"
                  onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSaleProp