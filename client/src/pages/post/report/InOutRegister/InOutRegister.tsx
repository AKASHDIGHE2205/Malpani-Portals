/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import moment from "moment";
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableReport from './PrintableReport';
import axios from "axios";
import { RootState } from "../../../../store/store";
import { BaseUrl } from "../../../../constant/BaseUrl";
import { getInOutReport } from "../../../../services/post/Reports/ReportApi";
import { handleSelectDept, handleSelectFirm, handleSelectPostType } from "../../../../feature/post/PostEntrySlice";
import CryptoJS from "crypto-js";
import PostTypeModal from "../../transaction/InwardEntry/PostTypeModal";
import FirmModal from "../../transaction/InwardEntry/FirmModal";
import DeptModal from "../../transaction/InwardEntry/DeptModal";


const InOutRegister = () => {
  const dispatch = useDispatch();
  const { post_id, post_name, firm_id, firm_name, dept_id, dept_name } = useSelector((state: RootState) => state.postentry);
  const secretKey = `Malpani@2025`;

  const dcryptdata = (encryptedData: string, secretkey: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretkey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        throw new Error("Decryption failed. Data is empty or corrupted.");
      }
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Error during decryption:", error);
      return null;
    }
  }

  const getUserData = () => {
    const encryptedData = sessionStorage.getItem("user");
    if (encryptedData) {
      return dcryptdata(encryptedData, secretKey)
    }
    return null
  }
  const user = getUserData();

  const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0];
  const currentdate = new Date().toISOString().split('T')[0];
  const [data, setData] = useState<any[]>([]);
  const [totalsum, setTotalSum] = useState([]);
  const componentPdf = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showFirm, setShowFirm] = useState(false);
  const [showDept, setShowDept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Inputs, setInputs] = useState({
    fromdate: startDate,
    todate: currentdate,
    register: "",
    reporttype: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!Inputs.fromdate || !Inputs.todate || !Inputs.register) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const body = {
      from_date: Inputs.fromdate,
      to_date: Inputs.todate,
      flag: Inputs.register,
      post_type: post_id || 0,
      firm_id: firm_id || 0,
      dept_id: dept_id || 0,
      loc_id: user.user.loc_id
    };
    setShow(true);
    const response = await axios.post(`${BaseUrl}/post/getInOutSum`, body);
    if (response.status === 200) {
      setTotalSum(response.data)
    }
    try {
      const response = await getInOutReport(body);
      setData(response?.data);
      setLoading(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleInputs = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const generatePdf = useReactToPrint({
    contentRef: componentPdf,
    documentTitle: "InOutRegisterReport",
  });

  const filteredData = data?.filter((item: any) =>
    item.post_type && item.post_type.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.entry_id && item.entry_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.firm_name && item.firm_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dept_name && item.dept_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.party_name && item.party_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city_name && item.city_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.receipt_no && item.receipt_no.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    moment(item.entry_date).format("DD/MM/YYYY").toString().includes(searchTerm.toString())
  );

  const handleBack = () => {
    setShow(false);
    dispatch(handleSelectFirm({ id: 0, name: "" }));
    dispatch(handleSelectPostType({ id: 0, name: "" }));
    dispatch(handleSelectDept({ id: 0, name: "" }))
    setInputs({
      fromdate: startDate,
      todate: currentdate,
      register: "",
      reporttype: "",
    });
  }

  // CSV export function
  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Prepare CSV content
      const headers = [
        'Date',
        'Receipt No',
        'Firm Name',
        'Department',
        'To',
        'City',
        'Qty',
        'Amount',
        'Remark',
        'Entry ID',
        'Received Date'
      ];
      const csvRows = data.map(item => [
        moment(item.entry_date).format('DD/MM/YYYY'),
        item.receipt_no || '',
        item.firm_name || '',
        item.dept_name || '',
        item.party_name || '',
        item.city_name || '',
        item.qty || '0',
        item.charges || '0',
        item.remark || '',
        item.entry_id || '',
        item.rec_date ? moment(item.rec_date).format('DD/MM/YYYY') : ''
      ].map(cell => `"${cell}"`).join(','));

      const csvContent = [
        headers.join(','),
        ...csvRows
      ].join('\n');

      // Create and download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const fileName = `InOutRegister_${moment().format('YYYYMMDD_HHmmss')}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  // And update the button in the JSX:
  <button
    className="flex items-center justify-center rounded-md px-2 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white dark:from-green-700 dark:to-green-800 hover:bg-green-700 dark:hover:bg-green-900 transition-colors"
    onClick={exportToCSV}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Export CSV
  </button>

  return (
    <>
      {/* Form Section */}
      {!show && (
        <div className=" min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center w-full">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden dark:shadow-gray-900">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-4">
              <h1 className="text-2xl font-bold">Inward/Outward Register Report</h1>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="fromdate">
                      From Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={Inputs.fromdate}
                      onChange={handleInputs}
                      name="fromdate"
                      type="date"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="todate">
                      To Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={Inputs.todate}
                      onChange={handleInputs}
                      name="todate"
                      type="date"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white w-full"
                      required
                    />
                  </div>
                </div>

                {/* Register Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="register">
                    Register Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    onChange={handleInputs}
                    value={Inputs.register}
                    name="register"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Register Type</option>
                    <option value="I">Inward</option>
                    <option value="O">Outward</option>
                  </select>
                </div>

                {/* Selection Fields with Modals */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Post Type */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Post Type
                    </label>
                    <div className="flex w-full">
                      <input
                        name="posttype"
                        type="text"
                        placeholder="[All]"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        value={post_name}
                        readOnly
                      />
                      <button
                        type="button"
                        className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        onClick={() => setShowPost(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>

                  {/* Firm Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Firm Name
                    </label>
                    <div className="flex w-full">
                      <input
                        name="firmname"
                        type="text"
                        placeholder="[All]"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        value={firm_name}
                        readOnly
                      />
                      <button
                        type="button"
                        className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        onClick={() => setShowFirm(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>

                  {/* Department Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-black dark:text-gray-300 mb-1">
                      Department Name
                    </label>
                    <div className="flex w-full">
                      <input
                        name="departmentname"
                        type="text"
                        placeholder="[All]"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                        value={dept_name}
                        readOnly
                      />
                      <button
                        type="button"
                        className="px-1 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        onClick={() => setShowDept(true)}
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                </div>

                {/* Report Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-black dark:text-gray-300 mb-1" htmlFor="reporttype">
                    Report Type
                  </label>
                  <select
                    onChange={handleInputs}
                    value={Inputs.reporttype}
                    name="reporttype"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option disabled selected value="">Select Report Type</option>
                    <option value="detail">Detailed Report</option>
                    <option value="summary">Summary Report</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md flex justify-center items-center gap-2 hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                  >
                    Generate Reports
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-300 rounded-md flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleBack}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {show && (
        <div className="min-h-screen bg-white dark:bg-gray-900 sm:p-4 p-2 w-full">
          <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden dark:shadow-gray-900">
            {/* Action Bar */}
            <div className="p-2">
              <div className="flex flex-row justify-between items-center gap-4">
                <button
                  className="flex items-center justify-center rounded-md px-2 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white dark:from-gray-700 dark:to-gray-800 hover:bg-gray-700 dark:hover:bg-gray-900 transition-colors"
                  onClick={handleBack}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>

                <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">Report Results</h2>

                <div className="flex gap-2">
                  {/* PDF Download */}
                  <button
                    className="flex items-center justify-center rounded-md px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:bg-purple-700"
                    onClick={generatePdf}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    PDF
                  </button>

                  {/* CSV Export */}
                  <button
                    className="flex items-center justify-center rounded-md px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:bg-green-700"
                    onClick={exportToCSV}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm8 4H4v-2h16v2z" />
                    </svg>
                    CSV
                  </button>
                </div>

              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-gray-100 dark:bg-gray-700 flex justify-end">
              <div className="relative">
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  className="pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm w-64 dark:bg-gray-600 dark:text-white"
                  placeholder="Search report..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="sm:p-4">
              <div ref={componentPdf} className="bg-white dark:bg-gray-800 rounded-lg sm:p-6 p-2">
                <PrintableReport totalsum={totalsum} data={filteredData} inputs={Inputs} loading={loading} />
              </div>
            </div>
            {/* Empty State */}
            {!loading && (
              <>
                {filteredData?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No records found</p>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      )}

      <PostTypeModal show={showPost} setShow={setShowPost} />
      <FirmModal show={showFirm} setShow={setShowFirm} />
      {showDept && <DeptModal show={showDept} setShow={setShowDept} />}
    </>
  );
};

export default InOutRegister;