import { useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useParams, Link } from "react-router-dom";
import Nodata from "../../../assets/FallBack.png";
import { GetFilledChecklist } from "../../../services/saragam/MasterApis";
import Table from "../../../components/Table";


const FilledChecklist = () => {
  const { loc_id } = useParams();
  const currentDate = new Date().toISOString().slice(0, 10);
  const [year, month, day] = currentDate.split("-");
  const formattedDate = `${day}-${month}-${year}`;
  const [date, setDate] = useState(formattedDate);
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);

  if (data === undefined || data === null) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="max-w-md w-full text-center">
          {/* Go Back Button */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white dark:bg-slate-700 py-3 px-6 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:-translate-y-0.5"
            >
              <IoArrowBackSharp size={18} />
              Go Back to Dashboard
            </Link>
          </div>

          {/* No Data Illustration */}
          <div className="mb-6">
            <div className="animate-bounce-slow">
              <img
                src={Nodata}
                alt="No data available"
                className="mx-auto h-64 w-64 md:h-80 md:w-80 object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleSubmit = async () => {
    const body = {
      loc_id: loc_id,
      date: date,
    };
    console.log(body);

    setloading(true);
    const response = await GetFilledChecklist(body);
    setData(response);
    setloading(false);
  };
  return (
    <>
      <div className={`p-4 md:p-6 w-full ${data.length === 0 ? 'min-h-screen flex flex-col justify-center' : ''}`}>
        <div className="max-w-4xl mx-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 w-full">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Data Report</h1>
            <p className="text-slate-600 dark:text-slate-400">Select a date to view the corresponding data</p>
          </div>

          {/* Date Selection Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1">
                <label htmlFor="date-input" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    value={date}
                    type="date"
                    onChange={(e) => setDate(e.target.value)}
                    id="date-input"
                    className="py-3 px-4 block w-full bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select a date"
                  />
                </div>
              </div>

              <div className="w-full md:w-auto">
                <button
                  type="button"
                  disabled={date.length === 0 || loading}
                  onClick={handleSubmit}
                  className="w-full md:w-auto py-3 px-6 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 dark:focus:ring-offset-slate-800"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block h-4 w-4 border-[2px] border-current border-t-transparent rounded-full" role="status" aria-label="loading" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {data?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select a date to begin
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Choose a date from the calendar above to generate and view your data report.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Report for {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
              </div>
              <Table checkdata={data} loading={loading} />
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default FilledChecklist;
