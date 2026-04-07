/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { BsCheck2Square } from "react-icons/bs";
import { useDispatch } from "react-redux";
import Paginations from "../../../../helper/Pagination";
import { handleSelectDept } from "../../.../../../../feature/post/PostEntrySlice";
import { getDepartment } from "../../../../services/post/Transaction/TransactionsAPI";
import { AppDispatch } from "../../../../store/store";

interface DeptModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

const DeptModal: FC<DeptModalProps> = ({ show, setShow }) => {
    const dispatch: AppDispatch = useDispatch();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemperPage = 5;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDepartment();
                setData(response);
            } catch (error: any) {
                console.log("Something Went wrong...!", error);
            }
        }
        fetchData();
    }, [])

    const indexOfLastItem = currentPage * itemperPage;
    const indexOfFirstItem = indexOfLastItem - itemperPage;

    const currentItems = data.filter((item: any) =>
        (item.dept_name && item.dept_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(indexOfFirstItem, indexOfLastItem)

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    }

    const handleSelect = (item: any) => {
        dispatch(handleSelectDept({ id: item.dept_id, name: item.dept_name }));
        setShow(false);
    }
    return (
        <div id="deptModal" className={`fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center ${show ? 'flex' : 'hidden'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                <div className="p-6">
                    <button
                        onClick={() => setShow(false)}
                        className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4">
                        <div className="mb-4">
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Select Department from list...!</h1>
                        </div>
                        <div className="flex justify-end mb-4">
                            <div className="relative w-full sm:w-64">
                                <input
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type="text"
                                    className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white dark:bg-gray-700"
                                    placeholder="Search"
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
                    </div>

                    <div className="overflow-x-auto w-full mb-4">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Department</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {currentItems.map((item: any, index: number) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.dept_id}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.dept_name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <button
                                                className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded text-sm flex items-center gap-1 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                                onClick={() => handleSelect(item)}
                                            >
                                                <BsCheck2Square size={15} /> Select
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Paginations currentPage={currentPage} itemPerPage={itemperPage} handlePageChange={handlePageChange} data={data} />

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => setShow(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeptModal;