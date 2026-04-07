/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import NoData from '../../../../assets/FallBack.png';
import CryptoJS from 'crypto-js';
import { GetQuestions, GetQuestionStatus } from "../../../../services/saragam/Transactions.Apis";
import { BaseUrl } from "../../../../constant/BaseUrl";
import { IoArrowBackSharp, IoCalendarClearOutline, IoCalendarNumberOutline, IoNavigateCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import QuestionsCard from "../../../../components/QuestionsCard";

const ManagerFAQ = () => {
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const questionRefs: any = useRef([]);
  const [questionStatus, setQuestionStatus] = useState<any>([]);
  const [weekNumber, setWeekNumber] = useState(0);
  const [activeTab, setActiveTab] = useState('Regular');
  const navigate = useNavigate();
  let week = "";

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

  const handleGetQuestions = async (flag: string) => {
    try {
      if (flag === 'Regular') {
        const body = {
          u_role: user.user.role,
          week: 'Regular',
        };
        setLoading(true);
        const response = await GetQuestions(body);
        setData(response);
        setLoading(false);
        questionRefs.current = response.map(
          (_: any, index: any) =>
            questionRefs.current[index] || React.createRef(),
        );
      } else {
        const body = {
          u_role: user.user.role,
          week: week,
        };
        setLoading(true);
        const response = await GetQuestions(body);
        setData(response);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetQuestions(activeTab);
  }, [activeTab]);

  const handleAnswerChange = (
    id: any,
    status: any,
    description: any,
    image: any,
  ) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: { status, description, image },
    }));
  };

  const handleQuestionClick = (index: any) => {
    questionRefs?.current[index - 1].current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(answers).forEach(
      ([id, { status, description, image }]: any) => {
        formData.append('status', status);
        formData.append('description', description);
        formData.append('u_id', user.user.id);
        formData.append('q_id', id);
        if (image) {
          if (Array.isArray(image)) {
            image.forEach((file) => {
              formData.append('images', file);
            });
          } else {
            formData.append('images', image);
          }
        } else {
          formData.append('images', 'null');
        }
      },
    );

    try {
      const response = await axios.post(`${BaseUrl}/checklist/transactions`, formData,);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response ? error.response.data.message : 'Error submitting transaction');
    }
  };

  const fetchData = async () => {
    const response = await GetQuestionStatus(user.user.id);
    setQuestionStatus(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getWeekNumber = (date: any) => {
      const currentDate: any = new Date(date);
      const startOfMonth: any = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const days = Math.floor(
        (currentDate - startOfMonth) / (24 * 60 * 60 * 1000),
      );
      const weekNumber = Math.ceil((days + startOfMonth.getDay() + 1) / 7);
      return weekNumber;
    };

    const currentDate = new Date().toISOString().slice(0, 10);
    const weekNum: any = getWeekNumber(currentDate);
    setWeekNumber(weekNum);
  }, []);

  if (weekNumber === 1) {
    week = 'First';
  } else if (weekNumber === 2) {
    week = 'Second';
  } else if (weekNumber === 3) {
    week = 'Third';
  } else {
    week = 'regular';
  }

  if (data === undefined || data === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Link
          to={'/'}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-bodydark py-3 px-6 mb-6 text-center font-medium text-white hover:bg-opacity-90"
        >
          <IoArrowBackSharp size={20} />
          Go Back
        </Link>
        <div className="flex justify-center">
          <img
            src={NoData}
            className="h-[400px] w-[400px] rounded-2xl"
            alt="No data available"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${data.length === 0 ? 'min-h-screen' : 'h-auto'} sm:m-5 p-4 bg-gray-50 dark:bg-slate-900 transition-colors duration-300`}>
      <Link
        to={'/'}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-6 mb-6 text-center font-medium text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <IoArrowBackSharp size={18} />
        Go Back
      </Link>

      {/* Modern Tab Interface */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-2">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex flex-wrap justify-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('Regular')}
              className={`py-3 px-4 md:px-6 text-sm md:text-base font-medium border-b-2 transition-all duration-300 rounded-t-lg ${activeTab === 'Regular'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
              <span className="flex items-center gap-2">
                <IoCalendarClearOutline size={18} />
                Daily Checklist
              </span>
            </button>

            {(week === 'First' || week === 'Second' || week === 'Third') && (
              <button
                onClick={() => setActiveTab('Week')}
                className={`py-3 px-4 md:px-6 text-sm md:text-base font-medium border-b-2 transition-all duration-300 rounded-t-lg ${activeTab === 'Week'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-700'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <IoCalendarNumberOutline size={18} />
                  {week} Week Checklist
                </span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Question Navigation */}
          {data.length > 0 && (
            <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <IoNavigateCircleOutline size={22} />
                Question Navigation
              </h3>
              <div className="flex flex-wrap gap-3">
                {data?.map((item: any, index) => {
                  const status: any = questionStatus.find((q: any) => q.q_id === item.id)?.q_flag;
                  const statusColor = status === 'InCompleted'
                    ? 'bg-red-500 text-white shadow-red-200 dark:shadow-red-900'
                    : status === 'InProgress'
                      ? 'bg-amber-400 text-slate-800 shadow-amber-200 dark:shadow-amber-900'
                      : status === 'Completed'
                        ? 'bg-green-500 text-white shadow-green-200 dark:shadow-green-900'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-slate-200 dark:shadow-slate-900';

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(index + 1)}
                      className={` w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all hover:scale-110 shadow-md ${statusColor}`}
                      title={`Question ${index + 1} - ${status || 'Not Started'}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-slate-600 dark:text-slate-400">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Not Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                  <span className="text-slate-600 dark:text-slate-400">Not Started</span>
                </div>
              </div>
            </div>
          )}

          {/* Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.map((item: any, index: any) => {
              const status: any = questionStatus.find((q: any) => q.q_id === item.id)?.q_flag
              return (
                <div
                  key={item.id}
                  ref={questionRefs.current[index]}
                  className={`${status === "Completed" ? "cursor-not-allowed opacity-90" : "cursor-pointer"} p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md border border-slate-100 dark:border-slate-700`}
                >
                  <QuestionsCard
                    statusQ={status}
                    Qstatus={questionStatus}
                    id={item.id}
                    index={index + 1}
                    question={item.question}
                    onAnswerChange={handleAnswerChange}
                  />
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {data?.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={handleSubmit}
              >
                <IoCheckmarkCircleOutline size={20} />
                Submit Answers
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ManagerFAQ;