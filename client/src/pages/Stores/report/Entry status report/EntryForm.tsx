/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getEntryStatus } from "../../../../services/Stores/report/reportApis";
import { FiSearch, FiFile, FiDownload } from "react-icons/fi";


const EntryForm = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year} @ ${hours}:${minutes}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getEntryStatus();
        if (response) {
          setData(response);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const currentItems = data?.filter((item: any) =>
    item?.firm_name?.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  const generateCSV = () => {
    const header = [
      "Sr. No.",
      "Name",
      "Count",

    ];

    // Convert table data to CSV rows
    const rows = data.map((item: any, index: number) => [
      index + 1,
      item?.firm_name,
      item?.record_count,
    ]);

    // Combine header and rows
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Trigger the download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "property_register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Record Entry Status</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Report generated on: {formattedDate}</p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 block w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-slate-200"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="text-slate-600 dark:text-slate-400">Loading record status...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <FiFile className="text-slate-400 text-4xl mb-2" />
                        <p className="text-slate-600 dark:text-slate-400 text-lg">No records found</p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your search query</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item: any) => (
                    <tr key={item.firm_code} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${item.firm_name === 'Total' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${item.firm_name === 'Total' ? 'font-bold text-lg' : 'text-sm'}`}>
                        {item.firm_name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${item.firm_name === 'Total' ? 'font-bold text-lg' : 'text-sm'}`}>
                        {item.record_count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Section */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            onClick={generateCSV}
          >
            <FiDownload className="h-4 w-4" />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default EntryForm;