/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, FormEvent } from "react";
import { CiLocationOn } from "react-icons/ci";
import CryptoJS from 'crypto-js';
import { getShopeeLocatioon } from "../../../../services/saragam/MasterApis";
import { GetAdminTransaction, GetQuestions, SubmitAdminFaq } from "../../../../services/saragam/Transactions.Apis";
import Loader from "../../../../components/Loader";
import AdminQCard from "../../../../components/AdminQCard";

const AdminFAQ = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Questions, setQuestions] = useState([]);
  const [Answers, setAnswers] = useState({});
  const [locationID, setLocationID] = useState(0);
  const [show, setshow] = useState(false);
  const [adminData, setadminData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getShopeeLocatioon();
      setData(response);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchData1 = async () => {
    const response = await GetAdminTransaction();
    setadminData(response)
  }

  useEffect(() => {
    fetchData1();
  }, []);

  const handleAnswerChange = (id: any, amount: any) => {
    setAnswers((prevAns) => ({ ...prevAns, [id]: { amount } }));
  };

  const handleClick = async (loc_id: number) => {
    setLocationID(loc_id);
    setshow(true)
    const body = {
      u_role: user?.user?.role || "Admin",
      week: "Regular",
    };

    setLoading(true);
    const response = await GetQuestions(body);
    setQuestions(response);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(Answers).forEach(([id, { Amount }]: any) =>
      formData.append(id, Amount)
    );

    const body = {
      u_id: user.user.id,
      loc_id: locationID,
      Answers: Answers
    }
    setLoading(true);
    await SubmitAdminFaq(body);
    setLoading(false);
  }

  return (
    <div className={`${Questions.length === 0 ? 'min-h-screen' : ''} p-4 md:p-6 bg-gray-50 dark:bg-slate-900`}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">

          {/* Location Selection Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <CiLocationOn className="mr-2 text-blue-500" size={24} />
              Select Location
            </h2>

            {data?.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CiLocationOn size={48} className="mx-auto mb-4 opacity-50" />
                <p>No locations available</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center">
                {data?.map((item: any) => {
                  const isLocationFilled = adminData.some(
                    (adminItem: any) => adminItem.loc_id === item.id && adminItem.u_id !== null
                  );

                  return (
                    <div key={item.id} className="relative">
                      <button
                        disabled={isLocationFilled}
                        onClick={() => handleClick(item.id)}
                        type="button"
                        className={`
                      relative group w-full min-w-[140px]
                      ${isLocationFilled
                            ? "bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600 cursor-not-allowed"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                          } 
                      inline-flex flex-col items-center px-4 py-3 text-sm font-medium rounded-xl 
                      transition-all duration-300 ease-in-out 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      shadow-sm hover:shadow-md`}
                      >
                        <CiLocationOn className={`hidden mb-2 transition-transform duration-300 group-hover:scale-125 ${isLocationFilled ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`} size={20} />
                        <span className="font-medium">{item.name}</span>

                        {/* Completion indicator */}
                        {isLocationFilled && (
                          <span className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 rounded-full p-1 shadow-lg border border-green-200 dark:border-green-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </button>

                      {/* Tooltip for completed locations */}
                      {isLocationFilled && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          Assessment completed
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Questions Grid Section */}
          {Questions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Questions.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg transition-all duration-300 hover:shadow-md border border-slate-200 dark:border-slate-600"
                  >
                    <AdminQCard
                      key={item.id}
                      item={item}
                      onAnswerChange={handleAnswerChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button Section */}
          {show && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6">
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  disabled={loading}
                  className={`
                relative overflow-hidden group
                inline-flex items-center justify-center 
                px-8 py-4 text-base font-medium 
                rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                min-w-[200px]
                ${loading
                      ? "bg-blue-500 text-white cursor-not-allowed shadow-inner"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }
              `}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Answers
                      <svg className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default AdminFAQ;