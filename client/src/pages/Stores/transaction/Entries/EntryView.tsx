/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { getAllTranEntries } from "../../../../services/Stores/transaction/transactionApi";
import { Link } from "react-router-dom";
import moment from "moment";
import Paginations from "../../../../helper/Pagination";
import EditEntry from "./EditEntry";
import { FiFilter, FiSearch, FiCalendar, FiRefreshCw } from "react-icons/fi";

interface Entry {
  doc_code: string;
  entry_code: string;
  date: string;
  type_name: string;
  year: number;
  firm_name: string;
  loc_name: string;
  sec_name: string;
  desc: string;
  remark: string;
  cub_code: string;
  s_code: string;
  su_code: string;
  type_code: number;
  firm_code: number;
  loc_code: number;
  sec_code: number;
  branch_name: string,
  branch_code: number
}

const EntryView = () => {
  const [from, setFrom] = useState<string>(() => moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD"));
  const [to, setTo] = useState<string>(() => moment().format("YYYY-MM-DD"));
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editShow, setEditShow] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const body = {
        from_Date: from,
        to_Date: to
      }
      const response = await getAllTranEntries(body);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.log("Error to Fetching Data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const browseData = async () => {
    setLoading(true);
    try {
      const body = {
        from_Date: from,
        to_Date: to
      }
      const response = await getAllTranEntries(body);
      if (response) {
        setData(response);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = data?.filter((item: Entry) =>
    (item?.entry_code?.toString().toLowerCase() ?? "").includes(searchTerm.toString().toLowerCase()) ||
    (item?.firm_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.branch_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.type_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.loc_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.sec_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.remark?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.desc?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.date?.toString().toLowerCase() ?? "").includes(searchTerm.toString().toLowerCase())
  ).slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (item: any) => {
    setSelectedEntry(item);
    setEditShow(true);
  }

  const handleItemsPerPage = (item: any) => {
    setItemsPerPage(item);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-2">
          <h1 className="text-2xl font-bold text-center">
            Entry Details
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 dark:border-slate-700 gap-4">
          {/* Filter Toggle */}
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FiFilter className="text-blue-600 dark:text-blue-400" />
            {showFilter ? "Hide Filter" : "Show Filter"}
          </button>

          {/* Add Entry Button */}
          <Link
            to="/transaction/entries"
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
                    placeholder="Type your search query here"
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
                  onChange={(e) => handleItemsPerPage(Number(e.target.value))}
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
                <FiRefreshCw />
                Browse Data
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Doc No.
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Doc Date
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    File Type
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Firm Name
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Section
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    File No.
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider hidden">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider" hidden>
                    Remark
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Rack No.
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Slot No.
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Sub Slot
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
                    <td colSpan={14} className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="text-slate-600 dark:text-slate-400">Loading entries...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-6 py-2 text-center">
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-slate-600 dark:text-slate-400 text-lg">No entries found</p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your filters or add a new entry</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item: Entry) => (
                    <tr key={item.doc_code} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                        {item.doc_code}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {moment(item.date).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.type_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.year}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item.firm_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item.branch_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item.loc_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item.sec_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                        {item.entry_code}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar hidden">
                        {item.desc}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar hidden">
                        {item.remark}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.cub_code}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.s_code}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.su_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center">
                          <button
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300 dark:hover:text-purple-200"
                            aria-label="Edit"
                            onClick={() => handleEdit(item)}
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

        {/* Edit Modal */}
        {editShow && (
          <EditEntry
            show={editShow}
            setShow={setEditShow}
            data={selectedEntry}
            fetchData={fetchData}
          />
        )}
      </div>
    </div>
  )
}

export default EntryView;

{/**
        <div className="sticky right-0 hidden">
        <div className="max-w-sm space-y-3">
          <input
            type="text"
            className="py-3 px-4 block w-full border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-700 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100"
            placeholder="Type your search query here"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="m-2 flex justify-between">
          <div className="flex flex-row items-center">
            <div>Select</div>
            <div className="m-1">
              <select
                className="py-3 pe-4 block bg-slate-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-700 dark:border-transparent dark:text-slate-400 dark:focus:ring-slate-600"
                onChange={(e: any) => handleItemsPerPage(e.target.value)} >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>rows</div>
          </div>
          <div>
            <Link
              to={"/transaction/entries"}
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none">
              <IoAddCircleOutline size={18} />
              Add Entry
            </Link>
          </div>
        </div>
      </div>
*/}