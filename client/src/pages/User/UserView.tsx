/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import EditUser from "./UserEdit";
import { FiSearch } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import Paginations from "../../helper/Pagination";
import { getAllUsers } from "../../services/auth/authApi";

const UserView = () => {
  const [data, setData] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setData(response);
    } catch (error) {
      console.log("Error fetching user data", error);
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

  const handleSelect = (item: any) => {
    setSelectedUser(item);
    setShowEditModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = data?.filter(
      (item: any) =>
        (item?.first_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (item?.last_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (item?.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
        (item?.mobile?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
    ).slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-bold">User Details</h1>
          </div>
        </div>

        {/* Search and Controls Section */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="w-full sm:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  placeholder="Search users..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Rows Selector and Add Button */}
            <div className="flex flex-row justify-between items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700 dark:text-slate-300">Show</span>
                <select
                  className="block w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"
                  onChange={(e: any) => setItemsPerPage(e.target.value)}
                >
                  {[5, 10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-700 dark:text-slate-300">rows</span>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Mobile
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    User Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Status
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
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="text-slate-600 dark:text-slate-400">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-slate-600 dark:text-slate-400 text-lg">No users found</p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">
                          Try adding a new user or adjusting your search
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                        {item.id}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.first_name} {item.last_name}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.email}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.mobile}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.role}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                        {item.user_type}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium 
                          ${
                            item.status === "A"
                              ? "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500"
                              : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500"
                          }`}
                        >
                          {item.status === "A" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center">
                          <button
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300 dark:hover:text-purple-200"
                            aria-label="Edit"
                            onClick={() => handleSelect(item)}
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

        {showEditModal && (
          <EditUser
            show={showEditModal}
            setShow={setShowEditModal}
            fetchData={fetchData}
            selectedUser={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default UserView;