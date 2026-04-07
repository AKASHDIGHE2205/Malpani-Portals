/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { BaseUrl, tablehead } from "../../../constant/BaseUrl";
import { IoMdClose } from "react-icons/io";
import { getActiveConsignee, getActiveDocuments, getActiveLoc, getPtranData, updatePTran } from "../../../services/Property/transaction/pTranApis";
import { ConsigneeData, DocData, LocData, Survey, Document } from "./TranNewEntry";
import ShowImage from "./ShowImage";
import { formatDate } from "../../../helper/DateFormate";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  fetchData: () => void;
  data: any
}

const EditTransaction: FC<Props> = ({ show, setShow, fetchData, data }) => {
  const [locData, setLocData] = useState([]);
  const [docData, setDocData] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [consigneeData, setConsigneeData] = useState([]);
  const [inputs, setInputs] = useState({
    doc_id: 0,
    docDate: "",
    fileName: "",
    location: 0,
    consignor: "",
    category: "",
    type: "",
    cstNo: 0,
    purDate: "",
    purVal: 0,
    regFees: 0,
    fraFees: 0,
    remark: "",
  });
  const [surRows, setSurRows] = useState([{
    consignee: "",
    surveyNo: "",
    area: "",
    sqmtr: "",
  }]);
  const [rows, setRows] = useState([{
    docName: 0,
    docDes: "",
    docAttach: "",
  }]);

  //Location Api 
  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const response = await getActiveLoc();
        if (response) {
          setLocData(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchLoc();
  }, []);

  //Consignee Api
  useEffect(() => {
    const fetchConsigneeData = async () => {
      try {
        const response = await getActiveConsignee();
        if (response) {
          setConsigneeData(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchConsigneeData();
  }, []);

  //Document Api
  useEffect(() => {
    const fetchDocData = async () => {
      try {
        const response = await getActiveDocuments();
        if (response) {
          setDocData(response);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchDocData();
  }, []);

  useEffect(() => {
    const getTranData = async () => {
      try {
        const response = await getPtranData(data);
        if (response) {
          setInputs({
            doc_id: response?.doc_id || 0,
            docDate: formatDate(response?.doc_date) || "",
            fileName: response?.file_name || "",
            location: response?.loc_id || 0,
            consignor: response?.consignor || "",
            category: response?.catg || "",
            type: response?.type || "",
            cstNo: response?.cst_no || 0,
            purDate: formatDate(response?.pur_date) || "",
            purVal: response?.pur_val || 0,
            regFees: response?.reg_fees || 0,
            fraFees: response?.fra_fees || 0,
            remark: response?.remark || "",
          });

          const surveys = response?.surveys?.map((s: any) => ({
            consignee: s?.cong_id?.toString() || "",
            surveyNo: s?.sur_no || "",
            area: s?.area || "",
            sqmtr: s?.sqmtr?.toString() || "",
          }));
          setSurRows(surveys);

          const documents = response?.documents?.map((d: any) => ({
            docName: d?.doc_code || 0,
            docDes: d?.doc_desc || "",
            docAttach: d?.doc_path || "",
          }));
          setRows(documents);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTranData();
  }, [show, data]);

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSurInputChange = (e: any, index: number) => {
    const { name, value } = e.target;
    setSurRows(surRows.map((row, i) => {
      if (i === index) {
        return { ...row, [name]: value }
      }
      return row;
    }));
  }

  const handleDocInputChange = (e: any, index: number) => {
    const { name, value } = e.target;
    setRows(rows.map((row, i) => {
      if (i === index) {
        return { ...row, [name]: value }
      }
      return row;
    }));
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = {
        doc_id: inputs.doc_id,
        doc_date: inputs.docDate,
        file_name: inputs.fileName,
        loc_id: inputs.location,
        consignor: inputs.consignor,
        catg: inputs.category,
        type: inputs.type,
        cst_no: inputs.cstNo,
        pur_date: inputs.purDate,
        pur_val: inputs.purVal,
        reg_fees: inputs.regFees,
        fra_fees: inputs.fraFees,
        remark: inputs.remark,
        survData: surRows,
        docData: rows,
      }
      const response = await updatePTran(body);
      if (response) {
        setInputs({
          doc_id: 0,
          docDate: "",
          fileName: "",
          location: 0,
          consignor: "",
          category: "",
          type: "",
          cstNo: 0,
          purDate: "",
          purVal: 0,
          regFees: 0,
          fraFees: 0,
          remark: "",
        });
        setRows([{
          docName: 0,
          docDes: "",
          docAttach: "",
        }])
        setSurRows([{
          consignee: "",
          surveyNo: "",
          area: "",
          sqmtr: "",
        }])
        fetchData();
        setShow(false);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleCancel = () => {
    setInputs({
      doc_id: 0,
      docDate: "",
      fileName: "",
      location: 0,
      consignor: "",
      category: "",
      type: "",
      cstNo: 0,
      purDate: "",
      purVal: 0,
      regFees: 0,
      fraFees: 0,
      remark: "",
    });
    setRows([{
      docName: 0,
      docDes: "",
      docAttach: "",
    }])
    setSurRows([{
      consignee: "",
      surveyNo: "",
      area: "",
      sqmtr: "",
    }])
    fetchData();
    setShow(false);
  }

  return (
    <>
      <div
        id="edit-tran-modal"
        className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 transition-opacity duration-300 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        role="dialog"
        aria-labelledby="edit-tran-modal-label"
      >
        <div className="flex justify-center items-center min-h-screen m-2">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
              <h3 id="edit-tran-modal-label" className="font-bold text-slate-800 dark:text-white">
                Edit Purchase Transaction
              </h3>
              <button
                type="button"
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700"
                onClick={() => setShow(false)}
              >
                <IoMdClose color="black" />
              </button>
            </div>
            <div className="px-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 m-2 p-2 rounded-lg">
              <form>
                <div className="mt-6 grid gap-4 lg:gap-6">

                  {/* 3-Column Input Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="date" className="block mb-2 dark:text-white">
                        Doc. No
                      </label>
                      <input
                        type="text"
                        name="docno"
                        id="docno"
                        value={inputs?.doc_id}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="docDate"
                        className="block mb-2 dark:text-white"
                      >
                        Doc Date
                      </label>
                      <input
                        type="date"
                        name="docDate"
                        id="docDate"
                        value={inputs?.docDate}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        readOnly
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
                        value={inputs?.fileName}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="Select file name"
                      />
                    </div>
                  </div>

                  {/* 2-Column Input + Button Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="location" className="block mb-2 dark:text-white">
                        Location <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        id="location"
                        name="location"
                        value={inputs?.location}
                        onChange={handleChange}
                      >
                        <option value="">Select Location</option>
                        {locData?.map((item: LocData) => (
                          <option key={item?.id} value={item?.id}>{item?.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="consignor" className="block mb-2 dark:text-white">
                        Consignor <span className="text-red-600 font-bold">*</span>
                      </label>
                      <textarea
                        id="consignor"
                        name="consignor"
                        value={inputs?.consignor}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/**survey no table here */}
                  <div className="border dark:border-slate-700 rounded-md w-full max-w-5xl mx-auto overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                        <tr>
                          <th className={tablehead}>Sr No.</th>
                          <th className={tablehead}>Consignee</th>
                          <th className={tablehead}>Survey No.</th>
                          <th className={tablehead}>Area</th>
                          <th className={tablehead}>Sq. Mtr.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {surRows.map((item: Survey, index: number) => (
                          <tr key={index}>
                            <td className="sm:py-3 py-2 px-2 ">{index + 1}</td>
                            <td className="py-2 px-2">
                              <select
                                className="rounded-lg py-3 px-4 block w-[15rem]  mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                                name="consignee"
                                value={item?.consignee}
                                onChange={(e) => handleSurInputChange(e, index)}
                                disabled
                              >
                                <option value="">Select Consignee</option>
                                {consigneeData?.map((item: ConsigneeData) => (
                                  <option key={item?.id} value={item?.id}>
                                    {item?.name}
                                  </option>
                                ))}

                              </select>
                            </td>
                            {/* File Type Dropdown */}
                            <td className="py-2 px-2 ">
                              <div>
                                <input
                                  type="text"
                                  id="surveyNo"
                                  name="surveyNo"
                                  value={item?.surveyNo}
                                  onChange={(e) => handleSurInputChange(e, index)}
                                  disabled
                                  className="rounded-lg sm:py-3 py-2 px-4 block w-[15rem] mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 cursor-not-allowed"
                                  placeholder="Enter Survey No"
                                />
                              </div>
                            </td>

                            {/* Description Input */}
                            <td className="sm:py-3 py-2 px-2 ">
                              <div>
                                <input
                                  type="text"
                                  id="area"
                                  name="area"
                                  value={item?.area}
                                  disabled
                                  onChange={(e) => handleSurInputChange(e, index)}
                                  className="rounded-lg sm:py-3 py-2 px-4 block w-[10rem] mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right cursor-not-allowed"
                                  placeholder="Enter Area"
                                />
                              </div>
                            </td>

                            {/* File Input */}
                            <td className="sm:py-3 py-2 px-2 ">
                              <div>
                                <input
                                  type="number"
                                  id="sqmtr"
                                  name="sqmtr"
                                  value={item?.sqmtr}
                                  disabled
                                  onChange={(e) => handleSurInputChange(e, index)}
                                  className="rounded-lg sm:py-3 py-2 px-4 block w-[10rem] mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right cursor-not-allowed"
                                  placeholder="Enter type"
                                />
                              </div>
                            </td>
                          </tr>

                        ))}

                      </tbody>
                    </table>
                  </div>

                  {/* Another 4-Column Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
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
                        value={inputs?.category}
                        onChange={handleChange}
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
                        value={inputs?.type}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="AG">Agri</option>
                        <option value="NA">Non-Agri</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cstNo" className="block mb-2 dark:text-white">
                        C.S.T. No. <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        id="cstNo"
                        name="cstNo"
                        value={inputs?.cstNo}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                        placeholder="Enter CST No."
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="purDate"
                        className="block mb-2 dark:text-white"
                      >
                        Purchase Date
                        <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        type="date"
                        id="purDate"
                        name="purDate"
                        value={inputs?.purDate}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Final 3-Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
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
                        value={inputs?.purVal}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                      />
                    </div>
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
                        value={inputs?.regFees}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 
                      dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                      />
                    </div>
                    <div>
                      <label htmlFor="fraFees" className="block mb-2 dark:text-white">
                        Stamp/Franking Fees <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        type="number"
                        id="fraFees"
                        name="fraFees"
                        value={inputs?.fraFees}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right"
                      />
                    </div>
                    <div>
                      <label htmlFor="remark" className="block mb-2 dark:text-white">
                        Remark <span className="text-red-600 font-bold">*</span>
                      </label>
                      <textarea
                        id="remark"
                        name="remark"
                        value={inputs?.remark}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Document Table */}
                  <div className="border dark:border-slate-700 rounded-md w-full max-w-5xl mx-auto overflow-x-auto">
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
                        {rows.map((item: Document, index: number) => (
                          <tr key={index}>
                            <td className="sm:py-3 py-2 px-2 ">{index + 1}</td>
                            {/* File Type Dropdown */}
                            <td className="py-2 px-2 ">
                              <select
                                id="docName"
                                name="docName"
                                value={item?.docName}
                                onChange={(e) => handleDocInputChange(e, index)}
                                className="rounded-lg py-3 px-4 block w-[15rem] sm:w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                              >
                                <option value="">Select Document</option>
                                {docData?.map((item: DocData) => {
                                  return (
                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                  )
                                })}
                              </select>
                            </td>

                            {/* Description Input */}
                            <td className="sm:py-3 py-2 px-2 ">
                              <input
                                type="text"
                                name="docDes"
                                value={item?.docDes}
                                onChange={(e) => handleDocInputChange(e, index)}
                                className="rounded-lg py-3 px-4 block w-[15rem] sm:w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                              />
                            </td>

                            {/* File Input */}
                            <td className="sm:py-3 py-2 px-2 ">
                              <button
                                type="button"
                                onClick={(() => {
                                  setShowImage(true)
                                  setImage(`${BaseUrl}${item.docAttach}`)
                                })}
                                className="text-blue-700 underline font-semibold ">View
                              </button>
                              <a
                                href={`${BaseUrl}${item.docAttach}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline font-semibold hidden"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}

                      </tbody>

                    </table>
                  </div>

                </div>
                <div className="flex justify-center gap-4 items-center py-3 px-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 focus:outline-hidden focus:bg-green-600 disabled:opacity-50 disabled:pointer-events-none
                    disabled:cursor-pointer"
                    disabled={loading}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-slate-500 text-white hover:bg-slate-600 focus:outline-hidden focus:bg-slate-600 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>



          </div>
        </div>
      </div>
      {showImage && <ShowImage showImageModal={showImage} setShowImageModal={setShowImage} selectedImage={image} />}
    </>
  )
}

export default EditTransaction;