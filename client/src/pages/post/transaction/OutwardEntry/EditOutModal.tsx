/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent, FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeptModal from "../InwardEntry/DeptModal";
import FirmModal from "../InwardEntry/FirmModal";
// import NameModal from "../InwardEntry/NameModal";
import PostTypeModal from "../InwardEntry/PostTypeModal";
import { AppDispatch, RootState } from "../../../../store/store";
import { formatDate } from "../../../../helper/DateFormate";
import { handleSelectDept, handleSelectFirm, handleSelectPostType } from "../../../../feature/post/PostEntrySlice";
import { editOutwardEntry, getEditOutFormData } from "../../../../services/post/Transaction/TransactionsAPI";
import CryptoJS from "crypto-js";
import moment from "moment";

interface Edit {
  show: boolean;
  setShow: (show: boolean) => void;
  items: any;
  fetchData: any
}

interface Data {
  entry_id: number;
  entry_date: string;
  post_type: number;
  post_name: string;
  firm_id: number;
  firm_name: string;
  dept_id: number;
  dept_name: string;
  city_name: string;
  remark: string;
  charges: number;
  party_name: string;
  fr_machine: string;
  rec_date: string | null;
  ret: string;
  receipt_no: string;
  qty: number;
}
const EditOutModal: FC<Edit> = ({ items, fetchData, show, setShow }) => {
  const [recDate, setrecDate] = useState(items.rec_date);
  const [recStatus, setrecStatus] = useState(items.ret);
  const [Inputs, setInputs] = useState({
    outwardDate: "",
    name: "",
    city: "",
    remark: "",
    reciptno: "",
    qty: "",
    frmachine: "",
    charges: "",
    rec_status: "",
    rec_date: "",

  });
  const [data, setData] = useState<Data>({
    entry_id: 0,
    entry_date: "",
    post_type: 0,
    post_name: "",
    firm_id: 0,
    firm_name: "",
    dept_id: 0,
    dept_name: "",
    city_name: "",
    remark: "",
    charges: 0,
    party_name: "",
    fr_machine: "",
    rec_date: null,
    ret: "",
    receipt_no: "",
    qty: 0,
  });
  // const [showNamed, setShowNamed] = useState(false);
  const [showFirm, setShowFirm] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [showPost, setShowPost] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const secretKey = `Malpani@2025`;

  const dcryptdata = (encryptedData: string, secretkey: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretkey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        throw new Error("Decryption failed. Data is empty or corrupted.");
      }
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Error during decryption:", error);
      return null;
    }
  }

  const getUserData = () => {
    const encryptedData = sessionStorage.getItem("user");
    if (encryptedData) {
      return dcryptdata(encryptedData, secretKey)
    }
    return null
  }
  const user = getUserData();

  const { dept_id, dept_name, firm_id, firm_name, post_id, post_name } = useSelector((state: RootState) => state.postentry);

  useEffect(() => {
    const getFormData = async () => {
      const body = {
        entry_id: items.entry_id,
        entry_date: moment(items.entry_date).format("YYYY-MM-DD"),
        flag: "O",
        loc_id: user.user.loc_id,
      }
      try {
        const response = await getEditOutFormData(body);
        if (response) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (show) {
      getFormData();
    }
  }, [show, items, user.user.loc_id]);


  useEffect(() => {
    if (data) {
      setInputs({
        outwardDate: data.entry_date ? formatDate(data.entry_date) : "",
        name: data.party_name || "",
        city: data.city_name || "",
        remark: data.remark || "",
        reciptno: data.receipt_no || "",
        frmachine: data.fr_machine || "",
        charges: data.charges?.toString() || "",
        qty: data.qty?.toString() || "",
        rec_status: data.ret || "",
        rec_date: data.rec_date || "",
      });
      setrecDate(data.rec_date);
      setrecStatus(data.ret);
      dispatch(handleSelectDept({ id: data.dept_id, name: data.dept_name }));
      dispatch(handleSelectFirm({ id: data.firm_id, name: data.firm_name }));
      dispatch(handleSelectPostType({ id: data.post_type, name: data.post_name }));
    }
  }, [data, dispatch]);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      flag: "O",
      entry_id: items.entry_id,
      entry_date: Inputs.outwardDate,
      post_type: post_id,
      dept_id: dept_id,
      firm_id: firm_id,
      party_name: Inputs.name,
      city_name: Inputs.city,
      remark: Inputs.remark,
      receipt_no: Inputs.reciptno,
      qty: Inputs.qty,
      charges: Inputs.charges,
      fr_machine: Inputs.frmachine,
      loc_id: user.user.loc_id,
      rec_date: recDate,
      rec_status: recStatus

    }
    try {
      const response = await editOutwardEntry(body);
      if (response.status === 200) {
        setShow(false);
        setInputs({
          outwardDate: "",
          name: "",
          city: "",
          remark: "",
          reciptno: "",
          qty: "",
          frmachine: "",
          charges: "",
          rec_date: "",
          rec_status: ""
        });
        dispatch(handleSelectDept({ id: 0, name: "" }));
        dispatch(handleSelectFirm({ id: 0, name: "" }));
        dispatch(handleSelectPostType({ id: 0, name: "" }));
        setrecDate("");
        setrecStatus("");

        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    dispatch(handleSelectDept({ id: 0, name: "" }));
    dispatch(handleSelectFirm({ id: 0, name: "" }));
    dispatch(handleSelectPostType({ id: 0, name: "" }));
    setrecDate("");
    setrecStatus("");
    setShow(false);
  }

  return (
    <>
      <div id="editOutModal" className={`fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center ${show ? 'flex' : 'hidden'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit Outward Entry</h3>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <form className="space-y-4">
              {/* Date and DOC Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="outwardDate">
                    Outward Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    value={Inputs.outwardDate}
                    onChange={handleInput}
                    name="outwardDate"
                    type="date"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-300 w-full"
                    readOnly
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="docNo">
                    DOC No<span className="text-red-500">*</span>
                  </label>
                  <input
                    defaultValue={items.entry_id}
                    readOnly
                    name="docNo"
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Selection Fields with Modals */}
              <div className="space-y-4">
                {/* Post Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Post Type<span className="text-red-500">*</span>
                  </label>
                  <div className="flex w-full">
                    <input
                      value={post_name}
                      readOnly
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPost(true)}
                      className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {/* Firm Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Firm Name<span className="text-red-500">*</span>
                  </label>
                  <div className="flex w-full">
                    <input
                      value={firm_name}
                      readOnly
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFirm(true)}
                      className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {/* Department */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department<span className="text-red-500">*</span>
                  </label>
                  <div className="flex w-full">
                    <input
                      value={dept_name}
                      readOnly
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDept(true)}
                      className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>

              {/* Name and City Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    value={Inputs.name}
                    onChange={handleInput}
                    name="name"
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="city">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    value={Inputs.city}
                    onChange={handleInput}
                    name="city"
                    type="text"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Remark Field */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="remark">
                  Remark<span className="text-red-500">*</span>
                </label>
                <textarea
                  value={Inputs.remark}
                  onChange={handleInput}
                  name="remark"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white h-20"
                  placeholder="Additional notes..."
                ></textarea>
              </div>

              {/* Receipt No and QTY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="reciptno">
                    Receipt No<span className="text-red-500">*</span>
                  </label>
                  <input
                    value={Inputs.reciptno}
                    onChange={handleInput}
                    name="reciptno"
                    type="text"
                    placeholder="Enter receipt number"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="qty">
                    Quantity<span className="text-red-500">*</span>
                  </label>
                  <input
                    value={Inputs.qty}
                    onChange={handleInput}
                    name="qty"
                    type="number"
                    min="0"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Machine and Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="frmachine">
                    From Machine<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={Inputs.frmachine}
                    onChange={handleInput}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                    name="frmachine"
                  >
                    <option value="">Select option</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="charges">
                    Charges<span className="text-red-500">*</span>
                  </label>
                  <input
                    value={Inputs.charges}
                    onChange={handleInput}
                    name="charges"
                    type="number"
                    min="0"
                    step="0.01"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Return/Received Section */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-white mb-4">Return/Received Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="returnStatus">
                      Status<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recStatus ? recStatus : ""}
                      onChange={(e) => setrecStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select status</option>
                      <option value="Y">Return</option>
                      <option value="N">Received</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="returnDate">
                      Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={recDate ? formatDate(recDate) : ""}
                      onChange={(e) => setrecDate(e.target.value)}
                      type="date"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-md flex justify-center items-center gap-2 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                  onClick={handleSubmit}
                >
                  Update
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <DeptModal show={showDept} setShow={setShowDept} />
      <FirmModal show={showFirm} setShow={setShowFirm} />
      {/* <NameModal show={showNamed} setShow={setShowNamed} /> */}
      <PostTypeModal show={showPost} setShow={setShowPost} />
    </>
  );
};

export default EditOutModal;