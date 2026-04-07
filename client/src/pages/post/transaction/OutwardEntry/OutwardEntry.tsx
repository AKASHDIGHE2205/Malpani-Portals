/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeptModal from "../InwardEntry/DeptModal";
import FirmModal from "../InwardEntry/FirmModal";
// import NameModal from "../InwardEntry/NameModal";
import PostTypeModal from "../InwardEntry/PostTypeModal";
import CryptoJS from "crypto-js";
import { toast } from "react-hot-toast";
import { AppDispatch, RootState } from "../../../../store/store";
import { postOutEntry } from "../../../../services/post/Transaction/TransactionsAPI";
import { handlePartyNames, handleSelectDept, handleSelectFirm, handleSelectPostType } from "../../../../feature/post/PostEntrySlice";


const currentdate = new Date().toISOString().split('T')[0];
const OutwardEntry = () => {
    const [Inputs, setInputs] = useState({
        outwardDate: currentdate,
        posttype: "",
        name: "",
        city: "",
        remark: "",
        reciptno: "",
        qty: "",
        frmachine: "",
        charges: ""

    });
    // const [showNamed, setShowNamed] = useState(false);
    const [showFirm, setShowFirm] = useState(false);
    const [showDept, setShowDept] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const navigate = useNavigate();
    const secretKey = `Malpani@2025`;
    const dispatch: AppDispatch = useDispatch();

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

    const { dept_id, dept_name, firm_id, firm_name, post_id, post_name, } = useSelector((state: RootState) => state.postentry)

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setInputs({ ...Inputs, [name]: value });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!Inputs.outwardDate || !Inputs.remark || !firm_id || !dept_id) {
            toast.error("All fields are required. Please fill them out.");
            return;
        }
        const body = {
            flag: "O",
            status: "A",
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
            c_by: user.user.id,
            loc_id: user.user.loc_id
        }
        try {
            const response = await postOutEntry(body);
            if (response.status === 201) {
                dispatch(handlePartyNames({ id: 0, name: "", city: "", party_city: 0 }));
                dispatch(handleSelectDept({ id: 0, name: "" }));
                dispatch(handleSelectFirm({ id: 0, name: "" }));
                dispatch(handleSelectPostType({ id: 0, name: "" }));
                setInputs({
                    outwardDate: "",
                    posttype: "",
                    name: "",
                    city: "",
                    remark: "",
                    reciptno: "",
                    qty: "",
                    frmachine: "",
                    charges: ""
                });
            }
        } catch (error) {
            console.log(error);
        }
        navigate("/post/Transaction/outward-view")
    }

    const handleCancel = () => {
        dispatch(handlePartyNames({ id: 0, name: "", city: "", party_city: 0 }));
        dispatch(handleSelectDept({ id: 0, name: "" }));
        dispatch(handleSelectFirm({ id: 0, name: "" }));
        dispatch(handleSelectPostType({ id: 0, name: "" }));
        setInputs({
            outwardDate: "",
            posttype: "",
            name: "",
            city: "",
            remark: "",
            reciptno: "",
            qty: "",
            frmachine: "",
            charges: ""
        });
        navigate("/post/Transaction/outward-view")
    }

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-gray-900 p-4 flex justify-center items-start w-full">
                <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden dark:shadow-gray-900">
                    {/* Header Section */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Outward Entry Form</h1>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Date and DOC Number Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="outwardDate">
                                        Outward Date<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={Inputs.outwardDate}
                                        onChange={handleInput}
                                        name="outwardDate"
                                        type="date"
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"

                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="docNo">
                                        DOC No<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        readOnly
                                        name="docNo"
                                        type="text"
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 w-full"
                                        value="Auto-generated"
                                    />
                                </div>
                            </div>

                            {/* Selection Fields with Modals */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Post Type */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                                        Post Type<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            defaultValue={post_name}
                                            readOnly
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 dark:text-gray-300"
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
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                                        Firm Name<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            defaultValue={firm_name}
                                            readOnly
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 dark:text-gray-300"
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
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                                        Department<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            defaultValue={dept_name}
                                            readOnly
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 dark:text-gray-300"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="name">
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
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="city">
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
                                <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="remark">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="reciptNo">
                                        Receipt No<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={Inputs.reciptno}
                                        onChange={handleInput}
                                        name="reciptno"
                                        type="text"
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter receipt number"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="qty">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="frmachine">
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
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="charges">
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
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-white mb-4">Return/Received Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="returnStatus">
                                            Status<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                                            name="returnStatus"
                                        >
                                            <option value="">Select status</option>
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="returnDate">
                                            Date<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            readOnly
                                            name="returnDate"
                                            type="date"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-200 dark:bg-gray-600 dark:text-gray-300 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-md flex justify-center items-center gap-2 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-300 rounded-md flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DeptModal show={showDept} setShow={setShowDept} />
            <FirmModal show={showFirm} setShow={setShowFirm} />
            {/* <NameModal show={showNamed} setShow={setShowNamed} /> */}
            <PostTypeModal show={showPost} setShow={setShowPost} />
        </>
    )
}

export default OutwardEntry;