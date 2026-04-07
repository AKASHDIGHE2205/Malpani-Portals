/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BaseUrl } from "../../../../constant/BaseUrl";
import { handleSelectFirm, handleSelectPostType } from "../../../../feature/post/PostEntrySlice";
import { OutwardDetails } from "../../../../services/post/Transaction/TransactionsAPI";
import { RootState } from "../../../../store/store";
import FirmModal from "../InwardEntry/FirmModal";
import PostTypeModal from "../InwardEntry/PostTypeModal";

const OutwardDetailsEntry = () => {
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0];
    const [fromDate, setfromDate] = useState(startDate);
    const currentdate = new Date().toISOString().split('T')[0];
    const [toDate, settoDate] = useState(currentdate);
    const [data, setData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [showFirm, setShowFirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [Details, setDetails] = useState<any[]>([]);
    const dispatch = useDispatch();
    const secretKey = `Malpani@2025`;
console.log(loading1);

    const { firm_id, firm_name, post_name, post_id } = useSelector((state: RootState) => state.postentry);


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
        if (data.length > 0) {
            const formattedData = data.map((item: any) => ({
                sr_no: item.sr_no || 0,
                entry_date: moment(item.entry_date).format("YYYY/MM/DD"),
                entry_id: item.entry_id || 0,
                charges: item.charges || 0,
                rec_date: item.rec_date,
                ret: item.ret,
                rec_no: item.receipt_no || '',
                post_id: item.post_id,
                post_type: item.post_type || '',
                firm_name: item.firm_name || '',
                dept_name: item.dept_name || '',
                party_name: item.party_name || '',
                city_name: item.city_name || '',
                remark: item.remark || '',
                fr_machine: item.fr_machine || '',
                qty: item.qty || '',
                flag: item.flag || ''
            }));
            setDetails(formattedData);

            formattedData.forEach((item: any) => {
                dispatch(handleSelectPostType({ id: item.entry_id, name: item.post_type }));
            });
        }
    }, [data, dispatch]);

    const handleAmount = (index: number, value: any) => {
        const updateEntry = [...Details];
        updateEntry[index].charges = value;
        setDetails(updateEntry);
    };

    const handleRecNo = (index: number, value: any) => {
        const updateEntry = [...Details];
        updateEntry[index].rec_no = value;
        setDetails(updateEntry);
    };

    const handleRemark = (index: any, value: any) => {
        const updateEntry = [...Details];
        updateEntry[index].remark = value;
        setDetails(updateEntry);

    }

    const handleBtn = (rowID: number) => {
        setSelectedIndex(rowID);
        setShowPost(true);
    };

    const handlePostType = () => {
        if (selectedIndex !== null) {
            const updateEntry = Details.map((entry: any, index: number) => {
                if (index === selectedIndex) {
                    return {
                        ...entry,
                        post_type: post_name,
                        post_id: post_id,
                    };
                }
                return entry;
            });
            setDetails(updateEntry);
        }
    };

    useEffect(() => {
        handlePostType();
    }, [post_name]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!fromDate || !toDate) {
            toast.error("Please select date");
            return;
        }
        setLoading(true);
        setShow(true);
        const body = {
            from_date: fromDate,
            to_date: toDate,
            firm_id: firm_id || "0",
            loc_id: user.user.loc_id || "0"
        };

        try {
            const response = await OutwardDetails(body);
            if (response) {
                setData(response);
                setLoading(false);
                dispatch(handleSelectFirm({ id: 0, name: "" }))
            }
        } catch (error: any) {
            toast.error("Failed to fetch data", error);
            dispatch(handleSelectFirm({ id: 0, name: "" }))
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setfromDate(startDate);
        settoDate(currentdate);
        setShow(false);
        setData([]);
        setDetails([]);
        dispatch(handleSelectFirm({ id: 0, name: "" }))
    }

    // to update entry
    const handleUpdate = async () => {
        setLoading1(true);
        const body = {
            data: Details,
            loc_id: user.user.loc_id
        };
        try {
            const response = await axios.put(`${BaseUrl}/post/updateOutwardDetails`, body);
            if (response.status === 200) {
                toast.success(response.data.message);
                handleCancel();
                setLoading1(true);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            setLoading1(true);
        }
    };

    const filteredData = Details.filter((item: any) =>
        item.post_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.entry_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // item.receipt_no.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||      
        moment(item.entry_date).format("DD/MM/YYYY").toString().includes(searchTerm.toString())
    );

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 w-full">
                <div className="max-w-7xl mx-auto">
                    {/* Filter Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">Filter Records</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="fromDate">
                                        From Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={fromDate}
                                        onChange={(e) => setfromDate(e.target.value)}
                                        name="fromdate"
                                        type="date"
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white w-full"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="toDate">
                                        To Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={toDate}
                                        onChange={(e) => settoDate(e.target.value)}
                                        name="todate"
                                        type="date"
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white w-full"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                                        Firm Name
                                    </label>
                                    <div className="flex w-full">
                                        <input
                                            readOnly
                                            value={firm_name}
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                            placeholder="Select firm name"
                                        />
                                        <button
                                            onClick={() => setShowFirm(true)}
                                            type="button"
                                            className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-6 gap-6">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-md flex items-center gap-2 hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:cursor-not-allowed"
                                    disabled={show}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { handleCancel() }}
                                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white rounded-md flex items-center gap-2 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-8 h-8 border-4 border-blue-500 dark:border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-4 text-blue-600 dark:text-blue-400 font-medium">Loading...</span>
                        </div>
                    ) : (
                        show && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900 overflow-hidden">
                                {/* Action Bar */}
                                <div className="bg-gray-100 dark:bg-gray-700 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <button
                                        onClick={handleUpdate}
                                        className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Update Records
                                    </button>

                                    <div className="relative">
                                        <input
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            type="text"
                                            className="pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm w-full dark:bg-gray-700 dark:text-white"
                                            placeholder="Search records..."
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                className="w-4 h-4 text-gray-400"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto max-h-[40rem]">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0">
                                            <tr>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Doc.No</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Doc.Date</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Post Type</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Firm Name</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Department</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Receiver</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">City</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Remark</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Receipt No</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">Receive Date</th>
                                                <th className="px-1 py-2 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">QTY</th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredData.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.entry_id}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{moment(item.entry_date).format("DD/MM/YYYY")}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs">
                                                        <input
                                                            readOnly
                                                            onClick={() => handleBtn(index)}
                                                            value={item.post_type}
                                                            name={`post_type${index}`}
                                                            type="text"
                                                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs w-auto bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.firm_name}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.dept_name}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.party_name}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.city_name}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs">
                                                        <input
                                                            value={item.remark}
                                                            onChange={(e) => handleRemark(index, e.target.value)}
                                                            name="remark"
                                                            type="text"
                                                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs w-auto max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs">
                                                        <input
                                                            value={item.charges}
                                                            onChange={(e) => handleAmount(index, e.target.value)}
                                                            name="amount"
                                                            type="number"
                                                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs w-20 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs">
                                                        <input
                                                            defaultValue={item.rec_no}
                                                            onChange={(e) => handleRecNo(index, e.target.value)}
                                                            name="rec_no"
                                                            type="text"
                                                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs w-auto max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                    </td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.rec_date ? moment(item.rec_date).format("DD-MM-YYYY") : ""}</td>
                                                    <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{item.qty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Empty State */}
                                {filteredData.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No records found</p>
                                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filter criteria</p>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>

            <PostTypeModal show={showPost} setShow={setShowPost} />
            <FirmModal show={showFirm} setShow={setShowFirm} />
        </>
    );
};

export default OutwardDetailsEntry;