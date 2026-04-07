/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import NoData from "../../../assets/FallBack.png";
import { CiSearch } from "react-icons/ci";
import { FiGrid, FiList } from "react-icons/fi";
import { getShopeeLocatioon } from "../../../services/saragam/MasterApis";
import LocationCard from "../../../components/LocationCard";

const ViewProgress = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getShopeeLocatioon();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data === undefined || data === null || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Link
          to={"/"}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 py-3 px-6 text-white hover:bg-blue-700 transition-colors mb-8"
        >
          <IoArrowBackSharp size={20} />
          Go Back
        </Link>

        <div className="text-center">
          <img
            src={NoData}
            className="h-64 w-64 mx-auto rounded-2xl opacity-90"
            alt="No data available"
          />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mt-4">
            No Locations Available
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            There are currently no locations to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 w-full bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Select Location
            </h1>
          </div>

        </div>

        {/* Search and View Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search locations by name, address, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">View:</span>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors duration-200 ${viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-300"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                  title="Grid view"
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors duration-200 ${viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-300"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                  title="List view"
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Locations Grid/List */}
        {filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CiSearch size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
              No locations found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Try adjusting your search term or filters to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item: any) => (
              <div
                key={item.id}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <LocationCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {filteredData.map((item: any, index) => (
              <div
                key={item.id}
                className={`transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-750 ${index !== filteredData.length - 1 ? "border-b border-slate-200 dark:border-slate-700" : ""
                  }`}
              >
                <div className="p-4 md:p-6">
                  <LocationCard item={item} viewMode="list" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProgress;

