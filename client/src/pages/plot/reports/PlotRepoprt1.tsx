import { useEffect, useState } from "react"
import { ProjectResponse } from "../master/ViewProp";
import { generateReport1, getAllProjects } from "../../../services/plot/plotApi";
import toast from "react-hot-toast";
import moment from "moment";

export interface ProjectPlotReport {
  project_id: number;
  project_name: string;
  address: string;
  area: string;
  reference_by: string;
  survey_no: string;
  plot_type: string;
  remark: string;
  plot_no: string;
  status: 'B' | 'S' | 'O' | 'H' | 'R' | string;
  customer_name: string;
  book_date: string;
  sold_date: string;
}

const PlotRepoprt1 = () => {
  const [formData, setFormData] = useState({
    status: "",
    from_date: "",
    to_date: ""
  });
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [data, setData] = useState<ProjectPlotReport[]>([]);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await getAllProjects();
      setProjects(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => { fetchProjects() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async () => {
    if (!formData.from_date || !formData.to_date) {
      return toast.error("Please fill all required fields.")
    }
    const body = {
      project_id: selectedProject || "All",
      status: formData?.status || "All",
      from_date: formData?.from_date,
      to_date: formData?.to_date
    }
    const response = await generateReport1(body);
    if (response) {
      setData(response.data);
      setShowResult(true);
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      from_date: "",
      status: "",
      to_date: ""
    })
    setSelectedProject(0);
    setShowResult(false);
  }

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'O': 'Available',
      'H': 'Hold',
      'S': 'Sold',
      'B': 'Booked',
      'R': 'Reserved'
    };
    return statusMap[status] || status;
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    try {
      const headers = [
        "Sr No",
        "Project ID",
        "Project Name",
        "Address",
        "Area",
        "Reference By",
        "Survey No",
        "Plot Type",
        "Remark",
        "Plot No",
        "Status",
        "Customer Name",
        "Book Date",
        "Sold Date"
      ];

      // Transform data to CSV rows
      const rows = data.map((item, index) => [
        index + 1,
        item.project_id,
        item.project_name,
        item.address,
        item.area || " ",
        item.reference_by || " ",
        item.survey_no || " ",
        item.plot_type || " ",
        item.remark || " ",
        item.plot_no,
        getStatusLabel(item.status),
        item.customer_name || " ",
        item.book_date && item.book_date !== "0000-00-00"
          ? moment(item.book_date).format("DD/MM/YYYY")
          : " ",
        item.sold_date
          ? moment(item.sold_date).format("DD/MM/YYYY")
          : " "
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row =>
          row.map(cell => {
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `plot_report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
      console.error("CSV download error:", error);
    }
  };

  const tableHeaders = [
    "Sr No",
    // "Project ID",
    "Project Name",
    "Address",
    "Plot No",
    "Plot Type",
    "Area",
    "Survey No",
    "Status",
    "Reference By",
    "Customer Name",
    "Book Date",
    "Sold Date",
    "Remark",
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-full mx-auto">
        {/* Section 1 — Property Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-2">

            <div className="lg:col-span-2 md:col-span-2 col-span-1">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">Basic Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Type</label>
              <select
                name="project"
                value={selectedProject}
                onChange={e => setSelectedProject(Number(e.target.value))}
                disabled={projectsLoading}
                className="w-full sm:w-3/4 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">All Projects</option>
                {projects?.map((item) => (<option key={item?.project_details?.project_id} value={item?.project_details?.project_id}>{item?.project_details?.project_name}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full sm:w-3/4 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">All Plots</option>
                <option value="O">Available</option>
                <option value="H">Hold</option>
                <option value="S">Sold</option>
                <option value="B">Booked</option>
                <option value="R">Reserved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">From Date
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                onChange={handleChange}
                className="w-full sm:w-3/4 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To Date
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                onChange={handleChange}
                className="w-full sm:w-3/4 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

          </div>
          {/* Actions */}
          <div className="py-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Reset
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
              Generate Report
            </button>
          </div>
        </div>

        {/* Section 2 — Result Section */}
        {showResult && (
          <>
            <div className="flex justify-between items-center mb-4 px-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Report Results ({data.length} records)
              </h2>
              <button
                onClick={downloadCSV}
                disabled={!data || data.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export to CSV
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 m-4">
                <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                  <tr>
                    {tableHeaders.map(header => (
                      <th key={header} className="px-3 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap border-r border-slate-200 dark:border-slate-600 last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-6 text-slate-500">
                        Loading...
                      </td>
                    </tr>
                  ) : data && data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{index + 1}</td>
                        <td className="px-3 py-2 text-sm max-w-[150px] truncate">{item?.project_name}</td>
                        <td className="px-3 py-2 text-sm max-w-[200px] truncate">{item?.address || ""}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item?.plot_no}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item?.plot_type || ""}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item?.area || ""}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item?.survey_no || ""}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                           ${item?.status === 'S' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : item?.status === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : item?.status === 'H' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : item?.status === 'R' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : item?.status === 'O' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                            {getStatusLabel(item?.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item?.reference_by || ""}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item?.customer_name || ""}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {item?.book_date && item.book_date !== "0000-00-00"
                            ? moment(item.book_date).format("DD/MM/YYYY")
                            : ""}
                        </td>

                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {item?.sold_date && item.sold_date !== "0000-00-00"
                            ? moment(item.sold_date).format("DD/MM/YYYY")
                            : ""}
                        </td>
                        <td className="px-3 py-2 text-sm max-w-[200px] truncate">{item?.remark || ""}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-8 text-slate-500 dark:text-slate-400">
                        No records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PlotRepoprt1