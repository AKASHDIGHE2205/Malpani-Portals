import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { IoAddCircleOutline, IoStatsChart } from "react-icons/io5";
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
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredData = data?.filter((project: ProjectResponse) =>
    (project?.project_details?.project_name?.toLowerCase() ?? "").includes(searchTerm?.toLowerCase()) ||
    (project?.project_details?.nick_name?.toLowerCase() ?? "").includes(searchTerm?.toLowerCase()) ||
    (project?.project_details?.address?.city?.toLowerCase() ?? "").includes(searchTerm?.toLowerCase()) ||
    (project?.project_details?.address?.district?.toLowerCase() ?? "").includes(searchTerm?.toLowerCase()) ||
    (project?.project_details?.address?.line1?.toLowerCase() ?? "").includes(searchTerm?.toLowerCase()) ||
    (project?.project_details?.address?.pin_code?.toString().toLowerCase() ?? "").includes(searchTerm?.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  // Project Card Component
  const ProjectCard = ({ project }: { project: ProjectResponse }) => {
    const { project_details, project_statistics } = project;
    const address = project_details?.address;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden m-2 p-2">
        {/* Project Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {project_details?.project_name}
                </h3>
              </div>
              <div className="flex items-center gap-1 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                <FiMapPin className="w-3 h-3 flex-shrink-0 text-purple-700" />
                <span className="truncate">
                  {address?.line1}, {address?.city}, {address?.district} , {address?.state} - {address?.pin_code}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Type: {project_details?.project_type}
                {/* Code: {project_details?.ext_code} | Type: {project_details?.project_type} */}
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <Link
                to={`/plot/master/plot-edit?propId=${project_details?.project_id}&isEdit=false`}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-600 transition-colors flex items-center gap-1"
              >
                <BsEye className="w-4 h-4" />
              </Link>
              <Link
                to={`/plot/master/plot-edit?propId=${project_details?.project_id}&isEdit=true`}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <CiEdit className="w-6 h-6" />
              </Link>
            </div>
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
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{project_statistics?.available_plots}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Available</p>
            </div>
            <div className="text-center rounded-lg bg-red-100 dark:bg-red-900">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{project_statistics?.sold_plots}</p>
              <p className="text-xs text-red-600 dark:text-red-400">Sold</p>
            </div>
            <div className="text-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project_statistics?.booked_plots}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Booked</p>
            </div>
            <div className="text-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{project_statistics?.reserved_plots}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Reserved</p>
            </div>
            <div className="text-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{project_statistics?.hold_plots}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">On Hold</p>
            </div>
            <div className="text-center rounded-lg bg-slate-100 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{project_statistics?.total_plots}</p>
              <p className="text-xs text-slate-800 dark:text-white">Total Plots</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
            Projects Management
          </h1>
          {/* <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-1">
            View all master projects and their statistics
          </p> */}
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
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  placeholder="Search by project name, city..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Rows Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700 dark:text-slate-300">Show</span>
                <select
                  className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(parseInt(e.target.value))}
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
                <span>Add Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Loading projects...</span>
            </div>
          </div>
        ) : currentItems?.length > 0 ? (
          <>
            <div className="space-y-4">
              {currentItems.map((project: ProjectResponse) => (
                <ProjectCard
                  key={project?.project_details?.project_id}
                  project={project}
                />
              ))}
            </div>

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