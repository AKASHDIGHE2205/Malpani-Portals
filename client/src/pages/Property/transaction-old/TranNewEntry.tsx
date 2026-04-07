/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { tablehead } from "../../../constant/BaseUrl";
import { useEffect, useState } from "react";
import LocModal from "./LocModal";
import ConsignorModal from "./ConsignorModal";
import ConsigneeModal from "./ConsigneeModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { MdDeleteForever } from "react-icons/md";
import { RiMenuAddFill } from "react-icons/ri";
import { getActiveDocuments, newTransaction } from "../../../services/Property/transaction/pTranApis";
import { handlePConsignee, handlePConsignor, handlePLocation } from "../../../feature/Preperties/ptransaction/PTransactionSlice";

const TranNewEntry = () => {
  const [inputs, setInputs] = useState({
    docDate: "",
    fileName: "",
    surveyNo: "",
    category: "",
    type: "",
    area: 0,
    sqmtr1: 0,
    salesArea: 0,
    sqmtr2: 0,
    cstNo: 0,
    purDate: "",
    purVal: 0,
    regFees: 0,
    fraFees: 0,
    remark: "",
  });
  const [documents, setDocuments] = useState([]);
  const [rows, setRows] = useState<Array<{ [key: string]: string | File }>>([
    {
      docName: "",
      docDes: "",
      docAttach: "",
    },
  ]);
  const [showLoc, setShowLoc] = useState(false);
  const [showConsignor, setShowConsignor] = useState(false);
  const [showConsignee, setShowConsignee] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locName, consigneeName, consignorName, locId, consigneeId, consignorId } = useSelector((state: RootState) => state.ptansaction);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getActiveDocuments();
        if (response) {
          setDocuments(response);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const addRows = () => {
    setRows([...rows, { docName: "", docDes: "", docAttach: "" }]);
  };

  const RemoveRows = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  const handleInputChange = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleRowChange = (index: number, field: string, value: any) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    // Append basic inputs
    for (const key in inputs) {
      formData.append(key, String(inputs[key as keyof typeof inputs]));
    }

    // Append selected redux values
    formData.append("locId", String(locId));
    formData.append("consigneeId", String(consigneeId));
    formData.append("consignorId", String(consignorId));

    // Append rows array as JSON string
    const rowData = rows.map((row) => ({
      docName: row.docName,
      docDes: row.docDes,
    }));
    formData.append("rows", JSON.stringify(rowData));

    // Append files
    rows.forEach((row, index) => {
      if (row.docAttach) {
        formData.append(`file_${index}`, row.docAttach);
      }
    });

    try {
      const response = await newTransaction(formData);
      if (response) {
        // Clear/reset after success
        dispatch(handlePLocation({ id: 0, name: "" }));
        dispatch(handlePConsignor({ id: 0, name: "" }));
        dispatch(handlePConsignee({ id: 0, name: "" }));
        setInputs({
          docDate: "",
          fileName: "",
          surveyNo: "",
          category: "",
          type: "",
          area: 0,
          sqmtr1: 0,
          salesArea: 0,
          sqmtr2: 0,
          cstNo: 0,
          purDate: "",
          purVal: 0,
          regFees: 0,
          fraFees: 0,
          remark: "",
        });
        setRows([{ docName: "", docDes: "", docAttach: "" }]);
        navigate("/property/transaction/tran-view");
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleCancel = () => {
    dispatch(handlePLocation({ id: 0, name: "" }));
    dispatch(handlePConsignor({ id: 0, name: "" }));
    dispatch(handlePConsignee({ id: 0, name: "" }));
    setInputs({
      docDate: "",
      fileName: "",
      surveyNo: "",
      category: "",
      type: "",
      area: 0,
      sqmtr1: 0,
      salesArea: 0,
      sqmtr2: 0,
      cstNo: 0,
      purDate: "",
      purVal: 0,
      regFees: 0,
      fraFees: 0,
      remark: "",
    });
    navigate("/property/transaction/tran-view");
  };

  return (
    <>
      <div className="relative items-center w-full sm:max-w-5xl my-2 mx-2 shadow-lg">
        <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-5 dark:border-slate-700 justify-center">
          <h1 className="justify-center items-center flex text-xl font-semibold">
            Transaction Entry
          </h1>
          <form>
            <div className="mt-6 grid gap-4 lg:gap-6">
              {/* 3-Column Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="date" className="block mb-2 dark:text-white">
                    Doc. No:
                  </label>
                  <input
                    type="text"
                    name="docno"
                    id="docno"
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="docDate"
                    className="block mb-2 dark:text-white"
                  >
                    Doc Date: <span className="font-bold text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="docDate"
                    id="docDate"
                    value={inputs.docDate}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    placeholder="Enter File No"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fileName"
                    className="block mb-2 dark:text-white"
                  >
                    File Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    id="fileName"
                    name="fileName"
                    value={inputs.fileName}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    placeholder="Select file name"
                  />
                </div>
              </div>

              {/* 2-Column Input + Button Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block mb-2 dark:text-white"
                  >
                    Location <span className="text-red-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={locName}
                        className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="Select location name"
                        readOnly
                      />
                      <button
                        type="button"
                        className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                        onClick={() => setShowLoc(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="consignor"
                    className="block mb-2 dark:text-white"
                  >
                    Consignor <span className="text-red-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="consignor"
                        name="consignor"
                        value={consignorName}
                        className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="select Consignor"
                        readOnly
                      />
                      <button
                        type="button"
                        className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                        onClick={() => setShowConsignor(true)}
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
                    Consignee <span className="text-red-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="consignee"
                        name="consignee"
                        value={consigneeName}
                        className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="select Consignee"
                        readOnly
                      />
                      <button
                        type="button"
                        className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                        onClick={() => setShowConsignee(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Another 3-Column Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="surveyNo"
                    className="block mb-2 dark:text-white"
                  >
                    Survey No. <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    id="surveyNo"
                    name="surveyNo"
                    value={inputs.surveyNo}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    placeholder="Enter Survey No"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 dark:text-white"
                  >
                    Category <span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={inputs.category}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="jr">Junior</option>
                    <option value="sr">Senior</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block mb-2 dark:text-white">
                    Type: <span className="font-bold text-red-600">*</span>
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={inputs.type}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="AG">Agri</option>
                    <option value="NA">Non-Agri</option>
                  </select>
                </div>
              </div>

              {/* Another 4-Column Group */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="area" className="block mb-2 dark:text-white">
                    Area <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={inputs.area}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    placeholder="Enter Area"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sqmtr1"
                    className="block mb-2 dark:text-white"
                  >
                    Sq. Mtr. <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="sqmtr1"
                    name="sqmtr1"
                    value={inputs.sqmtr1}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    placeholder="Enter type"
                  />
                </div>
                <div>
                  <label
                    htmlFor="salesArea"
                    className="block mb-2 dark:text-white"
                  >
                    Sales Area <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="salesArea"
                    name="salesArea"
                    value={inputs.salesArea}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    placeholder="Enter sales area"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sqmtr2"
                    className="block mb-2 dark:text-white"
                  >
                    Sq. Mtr. <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="sqmtr2"
                    name="sqmtr2"
                    value={inputs.sqmtr2}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    placeholder="Enter type"
                  />
                </div>
              </div>

              {/* Final 3-Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="cstNo" className="block mb-2 dark:text-white">
                    C.S.T. No. <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="cstNo"
                    name="cstNo"
                    value={inputs.cstNo}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                    placeholder="Enter CST No."
                  />
                </div>
                <div>
                  <label
                    htmlFor="purDate"
                    className="block mb-2 dark:text-white"
                  >
                    Purchase Date{" "}
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="date"
                    id="purDate"
                    name="purDate"
                    value={inputs.purDate}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="purVal"
                    className="block mb-2 dark:text-white"
                  >
                    Pur. Value <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="purVal"
                    name="purVal"
                    value={inputs.purVal}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                  />
                </div>
              </div>

              {/* Final -Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="regFees"
                    className="block mb-2 dark:text-white"
                  >
                    Reg. Fees <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="regFees"
                    name="regFees"
                    value={inputs.regFees}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 
                    dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fraFees"
                    className="block mb-2 dark:text-white"
                  >
                    Stamp/Franking Fees
                    <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    id="fraFees"
                    name="fraFees"
                    value={inputs.fraFees}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                  />
                </div>
                <div>
                  <label
                    htmlFor="remark"
                    className="block mb-2 dark:text-white"
                  >
                    Remark <span className="text-red-600 font-bold">*</span>
                  </label>
                  <textarea
                    id="remark"
                    name="remark"
                    value={inputs.remark}
                    onChange={handleInputChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-md w-full max-w-5xl mx-auto overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className={tablehead}>Sr No.</th>
                      <th className={tablehead}>Doc Name</th>
                      <th className={tablehead}>Doc Description</th>
                      <th className={tablehead}>Attachment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {rows.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="sm:py-3 py-2 px-2 ">{index + 1}</td>

                        {/* File Type Dropdown */}
                        <td className="py-2 px-2 ">
                          <select

                            value={item.docName}
                            onChange={(e) => handleRowChange(index, "docName", e.target.value)}
                            className="rounded-lg py-3 px-4 block w-[15rem] sm:w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          >
                            <option value="">Select Document</option>
                            {documents?.map((doc: any) => (
                              <option key={doc.id} value={doc.id}>
                                {doc.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Description Input */}
                        <td className="sm:py-3 py-2 px-2 ">
                          <input
                            type="text"
                            value={item.docDes}
                            onChange={(e) => handleRowChange(index, "docDes", e.target.value)}
                            className="rounded-lg py-3 px-4 block w-[15rem] sm:w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          />
                        </td>

                        {/* File Input */}
                        <td className="sm:py-3 py-2 px-2 ">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleRowChange(index, "docAttach", e.target.files?.[0])
                            }
                            className="rounded-lg py-3 px-4 block w-[15rem] sm:w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              {/* Buttons  */}
              <div className="flex justify-end gap-2 mt-4 ">
                <button
                  type="button"
                  onClick={addRows}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  <RiMenuAddFill />
                </button>
                <button
                  type="button"
                  onClick={RemoveRows}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  disabled={rows.length === 1}
                >
                  <MdDeleteForever />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Buttons Row */}
        <div className="flex justify-center items-center gap-2 my-2">
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 border border-green-700 rounded-lg text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 border border-slate-700 rounded-lg text-white"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {showLoc && <LocModal show={showLoc} setShow={setShowLoc} />}
      {showConsignee && (<ConsigneeModal show={showConsignee} setShow={setShowConsignee} />)}
      {showConsignor && (<ConsignorModal show={showConsignor} setShow={setShowConsignor} />)}
    </>
  );
};

export default TranNewEntry;
