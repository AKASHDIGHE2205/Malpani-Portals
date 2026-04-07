/* eslint-disable @typescript-eslint/no-explicit-any */
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import EditFaqModal from "./EditFaqModal";
import { GetAllQuestions } from "../../../services/saragam/MasterApis";
import Paginations from "../../../helper/Pagination";

const ViewFAQ = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState({});
  const [activeTab, setActiveTab] = useState('Admin');
  const itemsPerPage = 5;

  const fetchData = async (flag: string) => {
    const body = {
      flag: flag || "Admin"
    };
    setLoading(true);
    try {
      const response = await GetAllQuestions(body);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch FAQ questions:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter(
    (item: any) =>
      item.question
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.u_role.toString().toLowerCase().includes(searchTerm.toLowerCase),
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (data: any) => {
    setSelectedFaq(data)
    setShowEdit(true)
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Questions Management</h1>
        </div>

        {/* Type Selection */}
        <div className="mb-6">
          {/* Tabbed Interface */}
          <div className="mt-3">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('Admin')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center ${activeTab === 'Admin'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                >
                  <FaRegUserCircle className="mr-2" size={16} />
                  Admin Questions
                </button>

                <button
                  onClick={() => setActiveTab('Manager')}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center ${activeTab === 'Manager'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                >
                  <FaRegUserCircle className="mr-2" size={16} />
                  Manager Questions
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Search Section */}
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IoMdSearch className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="pl-10 w-full bg-slate-100 dark:bg-slate-700 py-2 px-4 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Q.No
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Week
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Question
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-4 md:px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {currentItems?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">
                        {item.seq_id}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {item.week}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                        {item.question}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "A" ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
                          {item.status === 'A' ? 'Active' : 'InActive'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300 dark:hover:text-purple-200"
                            title="Edit question"
                          >
                            <CiEdit size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination Section */}
          {data.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 px-4 md:px-6 py-3">
              <Paginations
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                data={data}
                itemPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
      {showEdit && (
        <EditFaqModal showModal={showEdit} setShowModal={setShowEdit} selectedFaq={selectedFaq} onSave={fetchData} />
      )}
    </div>
  )
}
export default ViewFAQ;