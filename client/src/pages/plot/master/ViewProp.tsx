/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { FiGrid, FiList, FiMapPin, FiSearch } from "react-icons/fi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { IoAddCircleOutline, IoLocationOutline, IoStatsChart } from "react-icons/io5";
import { Link } from "react-router-dom";
import Paginations from "../../../helper/Pagination";
import { getAllProjects } from "../../../services/plot/plotApi";

export interface ProjectResponse {
  project_details: ProjectDetails;
  project_statistics: ProjectStatistics;
  plots: Plot[];
}

export interface ProjectDetails {
  project_id: number;
  project_name: string;
  nick_name: string;
  address: Address;
  ext_code: string;
  geo_location: string | null;
  project_type: string;
  status: string;
  file_path: string
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

export interface Address {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  pin_code: string;
  district: string;
  state: string;
}

export interface ProjectStatistics {
  total_plots: number;
  available_plots: number;
  sold_plots: number;
  booked_plots: number;
  hold_plots: number;
  reserved_plots: number;
  total_value: number;
  total_area: number;
  average_price_per_plot: string;
  average_area_per_plot: string;
}

export interface Plot {
  plot_no: string;
  plot_sr: number;
  area: number;
  price: number;
  survey_no: string;
  status: string;
  status_text: string;
  customer_name: string | null;
  book_date: string | null;
  book_amount: number | null;
  sold_date: string | null;
  sold_amount: number | null;
  vc_remarks: string;
  cX: number | null;
  cY: number | null;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

const ViewProp = () => {
  const [data, setData] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllProjects();
      if (response?.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error while fetching data", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: string) => {
    setSearchTerm(e);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleProjectExpansion = (projectId: number) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  const filteredData = data?.filter((project: ProjectResponse) =>
    (project.project_details.project_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (project.project_details.nick_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (project.project_details.address.city?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'A': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
      'I': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  // Helper function to get plot status badge
  const getPlotStatusBadge = (status: string) => {

    const statusMap: Record<string, string> = {
      'O': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'S': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'B': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'R': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'H': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };

    return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  // Card View Component
  const ProjectCard = ({ project, isExpanded, onToggle }: { project: ProjectResponse; isExpanded: boolean; onToggle: () => void }) => {
    const { project_details, project_statistics, plots } = project;
    const address = project_details.address;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden m-2 p-2">
        {/* Project Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {project_details.project_name}
                </h3>
                {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project_details.status)}`}>
                  {project_details.status === 'A' ? 'Active' : 'Inactive'}
                </span> */}
              </div>
              <div className="flex items-center gap-1 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                <FiMapPin className="w-3 h-3 flex-shrink-0 text-purple-700" />
                <span className="truncate">
                  {address.line1}, {address.city}, {address.state} - {address.pin_code}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Code: {project_details.ext_code} | Type: {project_details.project_type}
              </div>
            </div>
            <button
              onClick={onToggle}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors"
            >
              {isExpanded ? "Hide Plots" : `View Plots (${plots.length})`}
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 mb-3">
            <IoStatsChart className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Project Statistics</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-1 rounded-lg bg-green-100 dark:bg-green-900">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{project_statistics.available_plots}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Available</p>
            </div>
            <div className="text-center rounded-lg bg-red-100 dark:bg-red-900">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{project_statistics.sold_plots}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Sold</p>
            </div>
            <div className="text-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project_statistics.booked_plots}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Booked</p>
            </div>
            <div className="text-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{project_statistics.reserved_plots}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Reserved</p>
            </div>
            <div className="text-center rounded-lg bg-yellow-100 dark:bg-green-900">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{project_statistics.hold_plots}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">On Hold</p>
            </div>
            <div className="text-center rounded-lg bg-slate-100 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{project_statistics.total_plots}</p>
              <p className="text-xs text-slate-800 dark:text-white">Total Plots</p>
            </div>
            {/* <div className="text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-white">{formatCurrency(project_statistics.total_value)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-white">{project_statistics.total_area} sq.ft</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Area</p>
            </div> */}
          </div>
        </div>

        {/* Plots Section - Expandable */}
        {isExpanded && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <HiOutlineHomeModern className="w-5 h-5" />
              Plots List ({plots.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Plot No.</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Area (sq.ft)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Customer</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-600 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {plots.map((plot, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{plot.plot_no}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{plot.area}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(plot.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                           ${getPlotStatusBadge(plot.status)}`}>
                          {plot.status === "O" ? "Open" : plot.status === "S" ? "Sold" : plot.status === "R" ? "Reserved" : plot.status === "H" ? "Hold" : plot.status === "B" ? "Booked" : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {plot.customer_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-center flex justify-center items-center gap-2">
                        <Link
                          to={`/plot/master/update-plot?projectId=${project_details?.project_id}&plotId=${plot?.plot_sr}`}
                          className="p-1.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors dark:bg-purple-900/30 dark:hover:bg-purple-800/50 cursor-pointer"
                          aria-label="Edit Plot"
                        >
                          <CiEdit className="w-6 h-6" />
                        </Link>
                        <Link
                          to={`/plot/master/update-plot?projectId=${project_details?.project_id}&plotId=${plot?.plot_sr}&edit=false`}
                          className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 text-green-600 transition-colors dark:bg-green-900/30 dark:hover:bg-green-800/50 cursor-pointer"
                          aria-label="Edit Plot"
                        >
                          <BsEye className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Table View Component (Compact)
  const ProjectTableRow = ({ project, onToggleExpand, isExpanded }: { project: ProjectResponse; onToggleExpand: () => void; isExpanded: boolean }) => {
    const { project_details, project_statistics, plots } = project;
    const address = project_details.address;

    return (
      <>
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{project_details.ext_code}</div>
          </td>
          <td className="px-4 py-3">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">{project_details.project_name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <IoLocationOutline className="w-3 h-3" />
              {address.city}, {address.state}
            </div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="text-sm text-slate-600 dark:text-slate-400">{project_statistics.total_plots} plots</div>
            <div className="text-xs text-green-600 dark:text-green-400">{project_statistics.available_plots} available</div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project_details.status)}`}>
              {project_details.status === 'A' ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-right">
            <button
              onClick={onToggleExpand}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {isExpanded ? "Hide" : `View ${plots.length} plots`}
            </button>
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Plot No.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Area</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Customer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plots.map((plot, idx) => (
                      <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                        <td className="px-3 py-2 text-sm text-slate-800 dark:text-slate-200">{plot.plot_no}</td>
                        <td className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">{plot.area} sq.ft</td>
                        <td className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">{formatCurrency(plot.price)}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPlotStatusBadge(plot.status_text)}`}>
                            {plot.status_text || plot.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">{plot.customer_name || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
            Projects & Plots Management
          </h1>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-1">
            View all master projects and their associated plots
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="w-full sm:w-80">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                  placeholder="Search by project name, nick name or city..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-md transition-all ${viewMode === "card" ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all ${viewMode === "table" ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {/* Rows Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700 dark:text-slate-300">Show</span>
                <select
                  className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                  onChange={(e: any) => setItemsPerPage(parseInt(e.target.value))}
                  value={itemsPerPage}
                >
                  {[5, 10, 25, 50].map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
                <span className="text-sm text-slate-700 dark:text-slate-300">rows</span>
              </div>

              {/* Add Button */}
              <Link
                to={'/plot/master/add-plot'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <IoAddCircleOutline size={18} />
                <span className="hidden sm:inline">Add Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Loading projects and plots...</span>
            </div>
          </div>
        ) : currentItems?.length > 0 ? (
          <>
            {viewMode === "card" ? (
              <div className="space-y-4">
                {currentItems.map((project: ProjectResponse) => (
                  <ProjectCard
                    key={project.project_details.project_id}
                    project={project}
                    isExpanded={expandedProject === project.project_details.project_id}
                    onToggle={() => toggleProjectExpansion(project.project_details.project_id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Plots Info</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {currentItems.map((project: ProjectResponse) => (
                      <ProjectTableRow
                        key={project.project_details.project_id}
                        project={project}
                        isExpanded={expandedProject === project.project_details.project_id}
                        onToggleExpand={() => toggleProjectExpansion(project.project_details.project_id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6">
              <Paginations
                currentPage={currentPage}
                itemPerPage={itemsPerPage}
                data={filteredData}
                handlePageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No Projects found</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                {searchTerm ? "Try adjusting your search" : "Click 'Add Project' to create your first project"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProp;