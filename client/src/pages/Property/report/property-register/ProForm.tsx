/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { PiSpinner } from "react-icons/pi";
import { tablehead } from "../../../../constant/BaseUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import ConsigneeModal from "../../transaction/ConsigneeModal";
import LocModal from "../../transaction/LocModal";
import { getPropertyRegister } from "../../../../services/Property/reports/PReportApis";
import moment from "moment";
import { handlePConsignee, handlePLocation } from "../../../../feature/Preperties/ptransaction/PTransactionSlice";
import toast from "react-hot-toast";

const ProForm = () => {
  const [inputs, setInputs] = useState({
    from_date: moment().subtract("months").startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    category: "all",
    type: "all"
  });
  const [data, setData] = useState([])
  const [show, setShow] = useState(false);
  const [locShow, setLocShow] = useState(false);
  const [consShow, setConsShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { locId, locName, consigneeId, consigneeName } = useSelector((state: RootState) => state.ptansaction);

  const handleChnage = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!inputs.from_date || !inputs.to_date) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      const body = {
        from_date: inputs.from_date,
        to_date: inputs.to_date,
        location: locId || 'All',
        consignee: consigneeId || 'All',
        category: inputs.category,
        type: inputs.type
      }
      const response = await getPropertyRegister(body);
      if (response) {
        setData(response);
        setShow(true);
        setLoading(false);
        setInputs({
          from_date: moment().subtract("months").startOf("month").format("YYYY-MM-DD"),
          to_date: moment().format("YYYY-MM-DD"),
          category: "all",
          type: "all"
        });
        dispatch(handlePLocation({ id: 0, name: "" }))
        dispatch(handlePConsignee({ id: 0, name: "" }))
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    setShow(false);
    setLoading(false);
    setInputs({
      from_date: moment().subtract("months").startOf("month").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      category: "all",
      type: "all"
    });
    dispatch(handlePLocation({ id: 0, name: "" }))
    dispatch(handlePConsignee({ id: 0, name: "" }))
  }

  const generateCSV = () => {
    const header = [
      "Sr. No.",
      "File No",
      "Pur. Date",
      "Seller",
      "Location",
      "Survey No.",
      "Pur Area(Ha/Sq)",
      "Sale Area(Ha/Sq)",
      "Bal Area(Ha/Sq)",
      "Pur. Value",
      "Fra/Stamp",
      "Remark"
    ];

    // Convert table data to CSV rows
    const rows = data.map((item: any, index: number) => [
      index + 1,
      item?.doc_no,
      moment(item?.pur_date).format("DD/MM/YYYY"),
      item?.consignor_name,
      item?.loc_name,
      item?.sur_no,
      item?.area,
      item?.sale_area,
      item?.area,
      item?.pur_val,
      item?.fra_fee,
      item?.remark
    ]);

    // Combine header and rows
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Trigger the download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "property_register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center">
            Property Register Report
          </h1>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mt-6 grid gap-4 lg:gap-6">

              {/* 3-Column Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="date" className="block mb-2 dark:text-white">
                    From Date <span className="font-bold text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="from_date"
                    id="from_date"
                    value={inputs.from_date}
                    onChange={handleChnage}
                    className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="to_date" className="block mb-2 dark:text-white" >
                    To Date <span className="font-bold text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="to_date"
                    id="to_date"
                    value={inputs.to_date}
                    onChange={handleChnage}
                    className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    placeholder="Enter File No"
                  />
                </div>
              </div>

              {/* 2-Column Input + Button Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="location" className="block mb-2 dark:text-white">
                    Location
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={locName}
                        className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder:text-black dark:placeholder-white dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="All"
                        readOnly
                      />
                      <button
                        type="button"
                        className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                        onClick={() => setLocShow(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="consignee"
                    className="block mb-2 dark:text-white"
                  >
                    Consignee
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="consignee"
                        name="consignee"
                        value={consigneeName}
                        className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder:text-black dark:placeholder-white dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="All"
                        readOnly
                      />
                      <button
                        type="button"
                        className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                        onClick={() => setConsShow(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Another 3-Column Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="category" className="block mb-2 dark:text-white">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={inputs.category}
                    onChange={handleChnage}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500">
                    <option value="all">All</option>
                    <option value="jr">Junior</option>
                    <option value="sr">Senior</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block mb-2 dark:text-white" >Type</label>
                  <select
                    name="type"
                    id="type"
                    value={inputs.type}
                    onChange={handleChnage}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500">
                    <option value="all">All</option>
                    <option value="AG">Agri</option>
                    <option value="NA">Non-Agri</option>
                  </select>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex justify-center items-center gap-2 mt-2">
                <div>
                  <button
                    type="submit"
                    disabled={show}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 border border-green-700 rounded-lg text-white disabled:cursor-not-allowed disabled:bg-green-600 disabled:bg-green-500">
                    Submit
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 border border-slate-700 rounded-lg text-white">
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Table Section */}

        {show && (
          <>
            <div className="border border-slate-300 rounded-md m-2 dark:border-slate-600">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th scope="col" className={tablehead}>Sr. No.</th>
                      <th scope="col" className={tablehead}>File No</th>
                      <th scope="col" className={tablehead}>Pur. Date</th>
                      <th scope="col" className={tablehead}>Seller</th>
                      <th scope="col" className={tablehead}>Location</th>
                      <th scope="col" className={tablehead}>Survey No.</th>
                      <th scope="col" className={tablehead}>Pur Area(Ha/Sq)</th>
                      <th scope="col" className={tablehead}>Sale Area(Ha/Sq)</th>
                      <th scope="col" className={tablehead}>Bal Area(Ha/Sq)</th>
                      <th scope="col" className={tablehead} hidden>Pur. Value</th>
                      <th scope="col" className={tablehead}>Fra/Stamp</th>
                      <th scope="col" className={tablehead}>Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={12} className="text-center py-4">
                          <PiSpinner className='animate-spin' />
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      data?.map((item: any, index: number) => (
                        <tr key={item.doc_no} className="text-xs">
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{index + 1}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.doc_id}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{moment(item?.pur_date).format("DD/MM/YYYY")}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.consignor}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.loc_name}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.sur_no}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.area}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.total_sold_area}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.balance}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'} hidden>{item?.pur_val}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.fra_fees}</td>
                          <td className={'px-2 py-2 whitespace-nowrap text-black dark:text-slate-200'}>{item?.remark}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end my-2 mx-2">
              <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                onClick={generateCSV}
              >
                Dowload CSV
              </button>
            </div>
          </>
        )}
      </div>
      {locShow && <LocModal show={locShow} setShow={setLocShow} />}
      {consShow && <ConsigneeModal show={consShow} setShow={setConsShow} />}
    </div>


  )
}

export default ProForm