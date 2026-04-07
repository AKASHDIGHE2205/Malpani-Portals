/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, FormEvent, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeptModal from "./DeptModal";
import FirmModal from "./FirmModal";
import PostTypeModal from "./PostTypeModal";
import { handleSelectDept, handleSelectFirm, handleSelectPostType } from "../../../../feature/post/PostEntrySlice";
import { editInwardEntry } from "../../../../services/post/Transaction/TransactionsAPI";
import { formatDate } from "../../../../helper/DateFormate";
import { RootState } from "../../../../store/store";
import CryptoJS from "crypto-js";

interface Edit {
  items: any;
  fetchData: any
  show: boolean
  setShow: (show: boolean) => void
}

const EditModal: FC<Edit> = ({ items, fetchData, show, setShow }) => {
  const [Inputs, setInputs] = useState({
    inwardDate: "",
    name: "",
    city: "",
    remark: "",
    reciptno: "",
    qty: "",
  });
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFirmModal, setShowFirmModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const { dept_id, dept_name, firm_id, firm_name, post_id, post_name } = useSelector((state: RootState) => state.postentry);
  const secretKey = `Malpani@2025`;
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (items) {
      const formattedDate = items.entry_date ? formatDate(items.entry_date) : "";
      setInputs({
        inwardDate: formattedDate,
        name: items.party_name || "",
        city: items.city_name || "",
        remark: items.remark || "",
        reciptno: items.receipt_no || "",
        qty: items.qty?.toString() || "",
      });
      dispatch(handleSelectDept({ id: items.dept_id || 0, name: items.dept_name || "" }));
      dispatch(handleSelectFirm({ id: items.firm_id || 0, name: items.firm_name || "" }));
      dispatch(handleSelectPostType({ id: items.post_id || 0, name: items.post_name || "" }));
    }
  }, [items, dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      flag: "I",
      entry_id: items.entry_id,
      entry_date: Inputs.inwardDate,
      post_type: post_id,
      dept_id: dept_id,
      firm_id: firm_id,
      party_name: Inputs.name,
      city_name: Inputs.city,
      remark: Inputs.remark,
      receipt_no: Inputs.reciptno,
      qty: Inputs.qty,
      loc_id: user?.user?.loc_id || 1,
    };
    setShow(false);
    fetchData();
    try {
      await editInwardEntry(body);
      setInputs({
        inwardDate: "",
        name: "",
        city: "",
        remark: "",
        reciptno: "",
        qty: "",
      });

      dispatch(handleSelectDept({ id: 0, name: "" }));
      dispatch(handleSelectFirm({ id: 0, name: "" }));
      dispatch(handleSelectPostType({ id: 0, name: "" }));
    } catch (error) {
      console.log(error);
    }

  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleCancel = () => {
    setShow(false);
    dispatch(handleSelectDept({ id: 0, name: "" }));
    dispatch(handleSelectFirm({ id: 0, name: "" }));
    dispatch(handleSelectPostType({ id: 0, name: "" }));
  }
  return (
    <>
      <div id="editModal" className={`fixed inset-0 bg-slate-600 dark:bg-slate-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center ${show ? 'flex' : 'hidden'}`}>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl dark:shadow-slate-900 w-11/12 max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Inward Entry</h3>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Date and DOC Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="inwardDate">
                    Inward Date
                  </label>
                  <input
                    value={Inputs.inwardDate}
                    onChange={handleInput}
                    name="inwardDate"
                    type="date"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="docNo">
                    DOC No
                  </label>
                  <input
                    defaultValue={items.entry_id}
                    readOnly
                    name="docNo"
                    type="text"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              {/* Selection Fields with Modals */}
              <div className="space-y-4">
                {/* Post Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Post Type
                  </label>
                  <div className="flex w-full">
                    <input
                      value={post_name}
                      readOnly
                      type="text"
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPostModal(true)}
                      className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {/* Firm Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Firm Name
                  </label>
                  <div className="flex w-full">
                    <input
                      value={firm_name}
                      readOnly
                      type="text"
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFirmModal(true)}
                      className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>

                {/* Department */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <div className="flex w-full">
                    <input
                      value={dept_name}
                      readOnly
                      type="text"
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeptModal(true)}
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
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    value={Inputs.name}
                    onChange={handleInput}
                    name="name"
                    type="text"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="city">
                    City
                  </label>
                  <input
                    value={Inputs.city}
                    onChange={handleInput}
                    name="city"
                    type="text"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Remark Field */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="remark">
                  Remark
                </label>
                <textarea
                  value={Inputs.remark}
                  onChange={handleInput}
                  name="remark"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white h-20"
                  placeholder="Additional notes..."
                ></textarea>
              </div>

              {/* Receipt No and QTY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="reciptno">
                    Receipt No
                  </label>
                  <input
                    value={Inputs.reciptno}
                    onChange={handleInput}
                    name="reciptno"
                    type="text"
                    placeholder="Enter receipt number"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="qty">
                    Quantity
                  </label>
                  <input
                    value={Inputs.qty}
                    onChange={handleInput}
                    name="qty"
                    type="number"
                    min="0"
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-md flex justify-center items-center gap-2 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md flex justify-center items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <DeptModal show={showDeptModal} setShow={setShowDeptModal} />
      <FirmModal show={showFirmModal} setShow={setShowFirmModal} />
      <PostTypeModal show={showPostModal} setShow={setShowPostModal} />
    </>
  );
};

export default EditModal;