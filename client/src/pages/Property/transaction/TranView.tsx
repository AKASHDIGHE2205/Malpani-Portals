/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getAllTRansactions1 } from "../../../services/Property/transaction/pTranApis";
import { useEffect, useState } from "react";
import Paginations from "../../../helper/Pagination";
import moment from "moment";
import EditTransaction from "./EditTransaction";
import { RiDeleteBin5Line } from "react-icons/ri";
import DeleteModal from "./DeleteModal";
import { FiCalendar, FiFilter, FiLoader, FiRefreshCw, FiSearch } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";

interface TranData {
  doc_id: number;
  doc_date: string;
  file_name: string;
}

const TranView = () => {
  const [from, setFrom] = useState<string>(() =>
    moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD")
  );
  const [to, setTo] = useState<string>(() => moment().format("YYYY-MM-DD"));
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDelete, setshowDelete] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEdit, setshowEdit] = useState(false);
  const [selectedTran, setSelectedTran] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const browseData = async () => {
    setLoading(true);
    try {
      const body = {
        from_date: from,
        to_date: to,
      };
      const response = await getAllTRansactions1(body);
      if (response) {
        setData(response);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    browseData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = data?.filter((item: TranData) =>
    (item?.doc_id?.toString().toLowerCase() ?? "").includes(searchTerm.toString().toLowerCase()) ||
    (item?.doc_date?.toString().toLowerCase() ?? "").includes(searchTerm.toString().toLowerCase()) ||
    item?.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (data: number) => {
    setSelectedTran(data);
    setshowEdit(true);
  };

  const handleDelete = (item: any) => {
    setSelectedTran(item);
    setshowDelete(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center">
            Purchase Property Details
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 dark:border-slate-700 gap-4">
          {/* Filter Toggle */}
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
            onClick={() => setShowFilter(!showFilter)}>
            <FiFilter className="text-blue-600 dark:text-blue-400" />
            {showFilter ? "Hide Filter" : "Show Filter"}
          </button>

          {/* Add Entry Button */}
          <Link
            to="/property/transaction/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <IoAddCircleOutline size={18} />
            Add Entry
          </Link>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Search Input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  From Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-slate-400" />
                  </div>
                  <input
                    type="date"
                    defaultValue={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  To Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-slate-400" />
                  </div>
                  <input
                    type="date"
                    defaultValue={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  />
                </div>
              </div>

              {/* Rows Selector */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rows per page
                </label>
                <select
                  className="block w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  value={itemsPerPage}
                >
                  {[5, 10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      Show {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <button
                onClick={browseData}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Loading...
                  </>
                ) :
                  (<>
                    <FiRefreshCw />
                    Refresh Data
                  </>)}
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Doc. No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    File Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    <div className="flex justify-center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="text-slate-600 dark:text-slate-400">Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 text-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <p className="text-slate-600 dark:text-slate-400 text-lg">No transactions found</p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your filters or add a new entry</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item: TranData) => (
                    <tr key={item.doc_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                        {item.doc_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-400">
                        {moment(item.doc_date).format("DD MMM YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-slate-200">
                        {item.file_name}
                      </td>
                      <td hidden className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">

                          <button
                            onClick={() => handleEdit(item.doc_id)}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-sm dark:bg-green-900/30 dark:hover:bg-green-800/50 dark:text-green-300 dark:hover:text-green-200"
                            title="Edit"
                          >
                            <CiEdit className="h-7 w-7" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.doc_id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition hidden"
                          >
                            <RiDeleteBin5Line className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center">
                          <button
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300 dark:hover:text-purple-200"
                            aria-label="Edit"
                            onClick={() => handleEdit(item.doc_id)}
                          >
                            <CiEdit className="h-7 w-7" />
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
          <div className="mt-6">
            <Paginations
              currentPage={currentPage}
              itemPerPage={itemsPerPage}
              data={data}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEdit && (<EditTransaction show={showEdit} setShow={setshowEdit} fetchData={browseData} data={selectedTran} />)}
      {showDelete && (<DeleteModal show={showDelete} setShow={setshowDelete} fetchData={browseData} data={selectedTran} />)}
    </div >
  );
};

export default TranView;