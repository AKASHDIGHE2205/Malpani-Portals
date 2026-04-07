/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { tablehead } from "../../../constant/BaseUrl";
import LocModal from "./LocModal";
import ConsigneeModal from "./ConsigneeModal";
import ConsignorModal from "./ConsignorModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { handlePConsignee, handlePConsignor, handlePLocation } from "../../../feature/Preperties/ptransaction/PTransactionSlice";
import { editPTransaction, getActiveDocuments } from "../../../services/Property/transaction/pTranApis";
import { formatDate } from "../../../helper/DateFormate";
import ShowImage from "./ShowImage";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  fetchData: () => void;
  data: any
}

const EditTransaction: FC<Props> = ({ show, setShow, fetchData, data }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [formData, setFormData] = useState({
    docno: "",
    docDate: "",
    fileName: "",
    location: "",
    location_id: 0,
    consignor: "",
    consignor_id: 0,
    consignee: "",
    consignee_id: 0,
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
    sr_no: 0,
    doc_type: 0,
    description: "",
    path: ""
  });
  const [showLoc, setShowLoc] = useState(false);
  const [showConsignor, setShowConsignor] = useState(false);
  const [showConsignee, setShowConsignee] = useState(false);
  const [documents, setDocuments] = useState([]);
  const dispatch = useDispatch();
  const { locId, locName, consigneeId, consigneeName, consignorId, consignorName } = useSelector((state: RootState) => state.ptansaction);

  useEffect(() => {
    if (data) {
      setFormData({
        docno: data.doc_no || "",
        docDate: data.doc_date || "",
        fileName: data.file_name || "",
        location: locName || data.loc_name || "",
        location_id: locId || data.location || 0,
        consignor_id: consignorId || data.consignor || 0,
        consignor: consignorName || data.consignor_name || "",
        consignee_id: consigneeId || data.consignee || 0,
        consignee: consigneeName || data.consignee_name || "",
        surveyNo: data.sur_no || "",
        category: data.category || "",
        type: data.type || "",
        area: data.area || 0,
        sqmtr1: data.sq_mtr1 || 0,
        salesArea: data.sale_area || 0,
        sqmtr2: data.sq_mtr2 || 0,
        cstNo: data.cst_no || 0,
        purDate: data.pur_date ? data.pur_date.slice(0, 10) : "",
        purVal: data.pur_val || 0,
        regFees: data.reg_fee || 0,
        fraFees: data.fra_fee || 0,
        remark: data.remark || "",
        sr_no: data.files.sr_no || 0,
        doc_type: data.files.doc_type || 0,
        description: data.files.description || "",
        path: data.files.path || ""
      });
    }
  }, [data, locId, consigneeId, consignorId, locName, consignorName, consigneeName]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      doc_no: formData.docno,
      doc_date: formData.docDate,
      file_name: formData.fileName,
      loc_id: formData.location_id,
      consignor_id: formData.consignor_id,
      consignee_id: formData.consignee_id,
      sur_no: formData.surveyNo,
      category: formData.category,
      type: formData.type,
      area: formData.area,
      sq_mtr1: formData.sqmtr1,
      sale_area: formData.salesArea,
      sq_mtr2: formData.sqmtr2,
      cst_no: formData.cstNo,
      pur_date: formData.purDate,
      pur_val: formData.purVal,
      reg_fee: formData.regFees,
      fra_fee: formData.fraFees,
      remark: formData.remark
    };
    try {
      const response = await editPTransaction(body);
      if (response === 200) {
        fetchData();
        setFormData({
          docno: "",
          docDate: "",
          fileName: "",
          location: "",
          location_id: 0,
          consignor: "",
          consignor_id: 0,
          consignee: "",
          consignee_id: 0,
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
          sr_no: 0,
          doc_type: 0,
          description: "",
          path: ""
        });
        dispatch(handlePConsignor({ id: 0, name: "" }))
        dispatch(handlePConsignee({ id: 0, name: "" }))
        dispatch(handlePLocation({ id: 0, name: "" }))
        setShow(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    setFormData({
      docno: "",
      docDate: "",
      fileName: "",
      location: "",
      location_id: 0,
      consignor: "",
      consignor_id: 0,
      consignee: "",
      consignee_id: 0,
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
      sr_no: 0,
      doc_type: 0,
      description: "",
      path: ""
    });
    dispatch(handlePConsignor({ id: 0, name: "" }))
    dispatch(handlePConsignee({ id: 0, name: "" }))
    dispatch(handlePLocation({ id: 0, name: "" }))
    fetchData()
    setShow(false);
  }

  return (
    <>
      <div
        id="Tran-edit-modal"
        className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        role="dialog" aria-labelledby="Tran-edit-modal-label" >

        <div className="flex justify-center items-center min-h-screen m-2">
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-slate-700">
              <h3 id="Tran-edit-modal-label" className="font-bold text-slate-800 dark:text-white">
                Edit Transaction
              </h3>
              <button
                type="button"
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700"
                onClick={() => setShow(false)}
              >
                <IoMdClose color="black" />
              </button>
            </div>
            <div className="w-full max-h-[100vh] overflow-y-auto">
              <form >
                <div className="m-2 grid gap-4 lg:gap-6 border border-slate-300 dark:border-slate-500 p-4 rounded-lg">

                  {/* 3-Column Input Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="date" className="block mb-2 dark:text-white">Doc. No:</label>
                      <input
                        type="text"
                        name="docno"
                        id="docno"
                        value={formData.docno}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-200 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor="docDate" className="block mb-2 dark:text-white">
                        Doc Date:  </label>
                      <input
                        type="date"
                        name="docDate"
                        id="docDate"
                        value={formatDate(formData.docDate)}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-200 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor="fileName" className="block mb-2 dark:text-white">File Name  </label>
                      <input
                        type="text"
                        id="fileName"
                        name="fileName"
                        value={formData.fileName}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="Select file name" />
                    </div>
                  </div>

                  {/* 2-Column Input + Button Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="location" className="block mb-2 dark:text-white">Location   </label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="Select location name" readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                            onClick={() => setShowLoc(true)}
                          >
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="consignor" className="block mb-2 dark:text-white">Consignor   </label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="consignor"
                            name="consignor"
                            value={formData.consignor}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="select Consignor"
                            readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                            onClick={() => setShowConsignor(true)}
                          >
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="consignee" className="block mb-2 dark:text-white">Consignee   </label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="consignee"
                            name="consignee"
                            value={formData.consignee}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="select Consignee"
                            readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
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
                      <label htmlFor="surveyNo" className="block mb-2 dark:text-white">Survey No.   </label>
                      <input
                        type="text"
                        id="surveyNo"
                        name="surveyNo"
                        value={formData.surveyNo}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="Enter Survey No" />
                    </div>
                    <div>
                      <label htmlFor="category" className="block mb-2 dark:text-white">Category   </label>
                      <select
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500">
                        <option value="">Select Category</option>
                        <option value="jr">Junior</option>
                        <option value="sr">Senior</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="type" className="block mb-2 dark:text-white">Type:  </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500">
                        <option value="">Select Type</option>
                        <option value="AG">Agri</option>
                        <option value="NA">Non-Agri</option>
                      </select>
                    </div>
                  </div>

                  {/* Another 4-Column Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="area" className="block mb-2 dark:text-white">Area   </label>
                      <input
                        type="number"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" placeholder="Enter Area" />
                    </div>
                    <div>
                      <label htmlFor="sqmtr1" className="block mb-2 dark:text-white">Sq. Mtr.   </label>
                      <input
                        type="number"
                        id="sqmtr1"
                        name="sqmtr1"
                        value={formData.sqmtr1}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" placeholder="Enter type" />
                    </div>
                    <div>
                      <label htmlFor="salesArea" className="block mb-2 dark:text-white">Sales Area   </label>
                      <input
                        type="number"
                        id="salesArea"
                        name="salesArea"
                        value={formData.salesArea}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" placeholder="Enter sales area" />
                    </div>
                    <div>
                      <label htmlFor="sqmtr2" className="block mb-2 dark:text-white">Sq. Mtr.   </label>
                      <input
                        type="number"
                        id="sqmtr2"
                        name="sqmtr2"
                        value={formData.sqmtr2}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" placeholder="Enter type" />
                    </div>
                  </div>

                  {/* Final 3-Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="cstNo" className="block mb-2 dark:text-white">C.S.T. No.   </label>
                      <input
                        type="number"
                        id="cstNo"
                        name="cstNo"
                        value={formData.cstNo}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" placeholder="Enter CST No." />
                    </div>
                    <div>
                      <label htmlFor="purDate" className="block mb-2 dark:text-white">Purchase Date   </label>
                      <input
                        type="date"
                        id="purDate"
                        name="purDate"
                        value={formData.purDate}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="purVal" className="block mb-2 dark:text-white">Pur. Value   </label>
                      <input
                        type="number"
                        id="purVal"
                        name="purVal"
                        value={formData.purVal}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" />
                    </div>
                  </div>

                  {/* Final -Column Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <div>
                      <label htmlFor="regFees" className="block mb-2 dark:text-white">Reg. Fees   </label>
                      <input
                        type="number"
                        id="regFees"
                        name="regFees"
                        value={formData.regFees}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 
                               dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" />
                    </div>
                    <div>
                      <label htmlFor="fraFees" className="block mb-2 dark:text-white">Stamp/Franking Fees   </label>
                      <input
                        type="number"
                        id="fraFees"
                        name="fraFees"
                        value={formData.fraFees}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 text-right" />
                    </div>
                    <div>
                      <label htmlFor="remark" className="block mb-2 dark:text-white">Remark   </label>
                      <textarea
                        id="remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        className="rounded-lg py-3 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500" rows={3} />
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
                        {data.files?.map((file: any, index: number) => (
                          <tr key={index}>
                            <td className="py-3 px-2">{file.sr_no}</td>

                            <td className="py-2 px-2">
                              <select
                                value={file.doc_type}
                                className="py-3 px-4 pe-9 block w-[15rem] sm:w-full rounded-lg border-slate-200 text-sm border focus:outline-none bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                disabled
                              >
                                {documents?.map((doc: any) => (
                                  <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="py-3 px-2">
                              <input
                                type="text"
                                value={file.description}
                                readOnly
                                className="rounded-lg py-3 px-4 block w-[15rem] sm:w-full mt-2 border-slate-200 text-sm border focus:outline-none bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                              />
                            </td>

                            <td className="py-3 px-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImage(file.path)
                                  setShowImageModal(true)
                                }}
                                className="text-blue-600 underline hover:text-blue-800 text-lg"
                              >
                                View
                              </button>

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-center gap-4 my-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Submit
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 border border-slate-700 rounded-lg text-white">
                      Cancel
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div >
      </div >


      {showLoc && <LocModal show={showLoc} setShow={setShowLoc} />}
      {showConsignee && <ConsigneeModal show={showConsignee} setShow={setShowConsignee} />}
      {showConsignor && <ConsignorModal show={showConsignor} setShow={setShowConsignor} />}
      {showImageModal && <ShowImage showImageModal={showImageModal} setShowImageModal={setShowImageModal} selectedImage={selectedImage} />}
    </>
  )
}

export default EditTransaction;