import { FormEvent, useState } from "react";
import { yearWiseReports } from "../../../../services/Stores/report/reportApis";
import { useRef } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiLoader, FiFileText, FiX, FiFile, FiDownload, FiPrinter } from "react-icons/fi";

interface FirmReportEntry {
  doc_code: string;
  date: string;
  desc: string;
  firm_name: string;
  branch_name: string;
  year: string;
  cub_code: string;
  s_code: string;
  remark: string;
  firm_code: string;
  branch_code: string;
}

const YearWiseReport = () => {
  const [data, setData] = useState<FirmReportEntry[]>([]);
  const [year, setYear] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!year) {
      toast.error("Please fill required field!");
      setLoading(false);
      return;
    }
    try {
      const response = await yearWiseReports({ year });
      if (response) {
        setData(response);
        setShowTable(true);
        setYear("");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVDownload = () => {
    if (data.length === 0) return;

    const headers = [
      "Doc No.",
      "Inward Date",
      "Particular",
      "Firm Name",
      "Branch Name",
      "Year",
      "Cupboard No.",
      "Slot No.",
      "Remark"
    ];

    const rows = data.map(row => [
      row.doc_code,
      new Date(row.date).toLocaleDateString(),
      row.desc,
      row.firm_name,
      row.branch_name,
      row.year,
      row.cub_code,
      row.s_code,
      row.remark
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "firm_yearwise_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const newWindow = window.open("", "", "width=1000,height=700");
    if (!newWindow) return;

    newWindow.document.write(`
    <html>
      <head>
      <title>Year wise Report</title>
       <style>
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          body {
            font-family: sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
          }
        </style>
      </head>
      <body>
       
        ${printContent.innerHTML}
      </body>
    </html>
  `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  const handleCancel = () => {
    setShowTable(false)
    setData([])
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center">
            Year Wise Report
          </h1>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Year Input */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Year <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="year"
                    className="rounded-lg pl-10 block w-full px-3 py-2 rounded-l-lg focus:border-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-0 focus:ring-blue-500 transition bg-white"
                    placeholder="Enter Year (YYYY-YY)..."
                    disabled={showTable}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:from-green-400 disabled:to-green-500 disabled:cursor-not-allowed"
                disabled={showTable || loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FiFileText className="hidden sm:block" />
                    Browse Report
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                onClick={handleCancel}
              >
                <FiX className="hidden sm:block" />
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        {showTable && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <div ref={printRef} className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Doc No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Inward Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Particular
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Firm Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Branch Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Cub.No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Slot No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          <span className="text-slate-600 dark:text-slate-400">Loading report data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length > 0 ? (
                    data.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {row.doc_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {new Date(row.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {row.desc}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                          {row.firm_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                          {row.branch_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {row.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {row.cub_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {row.s_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                          {row.remark}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <FiFile className="text-slate-400 text-4xl mb-2" />
                          <p className="text-slate-600 dark:text-slate-400 text-lg">No records found</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Export Section */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCSVDownload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <FiDownload className="h-4 w-4" />
                Download CSV
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                <FiPrinter className="h-4 w-4" />
                Print Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearWiseReport;
