/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useState } from 'react'
import { tablehead } from '../../../../constant/BaseUrl'
import PropModal from './PropModal';
import { RootState } from '../../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getSaleProperty, newSaleProperty } from '../../../../services/Property/transaction/pTranApis';
import { formatDate } from '../../../../helper/DateFormate';
import { handleSaleProperty } from '../../../../feature/Preperties/ptransaction/PTransactionSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiX, FiSave } from 'react-icons/fi';

interface Data {
  doc_id: number;
  doc_date: string;
  consignor: string;
  cst_no: string;
  pur_date: string;
  pur_val: number;
  reg_fees: number;
  fra_fees: number;
  survey: {
    sr_no: number;
    cong_id: number;
    con_name: string;
    sur_no: string;
    area: string;
    balance: string;
    sqmtr: number;
    status: string;
  }[];
}

const SaleNewEntry = () => {
  const [showProp, setShowProp] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [inputs, setInputs] = useState({
    saleDate: "",
    buyerName: "",
    saleValue: 0,
    saleArea: "",
    saleSurvey: "",
    remark: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { propDate, propId, propName } = useSelector((state: RootState) => state.ptansaction);

  const fetchData = async () => {
    if (!propDate || !propId) {
      //toast.error("Select the property");
      return
    }
    const body = {
      doc_id: propId || 1,
      doc_date: formatDate(propDate) || "",
    }
    try {
      const response = await getSaleProperty(body);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [propDate, propId, propName]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!propId || !propDate || !inputs.buyerName || !inputs.saleDate || !inputs.saleSurvey || !inputs.saleValue || !inputs.saleArea) {
      toast.error("Please fill all required fields.");
      return;
    }

    const body = {
      doc_id: propId,
      doc_date: formatDate(propDate),
      buyer_name: inputs.buyerName,
      sale_date: inputs.saleDate,
      sale_value: inputs.saleValue,
      sale_area: inputs.saleArea,
      sale_survey: inputs.saleSurvey,
      remark: inputs.remark,
    }
    try {
      const response = await newSaleProperty(body);
      if (response) {
        setInputs({
          saleDate: "",
          buyerName: "",
          saleValue: 0,
          saleArea: "",
          saleSurvey: "",
          remark: "",
        });
        setData(null);
        dispatch(handleSaleProperty({ id: 0, name: "", date: "" }))
        navigate("/property/sale-view")
      }
    } catch (error) {
      console.log(error);
    }

  }

  const handleCancel = () => {
    setInputs({
      saleDate: "",
      buyerName: "",
      saleValue: 0,
      saleArea: "",
      saleSurvey: "",
      remark: "",
    });
    setData(null);
    dispatch(handleSaleProperty({ id: 0, name: "", date: "" }))
    navigate("/property/sale-view")
  }

  return (
    <>
      <div className="relative items-center w-full h-screen sm:max-w-6xl shadow-lg">
        <div className="flex flex-col p-2 m-2 justify-center">
          <form onSubmit={handleSubmit}>
            <div>
              <div className='border  border-slate-200 dark:border-slate-600 p-2 rounded-lg mb-2'>
                <h1 className="justify-center items-center flex text-xl font-semibold mb-2">Property Sale Entry</h1>

                <div className="mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="fileName" className="block mb-2 dark:text-white">
                      File Name <span className='text-red-600 font-bold'>*</span>
                    </label>
                    <div className="relative">
                      <div className="flex rounded-lg shadow-sm">
                        <input
                          type="text"
                          id="fileName"
                          name="fileName"
                          value={propId && `${propId} - ${propName}`}
                          className="rounded-l-lg sm:py-2 py-2 px-4 block w-full border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                          placeholder="Select fileName name"
                          readOnly
                        />
                        <button
                          type="button"
                          className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.5rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                          onClick={() => setShowProp(true)}
                        >
                          ☰
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="docDate" className="block mb-2 dark:text-white">
                      Doc Date
                    </label>
                    <input
                      type="date"
                      name="docDate"
                      id="docDate"
                      value={data?.doc_date ? data.doc_date.slice(0, 10) : ""}
                      readOnly
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="consignor" className="block mb-2 dark:text-white">
                      Consignor
                    </label>
                    <textarea
                      id="consignor"
                      name="consignor"
                      value={data?.consignor || ""}
                      readOnly
                      rows={1}
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="cstNo" className="block mb-2 dark:text-white">
                      C.S.T. No.
                    </label>
                    <input
                      type="number"
                      id="cstNo"
                      name="cstNo"
                      value={data?.cst_no || ""}
                      readOnly
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200 text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right
                      cursor-not-allowed"
                      placeholder="Enter CST No."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6 mb-8">
                  <div>
                    <label htmlFor="purDate" className="block mb-2 dark:text-white">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      id="purDate"
                      name="purDate"
                      value={data?.pur_date ? data.pur_date.slice(0, 10) : ""}
                      readOnly
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500
                      cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="purVal" className="block mb-2 dark:text-white">
                      Pur. Value
                    </label>
                    <input
                      type="number"
                      id="purVal"
                      name="purVal"
                      value={data?.pur_val || ""}
                      readOnly
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right
                      cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="regFees" className="block mb-2 dark:text-white">
                      Reg. Fees
                    </label>
                    <input
                      type="number"
                      id="regFees"
                      name="regFees"
                      value={data?.reg_fees || ""}
                      readOnly
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 
                        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="fraFees" className="block mb-2 dark:text-white">
                      Stamp/Franking Fees
                    </label>
                    <input
                      type="number"
                      id="fraFees"
                      name="fraFees"
                      value={data?.fra_fees || ""}
                      readOnly
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right
                      cursor-not-allowed"
                    />
                  </div>
                </div>

                {/**survey no table here */}
                <div className="rounded-md w-full max-w-8xl mx-auto overflow-x-auto border border-slate-100 dark:border-slate-800">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                      <tr>
                        <th className={tablehead}>Sr No.</th>
                        <th className={tablehead}>Consignee</th>
                        <th className={tablehead}>Survey No.</th>
                        <th className={tablehead}>total Area <span className='lowercase'>(hectors)</span></th>
                        <th className={tablehead}>Balanced Area</th>
                        <th className={tablehead}>total area <span className='lowercase'>(Sq. Mtr.)</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {data?.survey?.map((item, index) => (
                        <tr key={index}>
                          <td className="sm:py-2 py-2 px-2 items-center">
                            <input
                              type="text"
                              value={item.sr_no}
                              readOnly
                              className="rounded-lg sm:py-2 py-2 px-4 block w-[5rem] mt-2 border-slate-200 text-xs border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            />
                          </td>
                          <td className="py-2 px-2 items-center">
                            <input
                              type="text"
                              value={item.con_name}
                              readOnly
                              className="rounded-lg sm:py-2 py-2 px-4 block w-[20rem] mt-2 border-slate-200 text-xs border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            />
                          </td>
                          <td className="py-2 px-2 items-center">
                            <input
                              type="text"
                              value={item.sur_no}
                              readOnly
                              className="rounded-lg sm:py-2 py-2 px-4 block w-[12rem] mt-2 border-slate-200 text-xs border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            />
                          </td>
                          <td className="py-2 px-2 items-center">
                            <input
                              type="text"
                              value={item.area}
                              readOnly
                              className="rounded-lg sm:py-2 py-2 px-4 block w-[7rem] mt-2 border-slate-200 text-right text-xs border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            />
                          </td>
                          <td className="py-2 px-2 items-center">
                            <input
                              type="text"
                              value={item.balance}
                              readOnly
                              className="rounded-lg sm:py-2 py-2 px-4 block w-[7rem] mt-2 border-slate-200 text-right text-xs border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            />
                          </td>
                          <td className="py-2 px-2 items-center">
                            <input
                              type="text"
                              value={item.sqmtr}
                              readOnly
                              className="rounded-lg sm:py-2 py-2 px-4 block w-[7rem] mt-2 border-slate-200 text-right text-xs border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='border border-slate-200 dark:border-slate-700 p-2 rounded-lg'>
                <h1 className='justify-center items-center flex text-xl font-semibold mb-3 '>Property Sale Proceeding Form

                </h1>
                {/* Another 4-Column Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-4">
                  <div>
                    <label htmlFor="saleDate" className="block mb-2 dark:text-white">
                      Sale Date<span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="date"
                      id="saleDate"
                      name="saleDate"
                      defaultValue={inputs.saleDate}
                      onChange={(e) => handleInputChange(e)}
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="buyerName" className="block mb-2 dark:text-white">
                      Buyer Name <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="buyerName"
                      name="buyerName"
                      defaultValue={inputs.buyerName}
                      onChange={(e) => handleInputChange(e)}
                      placeholder='Enter Buyer Name'
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 
                        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 "
                    />
                  </div>
                  <div>
                    <label htmlFor="saleValue" className="block mb-2 dark:text-white">
                      Sale Value <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      id="saleValue"
                      name="saleValue"
                      defaultValue={inputs.saleValue}
                      onChange={(e) => handleInputChange(e)}
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    />
                  </div>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <label htmlFor="saleArea" className="block mb-2 dark:text-white">
                      Sale Area <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="saleArea"
                      name="saleArea"
                      defaultValue={inputs.saleArea}
                      onChange={(e) => handleInputChange(e)}
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    />
                  </div>
                  <div>
                    <label htmlFor="saleSurvey" className="block mb-2 dark:text-white">
                      Survey No. <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="saleSurvey"
                      name="saleSurvey"
                      defaultValue={inputs.saleSurvey}
                      onChange={(e) => handleInputChange(e)}
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    />
                  </div>
                  <div>
                    <label htmlFor="saleRemark" className="block mb-2 dark:text-white">
                      Remark <span className="text-red-600 font-bold">*</span>
                    </label>
                    <textarea
                      id="remark"
                      name="remark"
                      defaultValue={inputs.remark}
                      onChange={(e: any) => handleInputChange(e)}
                      className="rounded-lg sm:py-2 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                      rows={1}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Submit Cancel Buttons Row */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiSave className="mr-2" />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {showProp && (<PropModal show={showProp} setShow={setShowProp} />)}
    </>
  )
}

export default SaleNewEntry