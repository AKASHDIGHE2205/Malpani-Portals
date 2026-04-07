/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import Paginations from "../../../../helper/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { FiSearch, FiDownload, FiArrowLeft } from "react-icons/fi";

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
  branch_code: number;
  branch_name: string;
}

const DesposedView = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { depositedata } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    setData(depositedata)
  }, [depositedata]);

  const handleSearch = (e: any) => {
    setSearchTerm(e);
    setCurrentPage(1);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = data?.filter((item: Entry) =>
    (item?.entry_code?.toString().toLowerCase() ?? "").includes(searchTerm.toString().toLowerCase()) ||
    (item?.firm_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.type_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.loc_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.sec_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.remark?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.desc?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (item?.date?.toString().toLowerCase() ?? "").includes(searchTerm.toString().toLowerCase())
  )
  // .slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPage = (item: any) => {
    setItemsPerPage(item);
    setCurrentPage(1);
  }

  const generateCSV = () => {
    const header = [
      "Sr. No.",
      "Doc No",
      "Doc Date",
      "File Type",
      "Year",
      "Firm Name",
      "Branch Name",
      "Location Name",
      "Section Name",
      "Description",
      "Remark",
      "Rack No.",
      "Slot No.",
      "Sub Slot No."
    ];

    // Escape CSV values safely
    const escapeCSVValue = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return '""';
      const str = value.toString();
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = data?.map((item: Entry, index: number) => [
      escapeCSVValue(index + 1),
      escapeCSVValue(item?.entry_code),
      escapeCSVValue(moment(item?.date).format("DD/MM/YYYY")),
      escapeCSVValue(item?.type_name),
      escapeCSVValue(item?.year),
      escapeCSVValue(item?.firm_name),
      escapeCSVValue(item?.branch_name),
      escapeCSVValue(item?.loc_name),
      escapeCSVValue(item?.sec_name),
      escapeCSVValue(item?.desc),
      escapeCSVValue(item?.remark),
      escapeCSVValue(item?.cub_code),
      escapeCSVValue(item?.s_code),
      escapeCSVValue(item?.su_code)
    ]);

    const csvContent = [
      header.map(escapeCSVValue).join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "file_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-8xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Disposed File
          </h1>
        </div>
        <hr />
        {/* Search and Controls Section */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  placeholder="Search disposed files..."
                  defaultValue={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Rows Selector and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 hidden">
                <span className="text-sm text-slate-700 dark:text-slate-300">Show</span>
                <select
                  className="px-3 py-3 block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  onChange={(e: any) => handleItemsPerPage(e.target.value)}
                >
                  {[5, 10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-sm text-slate-700 dark:text-slate-300">rows</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generateCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  <FiDownload className="text-white" />
                  Download CSV
                </button>
                <Link
                  to="/transaction/despose"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                >
                  <FiArrowLeft className="text-slate-600 dark:text-slate-300" />
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Doc No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Doc Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    File Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Firm Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Section
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Remark
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Rack No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Slot No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Sub Slot
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {currentItems?.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-slate-600 dark:text-slate-400 text-lg">No disposed files found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems?.map((item: Entry) => (
                    <tr key={item?.doc_code} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200" hidden>
                        {item?.entry_code}
                        {/* {item?.doc_code} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                        {item?.entry_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {moment(item?.date).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item?.type_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item?.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item?.firm_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item?.branch_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item?.loc_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item?.sec_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item?.desc}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 max-w-[180px] overflow-x-auto custom-scrollbar">
                        {item?.remark}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item?.cub_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item?.s_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item?.su_code}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 hidden">
            <Paginations
              currentPage={currentPage}
              itemPerPage={itemsPerPage}
              data={data}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesposedView