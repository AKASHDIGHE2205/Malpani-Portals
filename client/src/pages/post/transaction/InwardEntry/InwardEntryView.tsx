/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paginations from "../../../../helper/Pagination";
import { EditEntry, getAllInView } from "../../../../services/post/Transaction/TransactionsAPI";
import moment from "moment";
import { CiEdit } from "react-icons/ci";
import EditModal from "./EditModal";
import { toast } from "react-hot-toast";
import ReusableTHeader from "../../../../components/ReusableTHeader";
import CryptoJS from "crypto-js";
import { RiDeleteBinLine } from "react-icons/ri";

const InwardEntryView: FC = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 8;
    const [date, setDate] = useState<string>(() => moment().format("YYYY-MM-DD"));
    const [items, setItems] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const navigate = useNavigate();
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

    const handleDate = async () => {
        setLoading(true);
        const body = {
            date: date,
            loc_id: user?.user?.loc_id || 1
        }
        try {
            const response = await getAllInView(body);
            setData(response);
            setLoading(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        handleDate();
    }, [date]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.filter((item: any) =>
        item.firm_name && item.party_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city_name && item.dept_name.toString().toLowerCase().includes(searchTerm.toLowerCase) ||
        item.entry_id && item.remark.toString().toLowerCase().includes(searchTerm.toLowerCase) ||
        moment(item.entry_date).format("DD/MM/YYYY") && moment(item.entry_date).format("DD/MM/YYYY").toString().toLowerCase().includes(searchTerm.toString())
    ).slice(indexOfFirstItem, indexOfLastItem);

    const handleCreateButton = () => {
        navigate("/post/Transaction/inward-new");
    };

    const handleEdit = (item: any) => {
        setShowEdit(true);
        setItems(item);
    };

    const handleDelete = async (item: any) => {
        const body = {
            item: item,
            loc_id: user?.user?.loc_id || 1,
        }
        try {
            await EditEntry(body);
            toast.success(" Entry deleted successfully.");
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (
        <>
            <div className="min-h-screen sm:p-4 bg-white dark:bg-slate-900 w-full">
                <div className="max-w-7xl mx-auto rounded-xl shadow-md overflow-hidden bg-white dark:bg-slate-800 dark:shadow-slate-900">
                    <div className="sm:p-6 p-2">
                        {/* Reusable Header Component */}
                        <ReusableTHeader setSearchTerm={setSearchTerm} name="List of Inward Entries" createButtonAction={handleCreateButton} />

                        {/* Date Filter Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                                <label className="font-semibold text-black dark:text-slate-300">Filter by Date:</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm w-full sm:w-auto dark:text-white dark:bg-slate-600"
                                />
                                <button
                                    onClick={handleDate}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-md text-sm flex justify-center items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh Data
                                </button>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                {/* Table Header */}
                                <thead className="bg-slate-100 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Entry Id</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Entry Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Post Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Firm Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">City</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Remark</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Receipt No</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={10} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-8 h-8 border-4 border-blue-500 dark:border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                                    <p className="font-medium text-black dark:text-slate-300">Loading data...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center">
                                                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">No Records Found</p>
                                                    <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((item: any, index: number) => (
                                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-300">{item.entry_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{moment(item.entry_date).format("DD/MM/YYYY")}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.party_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.post_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.dept_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.firm_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.city_name}</td>
                                                <td className="px-6 py-4 text-sm text-black dark:text-slate-300">
                                                    <div className="max-w-xs truncate" title={item.remark}>
                                                        {item.remark}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.receipt_no}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:ring-opacity-50 shadow-sm"
                                                            title="Edit entry"
                                                        >
                                                            <CiEdit size={26} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("Are you sure you want to delete this group?")) {
                                                                    handleDelete(item)
                                                                }
                                                            }}
                                                            className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:ring-opacity-50 shadow-sm"
                                                            title="Delete entry"
                                                        >
                                                            <RiDeleteBinLine size={22} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!loading && data.length > 0 && (
                            <div className="mt-6">
                                <Paginations currentPage={currentPage} itemPerPage={itemsPerPage} handlePageChange={handlePageChange}
                                    data={data} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <EditModal fetchData={handleDate} items={items} show={showEdit} setShow={setShowEdit} />

        </>
    );
};

export default InwardEntryView;