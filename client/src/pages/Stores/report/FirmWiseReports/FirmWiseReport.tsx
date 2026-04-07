import { useEffect, useState, useCallback } from "react";
import { getReportData } from "../../../../services/Stores/report/reportApis";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

interface FirmData {
  doc_code: number;
  date: string;
  desc: string;
  firm_name: string;
  branch_name: string;
  entry_code: number;
  year: string;
  cub_code: string;
  s_code: string;
  remark: string;
  firm_code: number;
  branch_code: number;
}

const FirmWiseReport = () => {
  const [data, setData] = useState<FirmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getReportData();
      if (response) {
        setData(response);
      } else {
        setError("No data received from server");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch report data";
      console.error("Fetch error:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // Memoized table rows to prevent unnecessary re-renders
  const tableRows = data.map((row, index) => (
    <tr key={`${row.doc_code}-${row.firm_code}-${row.branch_code}-${index}`}
      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">{row.doc_code}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {new Date(row.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{row.desc}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.firm_name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.branch_name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.entry_code}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.year}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.cub_code}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.s_code}</td>
      <td className="px-6 py-4 whitespace-nowrap">{row.remark}</td>
    </tr>
  ));

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4 sticky top-0 z-10 bg-white dark:bg-slate-800">
            <h1 className="text-2xl font-bold text-center">All Report</h1>
          </div>
          <div className="p-8 text-center">
            <div className="flex justify-center items-center gap-3 py-8">
              <FiLoader className="animate-spin text-2xl" />
              <span className="text-lg">Loading report data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4 sticky top-0 z-10 bg-white dark:bg-slate-800">
            <h1 className="text-2xl font-bold text-center">All Report</h1>
          </div>
          <div className="p-8 text-center">
            <div className="py-8 text-red-600 dark:text-red-400">
              <p className="text-lg font-medium">Error loading data</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-4 sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">All Report</h1>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Records: {data.length}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Doc No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Inward Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Particular
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Firm Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Branch Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    File No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    CUB.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Slot No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Remark
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {data.length > 0 ? (
                  tableRows
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        No records found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirmWiseReport;