/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useState } from "react";
import ReusableTHeader from "../../../components/ReusableTHeader";
import { CiEdit, CiSearch } from "react-icons/ci";
import axios from "axios";
import Paginations from "../../../helper/Pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BaseUrl } from "../../../constant/BaseUrl";
import { RiDeleteBinLine } from "react-icons/ri";

const CodeMasterView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [selectedGroup, setselectedGroup] = useState("F");
    const [newGroupName, setGroupName] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleViewBtn = async () => {
        if (!selectedGroup) {
            toast.error("Please Select Group!")
            return;
        }
        setLoading(true);
        const body = {
            Group: selectedGroup
        }
        try {
            const response = await axios.post(`${BaseUrl}/post/viewGroup`, body);
            setData(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        handleViewBtn();
    }, [selectedGroup])

    const navigate = useNavigate();

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = data.filter((item: any) =>
        item.id && item.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(indexOfFirstItem, indexOfLastItem);

    const handleCreateButton = () => {
        navigate("/post/master/create");
    }

    const handleEdit = (item: any) => {
        setShowEdit(true);
        setSelectedId(item.id);
        setGroupName(item.name);
    }

    const handleDelete = async (id: any) => {
        const body = {
            Group: selectedGroup,
            id: id,
            status: "I"
        }
        try {
            const response = await axios.put(`${BaseUrl}/post/delGroup`, body);
            if (response.status === 200) {
                toast.success(response.data.message);
                handleViewBtn(); // Refresh data after deletion
            }
        } catch (error: any) {
            toast.error(error.response.message)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const body = {
            Group: selectedGroup,
            name: newGroupName,
            id: selectedId
        };
        setShowEdit(true);
        try {
            const response = await axios.put(`${BaseUrl}/post/editGroup`, body);
            if (response.status === 200) {
                toast.success(response.data.message);
                setShowEdit(false);
                setGroupName("");
                handleViewBtn(); // Refresh data after edit
            }
        } catch (error: any) {
            toast.error(error.response.message)
        }
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <>
            <div className="min-h-screen sm:p-4 bg-white dark:bg-slate-900 w-full">
                <div className="max-w-6xl mx-auto rounded-xl shadow-md overflow-hidden bg-white dark:bg-slate-800 dark:shadow-slate-900">
                    {/* Content Section */}
                    <div className="sm:p-6 p-2">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            {/* Left Side: ReusableTHeader - full width on small, 70% on md and up */}
                            <div className="w-full md:w-[70%]">
                                <ReusableTHeader
                                    setSearchTerm={setSearchTerm}
                                    name="List of Groups"
                                    createButtonAction={handleCreateButton}
                                />
                            </div>

                            {/* Right Side: Dropdown + View Button - full width on small, 30% on md and up */}
                            <div className="w-full md:w-[30%] flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                                <label htmlFor="group" className="font-semibold text-black dark:text-slate-300">
                                    Group<span className="text-red-500">*</span>
                                </label>
                                <select
                                    onChange={(e) => setselectedGroup(e.target.value)}
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm w-full sm:w-auto dark:text-white dark:bg-slate-600"
                                    name="type"
                                    id="type"
                                >
                                    <option value="F">Firm</option>
                                    <option value="D">Department</option>
                                    <option value="T">Type</option>
                                </select>
                                <button
                                    onClick={handleViewBtn}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-md text-sm w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center gap-1 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                                    type="button"
                                >
                                    <CiSearch size={20} /> View
                                </button>
                            </div>
                        </div>


                        {/* Table Section */}
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-100 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">{selectedGroup === "F" ? ("Firm") : (selectedGroup === "D" ? ("Department") : ("Type"))} {" "}Name</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-black dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-8 h-8 border-4 border-blue-500 dark:border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                                    <p className="font-medium text-black dark:text-slate-300">Loading data...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center">
                                                    <p className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">No Groups Found</p>
                                                    <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((item: any, index: number) => (
                                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-300">{item.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-300">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:ring-opacity-50 shadow-sm"
                                                            title="Edit group"
                                                        >
                                                            <CiEdit size={26} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("Are you sure you want to delete this group?")) {
                                                                    handleDelete(item.id);
                                                                }
                                                            }}
                                                            className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:ring-opacity-50 shadow-sm"
                                                            title="Delete group"
                                                        >
                                                            <RiDeleteBinLine size={20} />
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
                                <Paginations
                                    itemPerPage={itemsPerPage}
                                    data={data}
                                    handlePageChange={handlePageChange}
                                    currentPage={currentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {showEdit && (
                    <div id="editModal" className="fixed inset-0 bg-slate-600 dark:bg-slate-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-center mb-2 text-slate-900 dark:text-slate-100">Edit Group</h3>
                                <div className="border-b border-slate-200 dark:border-slate-700 mb-4"></div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6 w-full">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Group Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            value={newGroupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            type="text"
                                            placeholder="Enter New Group"
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md dark:text-white dark:bg-slate-600"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-md flex items-center gap-1 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowEdit(false); setGroupName(""); }}
                                            className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default CodeMasterView;