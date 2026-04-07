/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeptModal from "./DeptModal";
import FirmModal from "./FirmModal";
import { useDispatch, useSelector } from "react-redux";
import PostTypeModal from "./PostTypeModal";
import { toast } from "react-hot-toast";
import { RootState } from "../../../../store/store";
import { postEntry } from "../../../../services/post/Transaction/TransactionsAPI";
import { handlePartyNames, handleSelectDept, handleSelectFirm, handleSelectPostType } from "../../../../feature/post/PostEntrySlice";
import CryptoJS from "crypto-js";

const InwardEntry = () => {
    const currentdate = new Date().toISOString().split('T')[0];
    const [Inputs, setInputs] = useState({
        inwardDate: currentdate,
        posttype: "",
        name: "",
        city: "",
        remark: "",
        reciptno: "",
        qty: "",
    });
    const [showPostModal, setShowPostModal] = useState(false);
    const [showFirmModal, setShowFirmModal] = useState(false);
    const [showDeptModal, setShowDeptModal] = useState(false);
    const secretKey = `Malpani@2025`;
    const navigate = useNavigate();
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
    const { dept_id, dept_name, firm_id, firm_name, post_id, post_name, } = useSelector((state: RootState) => state.postentry)

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setInputs({ ...Inputs, [name]: value });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!Inputs.inwardDate || !Inputs.remark || !firm_id || !dept_id) {
            toast.error("All fields are required. Please fill them out.")
            return;
        }
        const body = {
            flag: "I",
            status: "A",
            entry_date: Inputs.inwardDate,
            post_type: post_id,
            dept_id: dept_id,
            firm_id: firm_id,
            party_name: Inputs.name,
            city_name: Inputs.city,
            remark: Inputs.remark,
            receipt_no: Inputs.reciptno,
            qty: Inputs.qty,
            c_by: user.user.id,
            loc_id: user.user.loc_id
        }
        try {
            await postEntry(body);
            setInputs({
                inwardDate: "",
                posttype: "",
                city: "",
                name: "",
                remark: "",
                reciptno: "",
                qty: "",
            })
            dispatch(handlePartyNames({ id: 0, name: "", city: "", party_city: 0 }));
            dispatch(handleSelectDept({ id: 0, name: "" }));
            dispatch(handleSelectFirm({ id: 0, name: "" }));
            dispatch(handleSelectPostType({ id: 0, name: "" }));

        } catch (error) {
            console.log(error);
        }
        navigate("/post/Transaction/inward-view");

    }

    return (
        <>
            <div className="min-h-screen w-full bg-white dark:bg-slate-900 p-4 flex justify-center items-start">
                <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden dark:shadow-slate-900">
                    {/* Header Section */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white">Inward Entry Form</h1>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date and DOC Number Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="inwardDate">
                                        Inward Date<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={Inputs.inwardDate}
                                        onChange={handleInput}
                                        name="inwardDate"
                                        type="date"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white w-full"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="docNo">
                                        DOC No<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        readOnly
                                        name="docNo"
                                        type="text"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 w-full dark:text-slate-300"
                                        value="Auto-generated"
                                    />
                                </div>
                            </div>

                            {/* Selection Fields with Modals */}
                            <div className="space-y-2">
                                {/* Post Type */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1">
                                        Post Type<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            defaultValue={post_name}
                                            readOnly
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-white dark:bg-slate-700 dark:text-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPostModal(true)}
                                            className="sm:px-4 px-1 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>

                                {/* Firm Name */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1">
                                        Firm Name<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            defaultValue={firm_name}
                                            readOnly
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-white dark:bg-slate-700 dark:text-slate-300"
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
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1">
                                        Department<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            defaultValue={dept_name}
                                            readOnly
                                            type="text"
                                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-white dark:bg-slate-700 dark:text-slate-300"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="name">
                                        Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        onChange={handleInput}
                                        name="name"
                                        type="text"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="city">
                                        City
                                    </label>
                                    <input
                                        onChange={handleInput}
                                        name="city"
                                        type="text"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Remark Field */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="remark">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="reciptNo">
                                        Receipt No
                                    </label>
                                    <input
                                        value={Inputs.reciptno}
                                        onChange={handleInput}
                                        name="reciptno"
                                        type="text"
                                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-slate-700 dark:text-white"
                                        placeholder="Enter receipt number"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-slate-300 mb-1" htmlFor="qty">
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
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md flex justify-center items-center gap-2 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                                >
                                    Submit
                                </button>
                                <Link
                                    to="/post/Transaction/inward-view"
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-black dark:text-slate-300 rounded-md flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DeptModal show={showDeptModal} setShow={setShowDeptModal} />
            <FirmModal show={showFirmModal} setShow={setShowFirmModal} />
            <PostTypeModal show={showPostModal} setShow={setShowPostModal} />
        </>

    )
}

export default InwardEntry;